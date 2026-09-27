import { apiClient } from "@/services/ApiClient"
import { ENDPOINTS } from "@/constants/ApiConfig"
import { NetworkUtils } from "@/utils/NetworkUtils"
import { statsSQLite } from "@/storage/StatsSQLite"
import { responder, getRandomId, getUserId } from "@/utils/ApiUtils"

// ─── Level Hesaplama (PostgreSQL formüllerinin JS karşılığı) ───

function calculateLevelFields(total_xp) {
    const safeXP = Math.max(0, total_xp || 0)

    // Level: floor(pow(total_xp / 30, 1/1.2)) + 1
    const level = Math.floor(Math.pow(safeXP / 30.0, 1.0 / 1.2)) + 1

    // Bir sonraki level'e ulaşmak için gereken toplam XP eşiği
    const totalXpForNextLevel = Math.floor(30.0 * Math.pow(level, 1.2))

    // Kalan XP (level'e ulaşmak için)
    const xp_for_next = Math.max(0, totalXpForNextLevel - safeXP)

    // Mevcut level'in toplam XP aralığı
    const prevLevelTotalXp = level === 1 ? 0 : Math.floor(30.0 * Math.pow(level - 1, 1.2))
    const required_xp_for_level = totalXpForNextLevel - prevLevelTotalXp

    return { level, xp_for_next, required_xp_for_level }
}

// ─── Concurrent push koruması ───
let isPushingXPLogs = false

// ─── XP Loglama (Tüm XP işlemlerinin temeli) ───

const logXP = async ({ type, amount }) => {
    const user_id = await getUserId()
    if (!user_id) {
        console.log("❌ Stats API : logXP — user_id bulunamadı")
        return null
    }

    const id = getRandomId()
    console.log(`🔄 Stats API : logXP — type: ${type}, amount: ${amount}, id: ${id}`)

    const inserted = await statsSQLite.insertXP({ id, user_id, type, amount })
    if (!inserted) {
        console.log("❌ Stats API : logXP — SQLite insert başarısız")
        return null
    }

    // Trigger çalıştı, güncel stats'ı oku
    const stats = await statsSQLite.getUserStats(user_id)
    if (!stats) {
        console.log("❌ Stats API : logXP — getUserStats dönemedi")
        return null
    }

    // Level hesapla ve user_stats'a yaz
    const { level, xp_for_next, required_xp_for_level } = calculateLevelFields(stats.total_xp)
    await statsSQLite.updateLevelFields(user_id, level, xp_for_next, required_xp_for_level)

    const updatedStats = {
        ...stats,
        level,
        xp_for_next,
        required_xp_for_level
    }

    console.log(`✅ Stats API : logXP — Başarılı. total_xp: ${updatedStats.total_xp}, level: ${level}, xp_for_next: ${xp_for_next}`)

    // Otomatik push kontrolü (≥ 5 senkron olmayan log)
    const unsyncedCount = await statsSQLite.getUnsyncedLogCount(user_id)
    if (unsyncedCount >= 5) {
        console.log(`🔄 Stats API : logXP — ${unsyncedCount} senkron olmayan log var, otomatik push tetikleniyor...`)
        const isOnline = await NetworkUtils.isOnline()
        if (isOnline) {
            pushXPLogs().catch(e =>
                console.log("⚠️ Stats API : Otomatik push başarısız:", e.message)
            )
        }
    }

    return updatedStats
}

// ─── Stats Çekme ───

const fetchStats = async () => {
    const isOnline = await NetworkUtils.isOnline()
    const user_id = await getUserId()

    if (isOnline) {
        try {
            console.log("🔄 Stats API : fetchStats — Sunucudan stats çekiliyor...")
            const { ok, status, data } = await apiClient.get(ENDPOINTS.stats, true)
            if (ok && data) {
                console.log("✅ Stats API : fetchStats — Sunucudan başarıyla çekildi:", JSON.stringify(data))
                await statsSQLite.upsertUserStats(data)
                return responder(true, true, 200, data)
            } else {
                console.log("❌ Stats API : fetchStats — Sunucu hatası:", status)
            }
        } catch (error) {
            console.log("⚠️ Stats API : fetchStats — Sunucu isteği başarısız, yerele dönülüyor:", error.message)
        }
    }

    // Offline veya sunucu hatası → yerelden oku
    if (user_id) {
        const localStats = await statsSQLite.getUserStats(user_id)
        if (localStats) {
            const { level, xp_for_next, required_xp_for_level } = calculateLevelFields(localStats.total_xp)
            const enrichedStats = { ...localStats, level, xp_for_next, required_xp_for_level }
            console.log("📦 Stats API : fetchStats — Yerelden okundu:", JSON.stringify(enrichedStats))
            return responder(true, false, 200, enrichedStats)
        }
    }

    console.log("❌ Stats API : fetchStats — Ne sunucudan ne yerelden veri alınamadı")
    return responder(false, false, 500, null)
}

