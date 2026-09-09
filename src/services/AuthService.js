import { BASE_URL,ENDPOINTS } from "../constants/ApiConfig"; 
import { storage } from "../storage/storage";
import { STORAGE_KEYS } from "../constants/StorageKeys";

const TIMEOUT = 15000;
let refreshPromise = null;

export const getNewToken = async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = refreshAccessToken();
    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

const refreshAccessToken = async () => {
    const storedRefreshToken = await storage.getSecure(STORAGE_KEYS.SECURE.REFRESH_TOKEN);
    const refresh_token = storedRefreshToken;
    if (!refresh_token) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT)

    try {
        console.log("Requesting for a new access token with refresh token...")
        const res = await fetch(BASE_URL + ENDPOINTS.refresh, {
            body: JSON.stringify({ refresh_token: refresh_token }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        })

        if (res.ok) {
            const data = await res.json();
            console.log("Token refreshed successfully")

            await storage.setSecure(STORAGE_KEYS.SECURE.ACCESS_TOKEN, data['access_token']);
            await storage.setSecure(STORAGE_KEYS.SECURE.REFRESH_TOKEN, data['refresh_token']);
            return ({acc_token:data['access_token'],ref_token:data['refresh_token']})
        }
        else {
            const errNdy = await res.text();
            console.log("Response is not ok. Status : ", res.status, errNdy);
        }
    } catch (error) {
        console.log("Token could not be refreshed. ", error);
    } finally {
        clearTimeout(timer);
    }
    return null;
}

