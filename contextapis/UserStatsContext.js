import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { ENDPOINTS } from "../src/constants/ApiConfig";
import { apiClient } from "../src/services/ApiClient";
import { storage } from "../src/storage/storage";
import { STORAGE_KEYS } from "../src/constants/StorageKeys";
export const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
    const { isLogin } = useAuth();

    const [userStats, setUserStats] = useState(null);
    const [pendingTranslated, setPendingTranslated] = useState(0);
    const [pendingEarnedXP, setPendingEarnedXP] = useState(0);
    const [pendingSavedWords, setPendingSavedWords] = useState(0);
    const [pendingDictCreated, setPendingDictCreated] = useState(0);
    const [levelUpInfo, setLevelUpInfo] = useState(null);

    const translated_words = pendingTranslated + (userStats?.translated_words || 0);
    const saved_words = pendingSavedWords + (userStats?.saved_words || 0);
    const dict_created = pendingDictCreated + (userStats?.dict_created || userStats?.created_dicts || 0);

    // Load initial pending data from storage
    useEffect(() => {
        const loadPendingData = async () => {
            try {
                const pXP = await storage.get(STORAGE_KEYS.SESSION.PENDING_XP);
                const pSaved = await storage.get(STORAGE_KEYS.SESSION.PENDING_SAVED_WORDS);
                const pTrans = await storage.get(STORAGE_KEYS.SESSION.PENDING_TRANSLATED);
                const pDict = await storage.get(STORAGE_KEYS.SESSION.PENDING_DICT_CREATED);
                if (pXP) setPendingEarnedXP(pXP);
                if (pSaved) setPendingSavedWords(pSaved);
                if (pTrans) setPendingTranslated(pTrans);
                if (pDict) setPendingDictCreated(pDict);
            } catch (e) {
                console.log("Error loading pending stats data", e);
            }
        };
        loadPendingData();
    }, []);

    useEffect(() => {
        if (userStats && userStats.xp_for_next) {
            const xpForNext = userStats.xp_for_next;
            if (pendingEarnedXP > 0 && pendingEarnedXP >= xpForNext && !levelUpInfo) {
                const oldLvl = userStats.level || 1;
                const newLvl = oldLvl + 1;
                setLevelUpInfo({
                    oldLevel: oldLvl,
                    newLevel: newLvl,
                });
            }
        }
    }, [pendingEarnedXP, userStats, levelUpInfo]);

    const dismissLevelUp = useCallback(async () => {
        await clearPendingData();
        setLevelUpInfo(null);
        await getUserStats();
    }, [getUserStats]);

    const getUserStats = useCallback(async () => {
        const { ok, status, data } = await apiClient.get(ENDPOINTS.stats, true)
        if (ok) {
            console.log("Sync user stats : ", data);
            await storage.set(STORAGE_KEYS.SESSION.USER_STATS, data);
            setUserStats(data);
            await clearPendingData();
        }
        else {
            const savedUserStats = storage.get(STORAGE_KEYS.SESSION.USER_STATS);
            if (savedUserStats) setUserStats(savedUserStats);
            console.log("Error while fetching user stats!", status, data);
        }
    }, [clearPendingData]);

    const clearPendingData = useCallback(async () => {
        setPendingEarnedXP(0);
        setPendingSavedWords(0);
        setPendingTranslated(0);
        setPendingDictCreated(0);
        await storage.set(STORAGE_KEYS.SESSION.PENDING_XP, 0);
        await storage.set(STORAGE_KEYS.SESSION.PENDING_SAVED_WORDS, 0);
        await storage.set(STORAGE_KEYS.SESSION.PENDING_TRANSLATED, 0);
        await storage.set(STORAGE_KEYS.SESSION.PENDING_DICT_CREATED, 0);
    }, []);

    useEffect(() => {
        if (!isLogin) {
            setUserStats(null)
        }
        else if (isLogin) {
            console.log("Login is scuccessfull. User stats are fetching")
            const getData = async () => {
                await getUserStats()
            };
            getData();
        }
    }, [isLogin]);

    const incTranslated = async (isRetry = false) => {
        if (!isRetry) {
            await storage.set(STORAGE_KEYS.SESSION.PENDING_TRANSLATED, pendingTranslated + 1);
            setPendingTranslated(prev => prev + 1);
            incXP(2)
        }
        const { ok, status, data } = await apiClient.post(ENDPOINTS.incrementTranslation);

        if (ok) {
            console.log("Backend translated has just updated.");
        }
        else {
            console.log("Error while updating backend translated. ", status, data)
        }
    };

    const incSaved = async () => {
        setPendingSavedWords(prev => prev + 1);
        await storage.set(STORAGE_KEYS.SESSION.PENDING_SAVED_WORDS, pendingSavedWords + 1)
        incXP(3)
    }

    const incDictCreated = async () => {
        setPendingDictCreated(prev => prev + 1);
        await storage.set(STORAGE_KEYS.SESSION.PENDING_DICT_CREATED, pendingDictCreated + 1);
        incXP(10);
    }

    const incXP = async (amount) => {
        await storage.set(STORAGE_KEYS.SESSION.PENDING_XP, pendingEarnedXP + amount);
        setPendingEarnedXP(prev => prev + amount);
    }


    return (
        <UserStatsContext.Provider value={{
            userStats, translated_words,
            saved_words, dict_created, pendingEarnedXP, pendingSavedWords, pendingTranslated, pendingDictCreated,
            incSaved, incTranslated, incDictCreated, incXP, setUserStats,
            levelUpInfo, dismissLevelUp
        }}>
            {children}
        </UserStatsContext.Provider>
    );
};

export const useUserStats = () => useContext(UserStatsContext);