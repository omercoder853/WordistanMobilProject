import { apiClient } from "@/services/ApiClient";
import { ENDPOINTS } from "@/constants/ApiConfig";
import { NetworkUtils } from "@/utils/NetworkUtils";
import { dictionariesSQLite } from "@/storage/DictionariesSQLite";
import { responder, getRandomId, getUserId } from "@/utils/ApiUtils"
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";


const createDictionary = async (name, description, language, cover = 'dictionary_cover_1') => {
    const isOnline = await NetworkUtils.isOnline();
    const user_id = await getUserId();
    const localId = getRandomId();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);

    if (isOnline && !isGuest) {
        let cloudSuccess = false;
        let serverItem = null;
        try {
            console.log("🔄 Dictionary API : Creating dictionary on cloud (Supabase)...");
            const { ok, status, data } = await apiClient.post(ENDPOINTS.newDictionary, { name, description, language, cover });
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
            const sqliteOk = await dictionariesSQLite.insertDictionary({ id: finalId, user_id, name, description, language, cover, is_synced: 1 });
            if (!sqliteOk) {
                console.log("⚠️ Dictionary API : Cloud succeeded but local insert failed. Retrying...");
                await dictionariesSQLite.insertDictionary({ id: finalId, user_id, name, description, language, cover, is_synced: 1 });
            }
            return responder(true, true, 200, { ...(serverItem || {}), id: finalId, name, description, language, cover });
        }
    }

    const res = await dictionariesSQLite.insertDictionary({ id: localId, user_id, name, description, language, cover, is_synced: 0 });
    if (res) {
        return responder(true, false, 201, { id: localId, user_id, name, description, language, cover });
    } else {
        console.log("❌ Dictionary API : Dictionary could not be created in SQLite .");
        return responder(false, false, 400, null);
    }
};

const updateDictionary = async (dictId, updateFields) => {
    if (!dictId || !updateFields || Object.keys(updateFields).length === 0) {
        console.log("❌ Dictionary API : Invalid dictId or empty updateFields for update!");
        return responder(false, false, 400, null);
    }

    const isOnline = await NetworkUtils.isOnline();
    let cloudSuccess = false;
    let serverData = null;
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);

    if (isOnline && !isGuest) {
        try {
            console.log("🔄 Dictionary API : Updating dictionary on cloud (Supabase)...");
            const { ok, status, data } = await apiClient.patch(ENDPOINTS.updateDictionary(String(dictId)), updateFields);
            if (ok) {
                cloudSuccess = true;
                serverData = data;
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud update failed, will save locally:", error);
        }
    }

    const localRes = await dictionariesSQLite.updateDictionary({
        id: String(dictId),
        ...updateFields,
        is_synced: cloudSuccess ? 1 : 0
    });

    if (localRes) {
        return responder(true, cloudSuccess, 200, serverData || { id: dictId, ...updateFields });
    } else {
        console.log("❌ Dictionary API : Failed to update dictionary in SQLite.");
        return responder(false, false, 500, null);
    }
};

