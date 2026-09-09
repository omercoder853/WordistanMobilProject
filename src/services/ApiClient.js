import { BASE_URL } from "../constants/ApiConfig";
import { storage } from "../storage/storage";
import { STORAGE_KEYS } from "../constants/StorageKeys";
import { getNewToken } from "./AuthService";

const TIMEOUT = 15000;

async function request(endpoint, options = {}, needToken = true, isRetry = false) {
    const controller = new AbortController();
    const timer = setTimeout(() => { controller.abort() }, TIMEOUT);
    const token = needToken ? await storage.getSecure(STORAGE_KEYS.SECURE.ACCESS_TOKEN) : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && needToken ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(BASE_URL + endpoint, {
            ...options,
            headers,
            signal: controller.signal
        });

        if (response.status === 401 && needToken && !isRetry) {
            const data = await getNewToken();
            if (data) {
                return request(endpoint, options, needToken, true);
            } else {
                await storage.removeSecure(STORAGE_KEYS.SECURE.ACCESS_TOKEN);
                await storage.removeSecure(STORAGE_KEYS.SECURE.REFRESH_TOKEN);
                return {
                    ok:false,
                    status:401,
                    data:null
                }
            }
        }

        let data = null;
        const text = await response.text();
        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = text;
            }
        }

        return {
            ok: response.ok,
            status: response.status,
            data: data
        };
        
    } catch (error) {
        const isTimeOut = error.name === 'AbortError';
        return {
            ok:false,
            status: isTimeOut ? 408 : 0,
            data:null
        }
    } finally {
        clearTimeout(timer);
    }
}

export const apiClient = {
    get: (endpoint, needToken = true) => request(endpoint, { method: 'GET' }, needToken),
    post: (endpoint, body=null, needToken = true) => request(endpoint, { method: 'POST', ...(body ? { body: JSON.stringify(body) } : {}) }, needToken),
    delete: (endpoint, needToken = true) => request(endpoint, { method: 'DELETE' }, needToken),
    patch: (endpoint, body=null, needToken = true) => request(endpoint, { method: 'PATCH', ...(body ? { body: JSON.stringify(body) } : {})  }, needToken)
};