// ─── Aksiyon Bazlı XP Fonksiyonları ───

const incTranslated = async () => {
    console.log("🔄 Stats API : incTranslated — Çeviri XP kaydediliyor (type: translated_words, amount: 2)")
    return await logXP({ type: 'translated_words', amount: 2 })
}

const incSaved = async () => {
    console.log("🔄 Stats API : incSaved — Kelime kaydetme XP kaydediliyor (type: saved_words, amount: 3)")
    return await logXP({ type: 'saved_words', amount: 3 })
}

const incDictCreated = async () => {
    console.log("🔄 Stats API : incDictCreated — Sözlük oluşturma XP kaydediliyor (type: dict_created, amount: 10)")
    return await logXP({ type: 'dict_created', amount: 10 })
}

const incXP = async (amount, type = 'game_session') => {
    console.log(`🔄 Stats API : incXP — Genel XP kaydediliyor (type: ${type}, amount: ${amount})`)
    return await logXP({ type, amount })
}

// ─── XP Loglarını Sunucuya Gönderme (Push) ───

const pushXPLogs = async () => {
    if (isPushingXPLogs) {
        console.log("⚠️ Stats API : pushXPLogs — Push zaten devam ediyor, istek reddedildi")
        return { success: false, message: "Push zaten devam ediyor" }
    }
    isPushingXPLogs = true

    try {
        const isOnline = await NetworkUtils.isOnline()
        if (!isOnline) {
            console.log("⚠️ Stats API : pushXPLogs — İnternet bağlantısı yok")
            return { success: false, message: "İnternet yok" }
        }

        const user_id = await getUserId()
        if (!user_id) {
            console.log("❌ Stats API : pushXPLogs — user_id bulunamadı")
            return { success: false, message: "Kullanıcı bulunamadı" }
        }

        const logs = await statsSQLite.selectOnlyLocalLogs(user_id)
        if (!logs || logs.length === 0) {
            console.log("ℹ️ Stats API : pushXPLogs — Gönderilecek log yok")
            return { success: true, synced: false }
        }

        const xpLogsPayload = logs.map(l => ({
            id: l.id,
            amount: l.amount,
            action_type: l.action_type,
            created_at: l.created_at
        }))

        console.log(`🔄 Stats API : pushXPLogs — ${xpLogsPayload.length} log gönderiliyor:`, JSON.stringify(xpLogsPayload))

        const { ok, data } = await apiClient.post(ENDPOINTS.syncPush, { xp_logs: xpLogsPayload })

        if (ok && data?.success) {
            const syncedIds = data.synced_xp_logs_ids || []
            console.log(`✅ Stats API : pushXPLogs — Sunucu ${syncedIds.length} logu onayladı`)

            if (syncedIds.length > 0) {
                const deleted = await statsSQLite.removeSyncedLogs(syncedIds)
                if (!deleted) {
                    console.log("⚠️ Stats API : pushXPLogs — Silme başarısız, is_synced=1 yapılıyor")
                    await statsSQLite.markLogsSynced(syncedIds)
                } else {
                    console.log(`🗑️ Stats API : pushXPLogs — ${syncedIds.length} log yerelden silindi`)
                }
            }

            return { success: true, syncedCount: syncedIds.length }
        } else {
            console.log("❌ Stats API : pushXPLogs — Sunucu hatası:", data)
            return { success: false, message: "Sunucu hatası" }
        }
    } catch (error) {
        console.error("❌ Stats API : pushXPLogs — Hata:", error.message)
        return { success: false, message: error.message }
    } finally {
        isPushingXPLogs = false
    }
}

export const statsApi = {
    logXP,
    fetchStats,
    incTranslated,
    incSaved,
    incDictCreated,
    incXP,
    pushXPLogs,
    calculateLevelFields
}