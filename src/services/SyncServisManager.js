import { AppState } from 'react-native';
import { NetworkUtils } from '@/utils/NetworkUtils';
import { apiClient } from '@/services/ApiClient';
import { dictionariesSQLite } from '@/storage/DictionariesSQLite';
import { statsSQLite } from '@/storage/StatsSQLite';
import { ENDPOINTS } from '@/constants/ApiConfig';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { storage } from '@/storage/storage';
import { syncEvents } from '@/services/SyncEvents';
import { statsApi } from '@/api/StatsApi';
import { gamesSQLite } from '@/storage/GamesSQLite';

let isPulling = false;
let isPushing = false;
let isSyncingAll = false;
let appStateSubscription = null;

const getUserId = async () => {
    const user = await storage.get(STORAGE_KEYS.SESSION.USER);
    return user?.sub || user?.id || null;
}

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

            const user_id = await getUserId();

            await dictionariesSQLite.upsertDictionaries(remoteDicts, user_id);

            // Sözlükler çekildikten sonra her sözlüğün kelimelerini de çek
            console.log("🔄 Sync Service : Pulling words for each dictionary...");
            for (const dict of remoteDicts) {
                const dictId = dict.id || dict.dict_id;
                if (!dictId) continue;
                try {
                    const wordRes = await apiClient.get(ENDPOINTS.words + "/" + dictId);
                    if (wordRes.ok && Array.isArray(wordRes.data)) {
                        await dictionariesSQLite.upsertWords(wordRes.data);
                    }
                } catch (wordErr) {
                    console.log("⚠️ Sync Service : Failed to pull words for dict:", wordErr);
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
     * Sunucudan güncel user_stats çekip yerel SQLite'a yazar (PULL STATS).
     * @returns {Promise<{success: boolean, data?: any}>}
     */
    pullUserStats: async () => {
        try {
            const isOnline = await NetworkUtils.isOnline();
            if (!isOnline) {
                console.log("⚠️ Sync Service : pullUserStats — İnternet yok, atlandı.");
                return { success: false, message: "İnternet yok" };
            }

            console.log("🔄 Sync Service : pullUserStats — Sunucudan user_stats çekiliyor...");
            const { ok, data } = await apiClient.get(ENDPOINTS.stats, true);
            if (ok && data) {
                await statsSQLite.upsertUserStats(data);
                console.log("✅ Sync Service : pullUserStats — Sunucudan çekildi ve SQLite'a yazıldı!");
                return { success: true, data };
            }

            console.log("❌ Sync Service : pullUserStats — Sunucu isteği başarısız");
            return { success: false };
        } catch (error) {
            console.error("❌ Sync Service : pullUserStats Hatası:", error.message);
            return { success: false, message: error.message };
        }
    },

    /**
     * Sunucudan güncel game_sessions çekip yerel SQLite'a yazar (PULL GAME SESSIONS).
     * @returns {Promise<{success: boolean, count?: number}>}
     */
    pullGameSessions: async () => {
        try {
            const isOnline = await NetworkUtils.isOnline();
            if (!isOnline) {
                console.log("⚠️ Sync Service : pullGameSessions — İnternet yok, atlandı.");
                return { success: false, message: "İnternet yok" };
            }

            console.log("🔄 Sync Service : pullGameSessions — Sunucudan game_sessions çekiliyor...");
            const { ok, data } = await apiClient.get(ENDPOINTS.gameSessions);
            if (ok && data && Array.isArray(data.sessions)) {
                const user_id = await getUserId();
                await gamesSQLite.upsertSessions(user_id, data.sessions);
                console.log(`✅ Sync Service : pullGameSessions — ${data.sessions.length} oturum çekildi ve SQLite'a yazıldı.`);
                return { success: true, count: data.sessions.length };
            }

            console.log("❌ Sync Service : pullGameSessions — Sunucu isteği başarısız");
            return { success: false };
        } catch (error) {
            console.error("❌ Sync Service : pullGameSessions Hatası:", error.message);
            return { success: false, message: error.message };
        }
    },

    /**
     * Yerelde oluşturulan/silinen verileri sunucuya gönderir ve sunucu onayına göre yerel durumu günceller (PUSH).
     * @returns {Promise<{success: boolean, message?: string, data?: any} | null>}
     */
    pushData: async () => {
        if (isPushing) {
            console.warn("⚠️ pushData işlemi halen devam ediyor, yeni istek reddedildi (return null).");
            return null;
        }
        isPushing = true;

        try {
            const isOnline = await NetworkUtils.isOnline();
            if (!isOnline) {
                return { success: false, message: "İnternet bağlantısı yok, sync atlandı." };
            }

            const user_id = await getUserId();
            if (!user_id) {
                console.warn("⚠️ Aktif kullanıcı bulunamadı, push sync atlandı.");
                return { success: false, message: "Kullanıcı oturumu bulunamadı." };
            }

            console.log("🔄 Sync Service : Push started, sending local changes to server...");

            const localDicts = await dictionariesSQLite.selectOnlyLocalDictionaries(user_id);
            const deletedDictIds = await dictionariesSQLite.selectOnlyDeletedDictionaries(user_id);
            const localWords = await dictionariesSQLite.selectOnlyLocalWords(user_id);
            const deletedWordIds = await dictionariesSQLite.selectOnlyDeletedWords(user_id);

            const localXPLogs = await statsSQLite.selectOnlyLocalLogs(user_id);
            const localGameSessions = await gamesSQLite.selectUnsyncedGameSessions(user_id);

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
            if (localXPLogs.length > 0) {
                payload.xp_logs = localXPLogs.map(l => ({
                    id: l.id,
                    amount: l.amount,
                    action_type: l.action_type,
                    created_at: l.created_at
                }));
                console.log(`📤 Sync Service : ${localXPLogs.length} XP log push'a dahil edildi`);
            }
            if (localGameSessions.length > 0) {
                payload.game_sessions = localGameSessions;
                console.log(`📤 Sync Service : ${localGameSessions.length} game sessions push'a dahil edildi`);
            }

            if (Object.keys(payload).length === 0) {
                console.log("ℹ️ Sync Service : No local changes to push.");
                return { success: true, message: "Senkronize edilecek yerel veri yok.", synced: false };
            }

            console.log("📤 Sync Service : Push payload gönderiliyor!");
            const { ok, status, data } = await apiClient.post(ENDPOINTS.syncPush, payload);
            console.log("📥 Sync Service : Push response received :", status);

            if (ok && data?.success) {
                // 1. Sunucu tarafından onaylanan sözlükleri senkronize edildi (is_synced = 1) olarak işaretle
                if (Array.isArray(data.synced_dictionary_ids) && data.synced_dictionary_ids.length > 0) {
                    console.log("🔄 Sync Service : Marking dictionaries as synced in local dictionariesSQLite...");
                    await dictionariesSQLite.markDictionariesSynced(data.synced_dictionary_ids);
                }

                // 2. Silinmesi sunucuya başarıyla iletilen sözlükleri yerel SQLite'tan kalıcı olarak kaldır
                if (deletedDictIds.length > 0) {
                    console.log("🗑️ Sync Service : Cleaning up deleted dictionaries from local dictionariesSQLite...");
                    await dictionariesSQLite.hardDeleteDictionaries(deletedDictIds);
                }

                // 3. Sunucu tarafından onaylanan kelimeleri senkronize edildi olarak işaretle
                if (Array.isArray(data.synced_word_ids) && data.synced_word_ids.length > 0) {
                    console.log("🔄 Sync Service : Marking words as synced in local dictionariesSQLite...");
                    await dictionariesSQLite.markWordsSynced(data.synced_word_ids);
                }

                // 4. Silinmesi sunucuya iletilen kelimeleri yerel SQLite'tan kalıcı olarak kaldır
                if (deletedWordIds.length > 0) {
                    console.log("🗑️ Sync Service : Permanently deleting words from local dictionariesSQLite...");
                    await dictionariesSQLite.hardDeleteWords(deletedWordIds);
                }

                // 5. Sunucu tarafından onaylanan XP loglarını sil (veya is_synced=1 yap)
                if (Array.isArray(data.synced_xp_logs_ids) && data.synced_xp_logs_ids.length > 0) {
                    console.log(`🔄 Sync Service : ${data.synced_xp_logs_ids.length} XP log sunucu tarafından onaylandı`);
                    const deleted = await statsSQLite.removeSyncedLogs(data.synced_xp_logs_ids);
                    if (!deleted) {
                        console.log("⚠️ Sync Service : XP log silme başarısız, is_synced=1 yapılıyor");
                        await statsSQLite.markLogsSynced(data.synced_xp_logs_ids);
                    } else {
                        console.log(`🗑️ Sync Service : ${data.synced_xp_logs_ids.length} XP log yerelden silindi`);
                    }
                }

                // 6. Sunucu tarafından onaylanan game_sessions oturumlarını senkronize edildi (is_synced = 1) olarak işaretle
                if (Array.isArray(data.synced_game_sessions) && data.synced_game_sessions.length > 0) {
                    console.log(`🔄 Sync Service : Marking ${data.synced_game_sessions.length} game sessions as synced in local GamesSQLite...`);
                    await gamesSQLite.markSessionsSynced(data.synced_game_sessions);
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
     * ardından sunucudaki güncel sözlükleri, kelimeleri ve stats'ı çeker (PULL).
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
            const pushResult = await syncService.pushData();
            if (!pushResult?.success) {
                console.warn("⚠️ Sync Service : Push failed, skipping pull to preserve local changes.");
                return {
                    push: pushResult,
                    pullDicts: null,
                    pullStats: null,
                    pullGames: null
                };
            }

            const pullDictResult = await syncService.pullDictionaries();
            const pullStatsResult = await syncService.pullUserStats();
            const pullGamesResult = await syncService.pullGameSessions();

            // Sync tamamlandığında UI'ın güncellenmesi için event emit et
            syncEvents.emitSyncComplete();
            console.log("✅ Sync Service : Full synchronization completed. UI refresh triggered.");

            return { push: pushResult, pullDicts: pullDictResult, pullStats: pullStatsResult, pullGames: pullGamesResult };
        } finally {
            isSyncingAll = false;
        }
    },

    /**
     * AppState dinleyicisini başlatır.
     * background/inactive → XP loglarını push et
     * active → tam senkronizasyon yap
     */
    initAppStateListener: () => {
        if (appStateSubscription) return;

        
        appStateSubscription = AppState.addEventListener('change', async (nextState) => {
            const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
            if (isGuest) {
                console.log("❌ Misafir hesabı kullanılıyor. App State etkisiz kalacak...");
                return;
            }
            if (nextState === 'background' || nextState === 'inactive') {
                console.log("📱 Sync Service : Uygulama arka plana geçti, XP logları push ediliyor...");
                const isOnline = await NetworkUtils.isOnline();
                if (isOnline) {
                    await statsApi.pushXPLogs().catch(e =>
                        console.log("⚠️ Sync Service : AppState background push başarısız:", e.message)
                    );
                }
            }
            if (nextState === 'active') {
                console.log("📱 Sync Service : Uygulama öne geldi, senkronizasyon kontrol ediliyor...");
                const isOnline = await NetworkUtils.isOnline();
                if (isOnline) {
                    await syncService.syncAll().catch(e =>
                        console.log("⚠️ Sync Service : AppState active sync başarısız:", e.message)
                    );
                }
            }
        });

        console.log("✅ Sync Service : AppState listener başlatıldı");
    },

    /**
     * AppState dinleyicisini temizler.
     */
    removeAppStateListener: () => {
        if (appStateSubscription) {
            appStateSubscription.remove();
            appStateSubscription = null;
            console.log("🔄 Sync Service : AppState listener kaldırıldı");
        }
    },

    /**
     * Sadece XP loglarını sunucuya gönderir (StatsApi üzerinden).
     */
    pushXPLogs: () => statsApi.pushXPLogs()
};