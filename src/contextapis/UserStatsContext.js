import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { statsApi } from "@/api/StatsApi";
import { syncEvents } from "@/services/SyncEvents";
import { statsSQLite } from "@/storage/StatsSQLite";
export const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
    const { isLogin, user } = useAuth();
    const [statsLoading , setStatsLoading] = useState(false);

    const [userStats, setUserStats] = useState(null);
    const [levelUpInfo, setLevelUpInfo] = useState(null);
    const prevLevelRef = useRef(null);

    // Level-up kontrolü: userStats değiştiğinde eski level ile karşılaştır
    useEffect(() => {
        if (!userStats) return
        const currentLevel = userStats.level || 1
        if (prevLevelRef.current !== null && currentLevel > prevLevelRef.current) {
            setLevelUpInfo({
                oldLevel: prevLevelRef.current,
                newLevel: currentLevel,
            })
        }
        prevLevelRef.current = currentLevel
    }, [userStats]);

    const fetchAndSetStats = useCallback(async () => {
        setStatsLoading(true);
        const result = await statsApi.fetchStats()
        if (result.ok) {
            setUserStats(result.data)
        }
        setStatsLoading(false);
    }, []);

    const dismissLevelUp = useCallback(async () => {
        setLevelUpInfo(null);
        await fetchAndSetStats();
    }, [fetchAndSetStats]);

    // Session hydration: /login veya /me verisi geldiğinde state'i doğrudan güncelle
    useEffect(() => {
        const unsubscribe = syncEvents.onSessionHydrated((freshStats) => {
            console.log("💧 User Stats Context : Session hydrated with fresh stats");
            if (freshStats) {
                setUserStats(freshStats);
            }
        });
        return unsubscribe;
    }, []);

    // Sync tamamlandığında yerel SQLite'taki güncel istatistikleri oku (0 network isteği)
    useEffect(() => {
        const unsubscribe = syncEvents.onSyncComplete(async () => {
            console.log("🔄 User Stats Context : Sync completed, reloading from local SQLite...");
            const userId = user?.id;
            if (userId) {
                const localStats = await statsSQLite.getUserStats(userId);
                if (localStats) {
                    const { level, xp_for_next, required_xp_for_level } = statsApi.calculateLevelFields(localStats.total_xp);
                    setUserStats({ ...localStats, level, xp_for_next, required_xp_for_level });
                }
            }
        });
        return unsubscribe;
    }, [user]);

    useEffect(() => {
        if (!isLogin) {
            setUserStats(null);
            prevLevelRef.current = null;
        } else {
            const loadLocalStats = async () => {
                const userId = user?.id || user?.sub;
                if (userId) {
                    const localStats = await statsSQLite.getUserStats(userId);
                    if (localStats) {
                        const { level, xp_for_next, required_xp_for_level } = statsApi.calculateLevelFields(localStats.total_xp);
                        setUserStats(prev => prev || { ...localStats, level, xp_for_next, required_xp_for_level });
                    }
                }
            };
            loadLocalStats();
        }
    }, [isLogin, user]);

    const incTranslated = useCallback(async () => {
        const result = await statsApi.incTranslated()
        if (result) setUserStats(result)
    }, [])

    const incSaved = useCallback(async () => {
        const result = await statsApi.incSaved()
        if (result) setUserStats(result)
    }, [])

    const incDictCreated = useCallback(async () => {
        const result = await statsApi.incDictCreated()
        if (result) setUserStats(result)
    }, [])

    const incXP = useCallback(async (amount, type = 'game_session') => {
        const result = await statsApi.incXP(amount, type)
        if (result) setUserStats(result)
    }, [])


    return (
        <UserStatsContext.Provider value={{
            userStats, setUserStats, fetchAndSetStats,
            incSaved, incTranslated, incDictCreated, incXP,
            levelUpInfo, dismissLevelUp,statsLoading
        }}>
            {children}
        </UserStatsContext.Provider>
    );
};

export const useUserStats = () => useContext(UserStatsContext);