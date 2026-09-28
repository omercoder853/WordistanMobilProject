import { getDB } from "./sqlite";

const ALLOWED_GAMES = ["wc", "mcq", "mp"];

export function calculatePerformanceScore(correctCount, totalCount, durationSecs) {
    if (!totalCount || totalCount === 0 || !durationSecs || durationSecs <= 0) {
        return 0;
    }
    const accuracy = correctCount / totalCount;
    const avgDurationPerQuestion = durationSecs / totalCount;

    const speedRatio = 1.0 - ((avgDurationPerQuestion - 2.0) / 13.0);
    const clampedSpeedMultiplier = Math.max(0.0, Math.min(1.0, speedRatio));

    const rawScore = accuracy * (70.0 + 30.0 * clampedSpeedMultiplier);

    return Number(rawScore.toFixed(2));
}

function validateGameSession({ id, user_id, score, game_mode, total_count, correct_count,
    wrong_count, passed_count, duration_secs }) {
    if (typeof id !== 'string' || id.trim().length === 0) {
        console.log('Invalid id: Cant be empty.');
        return false;
    }
    if (typeof user_id !== 'string' || user_id.trim().length === 0) {
        console.log('Invalid userId: Cant be empty.');
        return false;
    }
    if (typeof score !== "number" || score < 0) {
        console.log(`Invalid score: Should be positive number or zero. Input: ${score}`);
        return false;
    }
    if (!ALLOWED_GAMES.includes(game_mode)) {
        console.log(`Invalid game type: "${game_mode}". Allowed: ${ALLOWED_GAMES.join(', ')}`);
        return false;
    }
    if (typeof correct_count !== "number" || correct_count < 0) {
        console.log(`Invalid correct_count: Should be positive number or zero. Input: ${correct_count}`);
        return false;
    }
    if (typeof wrong_count !== "number" || wrong_count < 0) {
        console.log(`Invalid wrong_count: Should be positive number or zero. Input: ${wrong_count}`);
        return false;
    }
    if (typeof passed_count !== "number" || passed_count < 0) {
        console.log(`Invalid passed_count: Should be positive number or zero. Input: ${passed_count}`);
        return false;
    }
    if (typeof duration_secs !== "number" || duration_secs < 0) {
        console.log(`Invalid duration_secs: Should be positive number or zero. Input: ${duration_secs}`);
        return false;
    }
    if (typeof total_count !== "number" || total_count <= 0 || total_count !== correct_count + passed_count + wrong_count) {
        console.log(`Invalid total_count: Should be positive number and sum of correct + passed + wrong. Input: ${total_count}`);
        return false;
    }
    return true;
}

const upsertSessions = async (user_id, serverSessions) => {
    if (!Array.isArray(serverSessions) || serverSessions.length === 0) return;
    const db = await getDB();
    await db.withTransactionAsync(async () => {
        for (const s of serverSessions) {
            await db.runAsync(
                `INSERT INTO game_sessions (id, user_id, score, performance_score, game_mode, total_count, 
                correct_count, wrong_count, passed_count, duration_secs, is_synced, played_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                 ON CONFLICT(id) DO UPDATE SET
                 score = excluded.score,
                 performance_score = excluded.performance_score,
                 game_mode = excluded.game_mode,
                 total_count = excluded.total_count,
                 correct_count = excluded.correct_count,
                 wrong_count = excluded.wrong_count,
                 passed_count = excluded.passed_count,
                 duration_secs = excluded.duration_secs,
                 played_at = excluded.played_at,
                 is_synced = 1`,
                [
                    String(s.id),
                    String(s.user_id || user_id),
                    s.score,
                    s.performance_score ?? null,
                    s.game_mode,
                    s.total_count,
                    s.correct_count,
                    s.wrong_count,
                    s.passed_count,
                    s.duration_secs,
                    s.played_at ?? new Date().toISOString()
                ]
            );
        }
    });
};

const insertGameSession = async (payload) => {
    const isValid = validateGameSession(payload);
    if (!isValid) return false;

    const performance_score = payload.performance_score != null
        ? payload.performance_score
        : calculatePerformanceScore(payload.correct_count, payload.total_count, payload.duration_secs);

    const is_synced = payload.is_synced != null ? payload.is_synced : 0;
    const played_at = payload.played_at || new Date().toISOString();

    try {
        const db = await getDB();
        const res = await db.runAsync(
            `INSERT INTO game_sessions (
                id, user_id, score, performance_score, game_mode,
                total_count, correct_count, wrong_count, passed_count,
                duration_secs, is_synced, played_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                score = excluded.score,
                performance_score = excluded.performance_score,
                game_mode = excluded.game_mode,
                total_count = excluded.total_count,
                correct_count = excluded.correct_count,
                wrong_count = excluded.wrong_count,
                passed_count = excluded.passed_count,
                duration_secs = excluded.duration_secs,
                is_synced = excluded.is_synced,
                played_at = excluded.played_at`,
            [
                String(payload.id),
                String(payload.user_id),
                payload.score,
                performance_score,
                payload.game_mode,
                payload.total_count,
                payload.correct_count,
                payload.wrong_count,
                payload.passed_count,
                payload.duration_secs,
                is_synced,
                played_at
            ]
        );
        return res.changes > 0;
    } catch (error) {
        console.error("❌ Game Session Ekleme Hatası:", error.message);
        console.error("Gönderilen Parametreler:", { ...payload });
        return false;
    }
};

const selectGameSessions = async (user_id) => {
    if (!user_id) return [];
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT * FROM game_sessions WHERE user_id = ? ORDER BY played_at DESC`,
            [String(user_id)]
        );
        return rows;
    } catch (error) {
        console.log("❌ SQLite Game Sessions çekme hatası : ", error);
        return [];
    }
};

const selectUnsyncedGameSessions = async (user_id) => {
    if (!user_id) return [];
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT id, score, performance_score, game_mode, total_count, correct_count, 
                    wrong_count, passed_count, duration_secs, played_at 
             FROM game_sessions 
             WHERE user_id = ? AND is_synced = 0 
             ORDER BY played_at ASC`,
            [String(user_id)]
        );
        return rows;
    } catch (error) {
        console.log("❌ SQLite Local Game Sessions çekme hatası : ", error);
        return [];
    }
};

const markSessionsSynced = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
        const db = await getDB();
        const placeholders = ids.map(() => '?').join(',');
        await db.runAsync(
            `UPDATE game_sessions SET is_synced = 1 WHERE id IN (${placeholders})`,
            ids.map(String)
        );
        return true;
    } catch (error) {
        console.error("❌ SQLite markSessionsSynced Hatası:", error.message);
        return false;
    }
};

export const gamesSQLite = {
    insertGameSession: (payload) => insertGameSession(payload),
    upsertSessions: (user_id, serverSessions) => upsertSessions(user_id, serverSessions),
    selectGameSessions: (user_id) => selectGameSessions(user_id),
    selectUnsyncedGameSessions: (user_id) => selectUnsyncedGameSessions(user_id),
    markSessionsSynced: (ids) => markSessionsSynced(ids),
    calculatePerformanceScore
};