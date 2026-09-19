import { apiClient } from "@/services/ApiClient";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { ENDPOINTS } from "@/constants/ApiConfig";
import { NetworkUtils } from "@/utils/NetworkUtils";
import { sqlite } from "@/storage/sqlite";
import * as Crypto from 'expo-crypto'

const responder = (ok, is_synced, status = 200, data = null) => {
    return {
        ok,
        data,
        status,
        is_synced
    }
}

const getRandomId = () => {
    const id = Crypto.randomUUID();
    if (id) return id;
}

const getUserId = async () => {
    try {
        const user = await storage.get(STORAGE_KEYS.SESSION.USER);
        const user_id = user?.sub || user?.id || null;
        return user_id;
    } catch (error) {
        console.log("❌ Dictionary API : User ID could not be retrieved :", error);
        return null;
    }
};

const createDictionary = async (name, description, language) => {
    const isOnline = await NetworkUtils.isOnline();
    const user_id = await getUserId();
    const localId = getRandomId();

    if (isOnline) {
        let cloudSuccess = false;
        let serverItem = null;
        try {
            console.log("🔄 Dictionary API : Creating dictionary on cloud (Supabase)...");
            const { ok, status, data } = await apiClient.post(ENDPOINTS.newDictionary, { name, description, language });
            if (ok) {
                cloudSuccess = true;
                serverItem = Array.isArray(data) ? data[0] : (data && typeof data === 'object' ? data : null);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud dictionary creation failed, saving to local SQLite:", error);
        }

        if (cloudSuccess) {
            const serverId = serverItem?.id;
            const finalId = serverId ? String(serverId) : localId;
            const sqliteOk = await sqlite.insertDictionary({ id: finalId, user_id, name, description, language, is_synced: 1 });
            if (!sqliteOk) {
                console.log("⚠️ Dictionary API : Cloud succeeded but local insert failed. Retrying...");
                await sqlite.insertDictionary({ id: finalId, user_id, name, description, language, is_synced: 1 });
            }
            return responder(true, true, 200, { ...(serverItem || {}), id: finalId, name, description, language });
        }
    }

    const res = await sqlite.insertDictionary({ id: localId, user_id, name, description, language, is_synced: 0 });
    if (res) {
        return responder(true, false, 201, { id: localId, user_id, name, description, language });
    } else {
        console.log("❌ Dictionary API : Dictionary could not be created in SQLite.");
        return responder(false, false, 400, null);
    }
};

const deleteDictionary = async (dictId) => {
    if (!dictId || dictId === 'null' || dictId === 'undefined') {
        console.log("❌ Dictionary API : Invalid dictId for deletion, cleaning up any corrupted entries :", dictId);
        await sqlite.softDeleteDictionary(dictId);
        return responder(true, false, 200, null);
    }

    const isOnline = await NetworkUtils.isOnline();
    if (isOnline) {
        try {
            const { ok, status, data } = await apiClient.delete(ENDPOINTS.deleteDictionary + String(dictId));
            if (ok) {
                await sqlite.hardDeleteDictionaries([String(dictId)]);
                return responder(true, true, status, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud dictionary deletion failed, marking soft delete locally:", error);
        }
    }

    const res = await sqlite.softDeleteDictionary(String(dictId));
    return responder(res, false, 200, null);
};

const fetchDicts = async () => {
    const isOnline = await NetworkUtils.isOnline();
    const user_id = await getUserId();

    if (isOnline) {
        try {
            const { ok, status, data } = await apiClient.get(ENDPOINTS.dictionaries);
            if (ok && Array.isArray(data)) {
                await sqlite.upsertDictionaries(data, user_id);
                return responder(true, true, 200, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud dictionary fetching failed, falling back to local SQLite:", error);
        }
    }

    try {
        const rows = await sqlite.selectDictionaries(user_id);
        return responder(true, false, 200, rows);
    } catch (error) {
        console.log("❌ Dictionary API : Error while fetching dictionaries from SQLite :", error);
        return responder(false, false, 500, []);
    }
};

const getWords = async (dictId) => {
    const isOnline = await NetworkUtils.isOnline();
    if (isOnline) {
        try {
            const { ok, status, data } = await apiClient.get(ENDPOINTS.words + "/" + dictId);
            if (ok && Array.isArray(data)) {
                await sqlite.upsertWords(data);
                return responder(true, true, 200, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud word fetching failed, falling back to local SQLite:", error);
        }
    }

    try {
        const localWords = await sqlite.selectWords(dictId);
        return responder(true, false, 200, localWords);
    } catch (error) {
        console.error("❌ Dictionary API : Error while fetching words from local storage :", error);
        return responder(false, false, 500, null);
    }
};

const saveWord = async ({ dictionary_id, word, meaning }) => {
    // 1. Önce yerel veritabanında bu sözlük için kelime var mı kontrol et
    const existsLocally = await sqlite.checkWordExists(dictionary_id, word);
    if (existsLocally) {
        console.log("⚠️ Dictionary API : Word already exists in this dictionary (local check).");
        return responder(false, false, 409, { message: "Word already exists in the dictionary." });
    }

    const isOnline = await NetworkUtils.isOnline();
    const localWordId = getRandomId();

    if (isOnline) {
        try {
            console.log("🔄 Dictionary API : Adding word to cloud (Supabase)...");
            const { ok, status, data } = await apiClient.post(ENDPOINTS.newWord, { dictionary_id, word, meaning });
            if (status === 409) {
                console.log("⚠️ Dictionary API : Cloud returned 409 Conflict: Word already exists.");
                return responder(false, false, 409, data);
            }
            if (ok && data) {
                const wordId = data.id ? String(data.id) : localWordId;
                await sqlite.insertWord({
                    id: wordId,
                    dictionary_id: String(dictionary_id),
                    word: data.word || word,
                    meaning: data.meaning || meaning,
                    is_synced: 1
                });
                return responder(true, true, status, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud word creation failed, saving to local SQLite:", error);
        }
    }

    const res = await sqlite.insertWord({
        id: localWordId,
        dictionary_id: String(dictionary_id),
        word,
        meaning,
        is_synced: 0
    });

    if (res) {
        return responder(true, false, 201, {
            id: localWordId,
            dictionary_id,
            word,
            meaning,
            added_at: new Date().toISOString()
        });
    } else {
        // Eğer UNIQUE constraint gibi bir sebeple eklenemediyse tekrar kontrol edelim
        const alreadyExists = await sqlite.checkWordExists(dictionary_id, word);
        if (alreadyExists) {
            return responder(false, false, 409, { message: "Word already exists in the dictionary." });
        }
        console.log("❌ Dictionary API : Word could not be created in SQLite.");
        return responder(false, false, 400, null);
    }
};

const deleteWord = async (wordId) => {
    if (!wordId || wordId === 'null' || wordId === 'undefined') {
        console.log("❌ Dictionary API : Invalid wordId for deletion :", wordId);
        return responder(false, false, 400, null);
    }

    const isOnline = await NetworkUtils.isOnline();
    if (isOnline) {
        try {
            const { ok, status, data } = await apiClient.delete(ENDPOINTS.wordDelete + String(wordId));
            if (ok) {
                await sqlite.hardDeleteWords([String(wordId)]);
                return responder(true, true, status, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud word deletion failed, marking soft delete locally:", error);
        }
    }

    const res = await sqlite.softDeleteWord(String(wordId));
    return responder(res, false, 200, null);
};

export const dictionaryApi = {
    getWords: (dictId) => getWords(dictId),
    createDictionary: (name, description, language) => createDictionary(name, description, language),
    deleteDictionary: (dictId) => deleteDictionary(dictId),
    fetchDicts: () => fetchDicts(),
    saveWord: ({ dictionary_id, word, meaning }) => saveWord({ dictionary_id, word, meaning }),
    deleteWord: (wordId) => deleteWord(wordId),
};