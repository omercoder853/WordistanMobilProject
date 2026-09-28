import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { statsApi } from "@/api/StatsApi";
import { syncEvents } from "@/services/SyncEvents";
export const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
    const { isLogin } = useAuth();
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

    // Sync tamamlandığında (arka plan / internet geri geldiğinde) user stats'ı otomatik yenile
    useEffect(() => {
        const unsubscribe = syncEvents.onSyncComplete(() => {
            console.log("🔄 User Stats Context : Sync completed, refreshing user stats...");
            fetchAndSetStats();
        });
        return unsubscribe;
    }, [fetchAndSetStats]);

    useEffect(() => {
        if (!isLogin) {
            setUserStats(null)
            prevLevelRef.current = null
        }
        else if (isLogin) {
            console.log("🔄 User Stats Context : Login successful, fetching user stats...");
            fetchAndSetStats()
        }
    }, [isLogin, fetchAndSetStats]);

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