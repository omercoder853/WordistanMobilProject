import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { BASE_URL, ENDPOINTS } from "../src/constants/ApiConfig";
import { useUserStats } from "./UserStatsContext";
import { STORAGE_KEYS } from "../src/constants/StorageKeys";
import { storage } from "../src/storage/storage";
import { apiClient } from "../src/services/ApiClient";

export const AchievementsContext = createContext();

export const AchievementsProvider = ({ children }) => {
    const { isLogin } = useAuth();
    const { userStats, pendingSavedWords, pendingTranslated, pendingDictCreated, incXP } = useUserStats();
    const [achievements, setAchievements] = useState([]);
    const [earnedAchievementsList, setEarnedAchievements] = useState([]);
    const [newAchievement, setNewAchievement] = useState(null);
    const [isFetched, setIsFetched] = useState(false);
    const [shownAchievements, setShownAchievements] = useState([]);

    // Load shownAchievements from AsyncStorage on mount
    useEffect(() => {
        const loadShownAchievements = async () => {
            try {
                const data = await storage.get(STORAGE_KEYS.SESSION.SHOWN_ACHIEVEMENTS);
                if (data) {
                    setShownAchievements(data);
                }
            } catch (e) {
                console.log("Error loading shownAchievements:", e);
            }
        };
        loadShownAchievements();
    }, []);

    const getAchievements = async () => {
        const { ok, status, data } = await apiClient.get(ENDPOINTS.achievements, false);
        if (ok) {
            console.log("Achievements fetched successfully");
            return data;
        }
        else {
            console.log("Error while fetching achievements. ", status, data);
            return false;
        }
    }

    const getEarnedAchievements = async () => {
        const { ok, status, data } = await apiClient.get(ENDPOINTS.earnedAchievements);
        if (ok) {
            console.log("Earned Achievements fetched successfully");
            return data;
        } else {
            console.log("Error while fetching earned achievements. ", status, data);
        }
    };

    useEffect(() => {
        if (!isLogin) {
            setAchievements([]);
            setEarnedAchievements([]);
            setIsFetched(false);
            return;
        }

        const fetchAchievements = async () => {
            const achievementsData = await getAchievements();
            setAchievements(achievementsData || []);
            const earnedData = await getEarnedAchievements();
            setEarnedAchievements(earnedData || []);
            setIsFetched(true);
        };

        fetchAchievements();
    }, [isLogin]);

    const isAlreadyEarned = useCallback((achId) => {
        if (!achId) return false;
        const sId = String(achId);
        if (shownAchievements.includes(sId)) return true;

        const safeEarnedList = earnedAchievementsList || [];
        return safeEarnedList.some((ac) => {
            const id = ac.achievement_detail?.id || ac.achievement_id || ac.achievement?.id || ac.achievement || ac.id;
            return String(id) === sId;
        });
    }, [shownAchievements, earnedAchievementsList]);

    const dismissNewAchievement = useCallback(async () => {
        if (newAchievement?.id) {
            const idStr = String(newAchievement.id);
            setShownAchievements(prev => {
                if (prev.includes(idStr)) return prev;
                const updated = [...prev, idStr];
                storage.set(STORAGE_KEYS.SESSION.SHOWN_ACHIEVEMENTS , updated);
                return updated;
            });
        }
        setNewAchievement(null);
        await getEarnedAchievements();
    }, [newAchievement, getEarnedAchievements]);

    // Target value check whenever pending data or userStats update (only AFTER initial fetch is done!)
    useEffect(() => {
        if (!isLogin || !isFetched || !achievements || achievements.length === 0) return;

        const currentSaved = (userStats?.saved_words || 0) + (pendingSavedWords || 0);
        const currentTranslated = (userStats?.translated_words || 0) + (pendingTranslated || 0);
        const currentDicts = (userStats?.dict_created || userStats?.created_dicts || 0) + (pendingDictCreated || 0);

        for (const ach of achievements) {
            const alreadyEarned = isAlreadyEarned(ach.id);

            if (!alreadyEarned && ach.target_value) {
                let progress = 0;
                if (ach.target_field === 'saved_words') progress = currentSaved;
                else if (ach.target_field === 'translated_words') progress = currentTranslated;
                else if (ach.target_field === 'dict_created' || ach.target_field === 'created_dicts' || ach.target_field === 'dict_created_count') progress = currentDicts;
                else progress = (userStats?.[ach.target_field] || 0);

                if (progress >= ach.target_value && !newAchievement) {
                    console.log("🏆 Yeni Başarım Kazanıldı:", ach);
                    setNewAchievement(ach);
                    incXP(ach.xp_reward)

                    break;
                }
            }
        }
    }, [
        pendingSavedWords,
        pendingTranslated,
        pendingDictCreated,
        userStats,
        achievements,
        earnedAchievementsList,
        isLogin,
        isFetched,
        newAchievement,
        isAlreadyEarned
    ]);

    return (
        <AchievementsContext.Provider value={{
            earnedAchievementsList, setEarnedAchievements, achievements,
            newAchievement, setNewAchievement, dismissNewAchievement,
            isAlreadyEarned, getEarnedAchievements
        }}>
            {children}
        </AchievementsContext.Provider>
    );
}

export const useAchievements = () => {
    return useContext(AchievementsContext);
}