import { getDB } from "./sqlite";

const ALLOWED_ACTIONS = [
  'streak', 
  'translated_words', 
  'saved_words', 
  'dict_created', 
  'game_session',
  'achievement'
];

function validateXpLog({ id, user_id, type, amount }) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    console.log('Invalid id: Cant be empty.');
    return false;
  }
  if (typeof user_id !== 'string' || user_id.trim().length === 0) {
    console.log('Invalid userId: Cant be empty.');
    return false;
  }
  if (!ALLOWED_ACTIONS.includes(type)) {
    console.log(`Invalid type: "${type}". Allowed: ${ALLOWED_ACTIONS.join(', ')}`);
    return false;
  }
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
    console.log(`Invalid amount: Should be positive integer. Input: ${amount}`);
    return false;
  }
  return true;
}

const insertXP = async (payload) => {
    const isValid = validateXpLog(payload);
    if (!isValid) return;
    try {
        const {id,user_id,type,amount} = payload
        const db = await getDB();
        const res = await db.runAsync(
            `INSERT INTO xp_logs (id , user_id , action_type , amount)
             VALUES (? , ? , ? , ?)` , [String(id) , String(user_id) , type , amount]
        )
        return res.changes > 0
    } catch (error) {
        console.error("❌ SQLite Ekleme Hatası:", error.message);
        return false;
    }
}

const selectOnlyLocalLogs = async (user_id) => {
    if (!user_id || user_id.trim()==="" || user_id==undefined) {
        console.log("❌ SQLite Error : user_id is undefined");
        return [];
    }
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT id, amount, action_type, created_at FROM xp_logs WHERE user_id = ? AND is_synced = 0`,[user_id]
        )
        return rows
    } catch (error) {
        console.error("❌ SQLite Local XP LOG Çekme Hatası:", error.message);
        return [];
    }
}

const removeSyncedLogs = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
        const db = await getDB();
        const placeholders = ids.map(() => '?').join(',');
        await db.runAsync(
            `DELETE FROM xp_logs WHERE id IN (${placeholders})`,
            ids
        );
        return true;
    } catch (error) {
        console.error("❌ SQLite removeSyncedLogs Hatası:", error.message);
        return false;
    }
}

const markLogsSynced = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
        const db = await getDB();
        const placeholders = ids.map(() => '?').join(',');
        await db.runAsync(
            `UPDATE xp_logs SET is_synced = 1 WHERE id IN (${placeholders})`,
            ids
        );
        return true;
    } catch (error) {
        console.error("❌ SQLite markLogsSynced Hatası:", error.message);
        return false;
    }
}

const getUserStats = async (user_id) => {
    if (!user_id) {
        console.log("❌ Stats SQLite : getUserStats — user_id is undefined");
        return null;
    }
    try {
        const db = await getDB();
        const row = await db.getFirstAsync(
            `SELECT * FROM user_stats WHERE user_id = ?`, [String(user_id)]
        )
        return row || null
    } catch (error) {
        console.error("❌ Stats SQLite : getUserStats Hatası:", error.message);
        return null;
    }
}

const upsertUserStats = async (stats) => {
    if (!stats || !stats.user_id) {
        console.log("❌ Stats SQLite : upsertUserStats — stats or user_id is missing");
        return false;
    }
    try {
        const db = await getDB();
        await db.runAsync(
            `INSERT INTO user_stats (user_id, total_xp, current_streak, max_streak, last_activity_date, 
            translated_words, saved_words, dict_created, updated_at, level, xp_for_next, required_xp_for_level)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id) DO UPDATE SET
                total_xp = excluded.total_xp,
                current_streak = excluded.current_streak,
                max_streak = excluded.max_streak,
                last_activity_date = excluded.last_activity_date,
                translated_words = excluded.translated_words,
                saved_words = excluded.saved_words,
                dict_created = excluded.dict_created,
                updated_at = excluded.updated_at,
                level = excluded.level,
                xp_for_next = excluded.xp_for_next,
                required_xp_for_level = excluded.required_xp_for_level`,
            [
                String(stats.user_id),
                stats.total_xp || 0,
                stats.current_streak || 0,
                stats.max_streak || 0,
                stats.last_activity_date || null,
                stats.translated_words || 0,
                stats.saved_words || 0,
                stats.dict_created || 0,
                stats.updated_at || new Date().toISOString(),
                stats.level || 1,
                stats.xp_for_next || 0,
                stats.required_xp_for_level || 0
            ]
        )
        return true;
    } catch (error) {
        console.error("❌ Stats SQLite : upsertUserStats Hatası:", error.message);
        return false;
    }
}

const updateLevelFields = async (user_id, level, xp_for_next, required_xp_for_level) => {
    if (!user_id) return false;
    try {
        const db = await getDB();
        await db.runAsync(
            `UPDATE user_stats SET level = ?, xp_for_next = ?, required_xp_for_level = ? WHERE user_id = ?`,
            [level, xp_for_next, required_xp_for_level, String(user_id)]
        )
        return true;
    } catch (error) {
        console.error("❌ Stats SQLite : updateLevelFields Hatası:", error.message);
        return false;
    }
}

const getUnsyncedLogCount = async (user_id) => {
    if (!user_id) return 0;
    try {
        const db = await getDB();
        const row = await db.getFirstAsync(
            `SELECT COUNT(*) as count FROM xp_logs WHERE user_id = ? AND is_synced = 0`, [String(user_id)]
        )
        return row?.count || 0
    } catch (error) {
        console.error("❌ Stats SQLite : getUnsyncedLogCount Hatası:", error.message);
        return 0;
    }
}

export const statsSQLite = {
    insertXP : (payload) => insertXP(payload),
    selectOnlyLocalLogs : (user_id) => selectOnlyLocalLogs(user_id),
    removeSyncedLogs : (ids) => removeSyncedLogs(ids),
    markLogsSynced : (ids) => markLogsSynced(ids),
    getUserStats : (user_id) => getUserStats(user_id),
    upsertUserStats : (stats) => upsertUserStats(stats),
    updateLevelFields : (user_id, level, xp_for_next, required_xp_for_level) => updateLevelFields(user_id, level, xp_for_next, required_xp_for_level),
    getUnsyncedLogCount : (user_id) => getUnsyncedLogCount(user_id)
}