const deleteDictionary = async (dictId) => {
    if (!dictId || dictId === 'null' || dictId === 'undefined') {
        console.log("❌ Dictionary API : Invalid dictId for deletion, cleaning up any corrupted entries :");
        await dictionariesSQLite.softDeleteDictionary(dictId);
        return responder(true, false, 200, null);
    }

    const isOnline = await NetworkUtils.isOnline();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);

    if (isOnline && !isGuest) {
        try {
            const { ok, status, data } = await apiClient.delete(ENDPOINTS.deleteDictionary(String(dictId)));
            if (ok) {
                await dictionariesSQLite.hardDeleteDictionaries([String(dictId)]);
                return responder(true, true, status, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud dictionary deletion failed, marking soft delete locally:", error);
        }
    }

    const res = await dictionariesSQLite.softDeleteDictionary(String(dictId));
    return responder(res, false, 200, null);
};

const fetchDicts = async () => {
    const isOnline = await NetworkUtils.isOnline();
    const user_id = await getUserId();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);

    if (isOnline && !isGuest) {
        try {
            const { ok, status, data } = await apiClient.get(ENDPOINTS.dictionaries);
            if (ok && Array.isArray(data)) {
                await dictionariesSQLite.upsertDictionaries(data, user_id);
                return responder(true, true, 200, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud dictionary fetching failed, falling back to local SQLite:", error);
        }
    }

    try {
        const rows = await dictionariesSQLite.selectDictionaries(user_id);
        return responder(true, false, 200, rows);
    } catch (error) {
        console.log("❌ Dictionary API : Error while fetching dictionaries from SQLite :", error);
        return responder(false, false, 500, []);
    }
};

const getWords = async (dictId) => {
    const isOnline = await NetworkUtils.isOnline();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);

    if (isOnline && !isGuest) {
        try {
            const { ok, status, data } = await apiClient.get(ENDPOINTS.words + "/" + dictId);
            if (ok && Array.isArray(data)) {
                await dictionariesSQLite.upsertWords(data);
                return responder(true, true, 200, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud word fetching failed, falling back to local SQLite:", error);
        }
    }

    try {
        const localWords = await dictionariesSQLite.selectWords(dictId);
        return responder(true, false, 200, localWords);
    } catch (error) {
        console.error("❌ Dictionary API : Error while fetching words from local storage :", error);
        return responder(false, false, 500, null);
    }
};

const saveWord = async ({ dictionary_id, word, meaning }) => {
    // 1. Önce yerel veritabanında bu sözlük için kelime var mı kontrol et
    const existsLocally = await dictionariesSQLite.checkWordExists(dictionary_id, word);
    if (existsLocally) {
        console.log("⚠️ Dictionary API : Word already exists in this dictionary (local check).");
        return responder(false, false, 409, { message: "Word already exists in the dictionary." });
    }

    const isOnline = await NetworkUtils.isOnline();
    const localWordId = getRandomId();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);

    if (isOnline && !isGuest) {
        try {
            console.log("🔄 Dictionary API : Adding word to cloud (Supabase)...");
            const { ok, status, data } = await apiClient.post(ENDPOINTS.newWord, { dictionary_id, word, meaning });
            if (status === 409) {
                console.log("⚠️ Dictionary API : Cloud returned 409 Conflict: Word already exists.");
                return responder(false, false, 409, data);
            }
            if (ok && data) {
                const wordId = data.id ? String(data.id) : localWordId;
                await dictionariesSQLite.insertWord({
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

    const res = await dictionariesSQLite.insertWord({
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
        const alreadyExists = await dictionariesSQLite.checkWordExists(dictionary_id, word);
        if (alreadyExists) {
            return responder(false, false, 409, { message: "Word already exists in the dictionary." });
        }
        console.log("❌ Dictionary API : Word could not be created in SQLite .");
        return responder(false, false, 400, null);
    }
};

const deleteWord = async (wordId) => {
    if (!wordId || wordId === 'null' || wordId === 'undefined') {
        console.log("❌ Dictionary API : Invalid wordId for deletion!");
        return responder(false, false, 400, null);
    }

    const isOnline = await NetworkUtils.isOnline();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
    
    if (isOnline && !isGuest) {
        try {
            const { ok, status, data } = await apiClient.delete(ENDPOINTS.wordDelete + String(wordId));
            if (ok) {
                await dictionariesSQLite.hardDeleteWords([String(wordId)]);
                return responder(true, true, status, data);
            }
        } catch (error) {
            console.log("⚠️ Dictionary API : Cloud word deletion failed, marking soft delete locally:", error);
        }
    }

    const res = await dictionariesSQLite.softDeleteWord(String(wordId));
    return responder(res, false, 200, null);
};

export const dictionaryApi = {
    getWords: (dictId) => getWords(dictId),
    createDictionary: (name, description, language, cover) => createDictionary(name, description, language, cover),
    updateDictionary: (dictId, updateFields) => updateDictionary(dictId, updateFields),
    deleteDictionary: (dictId) => deleteDictionary(dictId),
    fetchDicts: () => fetchDicts(),
    saveWord: ({ dictionary_id, word, meaning }) => saveWord({ dictionary_id, word, meaning }),
    deleteWord: (wordId) => deleteWord(wordId),
};