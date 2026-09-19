import { NetworkUtils } from '@/utils/NetworkUtils';
import { apiClient } from '@/services/ApiClient';
import { sqlite } from '@/storage/sqlite';
import { ENDPOINTS } from '@/constants/ApiConfig';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { storage } from '@/storage/storage';
import { syncEvents } from '@/services/syncEvents';

let isPulling = false;
let isPushing = false;
let isSyncingAll = false;

export const syncService = {
    /**
     * Buluttaki sözlükleri çekip yerel SQLite'a yazar (PULL).
     * @returns {Promise<{success: boolean, message?: string, count?: number} | null>}
     */
    pullDictionaries: async () => {
        if (isPulling) {
            console.warn("⚠️ pullDictionaries işlemi halen devam ediyor, yeni istek reddedildi (return null).");
            return null;
        }
        isPulling = true;

        try {
            const isOnline = await NetworkUtils.isOnline();
            if (!isOnline) {
                return { success: false, message: "İnternet bağlantısı yok, sync atlandı." };
            }

            console.log("🔄 Sync Service : Pull started, requesting dictionaries from server...");

            const { ok, status, data } = await apiClient.get(ENDPOINTS.dictionaries);

            if (!ok || !Array.isArray(data)) {
                console.warn("⚠️ Sunucudan sözlük verisi alınamadı:", status);
                return { success: false, message: "Sunucu hatası." };
            }

            const remoteDicts = data;
            console.log(`📥 Sync Service : ${remoteDicts.length} dictionaries received from server.`);

            const user = await storage.get(STORAGE_KEYS.SESSION.USER);
            const user_id = user?.sub || user?.id || null;

            await sqlite.upsertDictionaries(remoteDicts, user_id);

            // Sözlükler çekildikten sonra her sözlüğün kelimelerini de çek
            console.log("🔄 Sync Service : Pulling words for each dictionary...");
            for (const dict of remoteDicts) {
                const dictId = dict.id || dict.dict_id;
                if (!dictId) continue;
                try {
                    const wordRes = await apiClient.get(ENDPOINTS.words + "/" + dictId);
                    if (wordRes.ok && Array.isArray(wordRes.data)) {
                        await sqlite.upsertWords(wordRes.data);
                    }
                } catch (wordErr) {
                    console.log("⚠️ Sync Service : Failed to pull words for dict:", dictId, wordErr);
                }
            }

            console.log("✅ Sync Service : Local SQLite successfully updated (dicts + words).");
            return { success: true, count: remoteDicts.length };

        } catch (error) {
            console.error("❌ Sync Pull Hatası:", error);
            return { success: false, message: error.message };
        } finally {
            isPulling = false;
        }
    },

    /**
     * Yerelde oluşturulan/silinen verileri sunucuya gönderir ve sunucu onayına göre yerel durumu günceller (PUSH).
     * @returns {Promise<{success: boolean, message?: string, data?: any} | null>}
     */
    pushDictionaries: async () => {
        if (isPushing) {
            console.warn("⚠️ pushDictionaries işlemi halen devam ediyor, yeni istek reddedildi (return null).");
            return null;
        }
        isPushing = true;

        try {
            const isOnline = await NetworkUtils.isOnline();
            if (!isOnline) {
                return { success: false, message: "İnternet bağlantısı yok, sync atlandı." };
            }

            const user = await storage.get(STORAGE_KEYS.SESSION.USER);
            const user_id = user?.sub || user?.id;
            if (!user_id) {
                console.warn("⚠️ Aktif kullanıcı bulunamadı, push sync atlandı.");
                return { success: false, message: "Kullanıcı oturumu bulunamadı." };
            }

            console.log("🔄 Sync Service : Push started, sending local changes to server...");

            const localDicts = await sqlite.selectOnlyLocalDictionaries(user_id);
            const deletedDictIds = await sqlite.selectOnlyDeletedDictionaries(user_id);
            const localWords = await sqlite.selectOnlyLocalWords(user_id);
            const deletedWordIds = await sqlite.selectOnlyDeletedWords(user_id);

            const payload = {};
            if (localDicts.length > 0) {
                payload.dictionaries = localDicts;
            }
            if (deletedDictIds.length > 0) {
                payload.deleted_dictionary_ids = deletedDictIds;
            }
            if (localWords.length > 0) {
                // Backend WordPushItem bekliyor: id, dictionary_id, word, meaning, created_at
                // SQLite'tan gelen: id, dictionary_id, word, meaning, added_at
                payload.words = localWords.map(w => ({
                    id: w.id,
                    dictionary_id: w.dictionary_id,
                    word: w.word,
                    meaning: w.meaning,
                    created_at: w.added_at || null
                }));
            }
            if (deletedWordIds.length > 0) {
                // Backend field adı: deleted_words_ids (dikkat: "words" çoğul)
                payload.deleted_words_ids = deletedWordIds;
            }

            if (Object.keys(payload).length === 0) {
                console.log("ℹ️ Sync Service : No local changes to push.");
                return { success: true, message: "Senkronize edilecek yerel veri yok.", synced: false };
            }

            const { ok, status, data } = await apiClient.post(ENDPOINTS.syncPush, payload);
            console.log("📥 Sync Service : Push response received :", status, data);

            if (ok && data?.success) {
                // 1. Sunucu tarafından onaylanan sözlükleri senkronize edildi (is_synced = 1) olarak işaretle
                if (Array.isArray(data.synced_dictionary_ids) && data.synced_dictionary_ids.length > 0) {
                    console.log("🔄 Sync Service : Marking dictionaries as synced in local SQLite...");
                    await sqlite.markDictionariesSynced(data.synced_dictionary_ids);
                }

                // 2. Silinmesi sunucuya başarıyla iletilen sözlükleri yerel SQLite'tan kalıcı olarak kaldır
                if (deletedDictIds.length > 0) {
                    console.log("🗑️ Sync Service : Cleaning up deleted dictionaries from local SQLite...");
                    await sqlite.hardDeleteDictionaries(deletedDictIds);
                }

                // 3. Sunucu tarafından onaylanan kelimeleri senkronize edildi olarak işaretle
                if (Array.isArray(data.synced_word_ids) && data.synced_word_ids.length > 0) {
                    console.log("🔄 Sync Service : Marking words as synced in local SQLite...");
                    await sqlite.markWordsSynced(data.synced_word_ids);
                }

                // 4. Silinmesi sunucuya iletilen kelimeleri yerel SQLite'tan kalıcı olarak kaldır
                if (deletedWordIds.length > 0) {
                    console.log("🗑️ Sync Service : Permanently deleting words from local SQLite...");
                    await sqlite.hardDeleteWords(deletedWordIds);
                }

                console.log("✅ Sync Service : Local changes successfully synced with server.");
                return { success: true, data };
            } else {
                console.error("❌ Veriler senkronize edilirken hata oluştu:", status, data);
                return { success: false, status, message: "Senkronizasyon sunucu hatası." };
            }
        } catch (error) {
            console.error("❌ Sync Push Hatası:", error);
            return { success: false, message: error.message };
        } finally {
            isPushing = false;
        }
    },

    /**
     * Önce bekleyen yerel değişiklikleri sunucuya gönderir (PUSH),
     * ardından sunucudaki güncel sözlükleri ve kelimeleri çeker (PULL).
     * Tamamlandığında syncEvents üzerinden DictContext'e bildirim gönderir.
     */
    syncAll: async () => {
        if (isSyncingAll) {
            console.warn("⚠️ syncAll işlemi halen devam ediyor, yeni istek reddedildi (return null).");
            return null;
        }
        isSyncingAll = true;

        try {
            console.log("🔄 Sync Service : Full synchronization (Push -> Pull) started...");
            const pushResult = await syncService.pushDictionaries();
            const pullResult = await syncService.pullDictionaries();

            // Sync tamamlandığında UI'ın güncellenmesi için event emit et
            syncEvents.emitSyncComplete();
            console.log("✅ Sync Service : Full synchronization completed. UI refresh triggered.");

            return { push: pushResult, pull: pullResult };
        } finally {
            isSyncingAll = false;
        }
    }
};