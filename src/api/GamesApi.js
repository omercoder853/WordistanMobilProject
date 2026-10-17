import { apiClient } from "@/services/ApiClient";
import { ENDPOINTS } from "@/constants/ApiConfig";
import { gamesSQLite } from "@/storage/GamesSQLite";
import { NetworkUtils } from "@/utils/NetworkUtils";
import { responder, getRandomId, getUserId } from "@/utils/ApiUtils";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";

export function EnrichGameSessions(sessions) {
    if (!Array.isArray(sessions) || sessions.length === 0) {
        return {
            sessions: [],
            totals: {
                total: 0,
                correct: 0,
                wrong: 0,
                passed: 0,
                duration: 0
            },
            average_score: 0,
            average_performance_score: 0,
            game_mode_counts: { mp: 0, wc: 0, mcq: 0 },
            best_performance: {
                id: null,
                score: 0
            }
        };
    }

    let total = 0;
    let correct = 0;
    let wrong = 0;
    let passed = 0;
    let sum_score = 0;
    let sum_performance_score = 0;
    let duration = 0;
    const game_mode_counts = { mp: 0, wc: 0, mcq: 0 };
    let best_id = sessions[0]?.id || null;
    let best_score = sessions[0]?.performance_score ?? sessions[0]?.score ?? 0;

    for (const s of sessions) {
        const perf = s.performance_score ?? s.score ?? 0;
        if (perf > best_score) {
            best_id = s.id;
            best_score = perf;
        }
        total += s.total_count || 0;
        correct += s.correct_count || 0;
        wrong += s.wrong_count || 0;
        passed += s.passed_count || 0;
        sum_score += s.score || 0;
        duration += s.duration_secs || 0;
        sum_performance_score += perf;

        const mode = s.game_mode;
        if (game_mode_counts[mode] !== undefined) {
            game_mode_counts[mode] += 1;
        }
    }

    const count = sessions.length;
    return {
        sessions: sessions,
        totals: {
            total: total,
            correct: correct,
            wrong: wrong,
            passed: passed,
            duration: duration
        },
        average_score: Number((sum_score / count).toFixed(2)),
        average_performance_score: Number((sum_performance_score / count).toFixed(2)),
        game_mode_counts: game_mode_counts,
        best_performance: {
            id: best_id,
            score: Number(best_score.toFixed(2))
        }
    };
}

const getGameSessions = async () => {
    const isOnline = await NetworkUtils.isOnline();
    const user_id = await getUserId();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
    if (!user_id) {
        console.log("❌ Games API : getGameSessions — user_id is missing");
        return responder(false, false, 401, EnrichGameSessions([]));
    }

    if (isOnline && !isGuest) {
        try {
            console.log("🔄 Games API : Fetching game sessions from cloud (Supabase)...");
            const { ok, status, data } = await apiClient.get(ENDPOINTS.gameSessions);
            if (ok && data) {
                if (Array.isArray(data.sessions)) {
                    await gamesSQLite.upsertSessions(user_id, data.sessions);
                }
                return responder(true, true, status || 200, data);
            }
        } catch (error) {
            console.log("⚠️ Games API : Cloud game sessions fetching failed, falling back to local SQLite:", error);
        }
    }

    try {
        console.log("📦 Games API : Fetching game sessions from local SQLite...");
        const rows = await gamesSQLite.selectGameSessions(user_id);
        const data = EnrichGameSessions(rows);
        return responder(true, false, 200, data);
    } catch (error) {
        console.log("❌ Games API : Error while fetching game sessions from SQLite :", error);
        return responder(false, false, 500, EnrichGameSessions([]));
    }
};

const saveGameSession = async (rawData) => {
    const isOnline = await NetworkUtils.isOnline();
    const user_id = await getUserId();
    const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
    if (!user_id) {
        console.log("❌ Games API : saveGameSession — user_id is missing");
        return responder(false, false, 401, null);
    }

    const id = rawData.id || getRandomId();
    const played_at = rawData.played_at || new Date().toISOString();
    const performance_score = rawData.performance_score != null
        ? Number(rawData.performance_score)
        : gamesSQLite.calculatePerformanceScore(
            Number(rawData.correct_count),
            Number(rawData.total_count),
            Number(rawData.duration_secs)
        );

    const sessionPayload = {
        id: String(id),
        game_mode: String(rawData.game_mode),
        score: Number(rawData.score) || 0,
        correct_count: Number(rawData.correct_count) || 0,
        wrong_count: Number(rawData.wrong_count) || 0,
        total_count: Number(rawData.total_count) || 0,
        passed_count: Number(rawData.passed_count) || 0,
        duration_secs: Math.max(0, Math.round(Number(rawData.duration_secs) || 0)),
        performance_score: Number(performance_score) || 0,
        played_at: String(played_at)
    };

    if (isOnline && !isGuest) {
        try {
            console.log("🔄 Games API : Saving game session to cloud (Supabase)...");
            const { ok, status, data } = await apiClient.post(ENDPOINTS.saveGameSession, sessionPayload);
            if (ok && data) {
                console.log("✅ Games API : Game session saved to cloud successfully!");
                const serverSession = {
                    ...sessionPayload,
                    id: String(data.id || id),
                    user_id: String(data.user_id || user_id),
                    score: data.score != null ? data.score : sessionPayload.score,
                    performance_score: data.performance_score != null ? data.performance_score : sessionPayload.performance_score,
                    played_at: data.played_at || sessionPayload.played_at,
                    is_synced: 1
                };

                await gamesSQLite.insertGameSession(serverSession);
                return responder(true, true, status || 200, serverSession);
            } else {
                console.log("⚠️ Games API : Cloud request returned unsuccessful status, falling back to local SQLite:", status, data);
            }
        } catch (error) {
            console.log("⚠️ Games API : Cloud game session save failed, falling back to local SQLite:", error.message);
        }
    }

    console.log("💾 Games API : Saving game session to local SQLite (is_synced = 0)...");
    const localSession = {
        ...sessionPayload,
        user_id: String(user_id),
        is_synced: 0
    };

    const inserted = await gamesSQLite.insertGameSession(localSession);
    if (inserted) {
        console.log("✅ Games API : Game session saved to local SQLite successfully.");
        return responder(true, false, 201, localSession);
    } else {
        console.error("❌ Games API : Failed to insert local game session to SQLite.");
        return responder(false, false, 500, null);
    }
};

export const gamesApi = {
    getGameSessions,
    saveGameSession,
    EnrichGameSessions
};