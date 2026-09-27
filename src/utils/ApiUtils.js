import { storage } from "@/storage/storage"
import { STORAGE_KEYS } from "@/constants/StorageKeys"
import * as Crypto from 'expo-crypto'

export const responder = (ok, is_synced, status = 200, data = null) => {
    return {
        ok,
        data,
        status,
        is_synced
    }
}

export const getRandomId = () => {
    const id = Crypto.randomUUID();
    if (id) return id;
}

export const getUserId = async () => {
    try {
        const user = await storage.get(STORAGE_KEYS.SESSION.USER);
        const user_id = user?.sub || user?.id || null;
        return user_id;
    } catch (error) {
        console.log("❌ ApiUtils : User ID could not be retrieved :", error);
        return null;
    }
}
