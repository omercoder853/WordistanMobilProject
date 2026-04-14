import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import ACHIEVEMENTLIST from "../assets/data/achievementList";
export const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
    const { setDataStorage, getDataStorage, accToken,
        setAccToken, refToken, isLogin, setLogin, getNewToken,user,setUser } = useAuth();

    const [userStats, setUserStats] = useState(null);
    const [pendingTranslated, setPendingTranslated] = useState(0);
    const [pendingEarnedXP, setPendingEarnedXP] = useState(0);
    const [pendingSavedWords, setPendingSavedWords] = useState(0);
    const [activeAchievement,setActiveAchievement] = useState(null)
    const earnedAchievements = user.achievements.map(ach=>ach.achievementId)
    const unearnedAchievements = ACHIEVEMENTLIST.filter(ach=>!earnedAchievements.includes(ach.id))
    const translated_words = pendingTranslated + userStats?.translated_words
    const saved_words = pendingSavedWords + userStats?.saved_words

    const getUserStats = useCallback(async (tokenToUse = accToken) => {
        try {
            const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/profile/stats', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${tokenToUse}` 
                }
            });

            if (res.ok) {
                const data = await res.json();
                await setDataStorage("userStats", JSON.stringify(data));
                setUserStats(data);
            } else if (res.status === 401) {
                const tempToken = await getNewToken(refToken);
                if (tempToken) {
                    setAccToken(tempToken);
                    return await getUserStats(tempToken);
                } else {
                    setLogin(false);
                }
            }
        } catch (err) {
            console.error("Stats alınırken hata oluştu", err);
        }
    }, [accToken, refToken, getNewToken, setAccToken, setLogin, setDataStorage]);

    const updateStats = useCallback(async (values,savedUserStats, tokenToUse = accToken) => {
        try {
            const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/profile/stats/update', {
                method: 'PATCH',
                body: JSON.stringify(values),
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${tokenToUse}` 
                }
            });

            if (res.ok) {
                const updatedData = await res.json();
                setUserStats(updatedData);
                await setDataStorage("userStats", JSON.stringify(updatedData));
                setPendingEarnedXP(0);
                setPendingSavedWords(0);
                setPendingTranslated(0);
                await setDataStorage("pendingXP", "0");
                await setDataStorage("pendingSavedWords", "0");
                await setDataStorage("pendingTranslated", "0"); 
            } else if (res.status === 401) {
                const tempToken = await getNewToken(refToken);
                if (tempToken) {
                    setAccToken(tempToken);
                    return await updateStats(values,savedUserStats, tempToken);
                }
            } else {
                setUserStats(JSON.parse(savedUserStats))
                setPendingTranslated(parseInt(values.translated) || 0);
                setPendingSavedWords(parseInt(values.saved) || 0);
                setPendingEarnedXP(parseInt(values.xp) || 0);
            }
        } catch (err) {
            console.error("Güncelleme başarısız, yerelde kaldı.");
        }
    }, [accToken, refToken, getNewToken, setAccToken, setDataStorage]);

    useEffect(() => {
        if (!isLogin) return;
        const getOrUpdateData = async () => {
            const savedPendingTranslated = await getDataStorage("pendingTranslated");
            const savedPendingSavedWords = await getDataStorage("pendingSavedWords");
            const savedPendingXP = await getDataStorage("pendingXP");
            const savedUserStats = await getDataStorage("userStats");

            const hasPending = (savedPendingTranslated && savedPendingTranslated !== "0") ||
                               (savedPendingSavedWords && savedPendingSavedWords !== "0") ||
                               (savedPendingXP && savedPendingXP !== "0");
            if (hasPending) {
                let pendingValues = {
                    saved: parseInt(savedPendingSavedWords) || 0,
                    translated: parseInt(savedPendingTranslated) || 0,
                    xp: parseInt(savedPendingXP) || 0
                };
                updateStats(pendingValues,savedUserStats);
            } else if (!savedUserStats) {
                getUserStats();
            } else {
                setUserStats(JSON.parse(savedUserStats));
            }
        };

        getOrUpdateData();
    }, [isLogin]);
    
    const incTranslated = async () => {
        const newValue = pendingTranslated + 1;
        setPendingTranslated(newValue);
        await setDataStorage("pendingTranslated",JSON.stringify(newValue));
    }

    const incSaved = async ()=>{
        const newValue = pendingSavedWords + 1;
        setPendingSavedWords(newValue)
        await setDataStorage("pendingSavedWords",JSON.stringify(newValue));
    }
    const incXP = async (amount) => {
        const newValue = pendingEarnedXP + amount;
        setPendingEarnedXP(newValue);
        await setDataStorage("pendingXP",JSON.stringify(newValue))
    }

    useEffect(()=>{
        if (activeAchievement!==null) return;
        unearnedAchievements.forEach((ach)=>{
            const requirement = ach.requirementField
            switch (requirement) {
                case "translated_words":
                    if (translated_words>=ach.requirementValue) {
                        setActiveAchievement(ach);
                    }
                    break;
                case 'saved_words':
                    if (saved_words>=ach.requirementValue) {
                        setActiveAchievement(ach);
                    }
                    break;
                default:
                    break;
            }
        })
    },[translated_words,saved_words,activeAchievement])

    const updateAchievements = async (tokenToUse=accToken)=>{
        try{
        if (pendingTranslated > 0 || pendingSavedWords > 0 || pendingEarnedXP > 0) {
            console.log("Önce bekleyen veriler gönderiliyor...");
            const pendingValues = {
                saved: pendingSavedWords,
                translated: pendingTranslated,
                xp: pendingEarnedXP
            };
            const savedUserStats = await getDataStorage("userStats");
            await updateStats(pendingValues, savedUserStats, tokenToUse);
        }
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/achievements/new',{
                method:'POST',
                body:JSON.stringify({ achievementId: activeAchievement.id}),
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${tokenToUse}` 
                }
            })
        if (res.ok) {
            const data = await res.json();
            const updatedUser = { ...user, achievements: data["updated_achievements"] };
            setUser(updatedUser);
            await setDataStorage('user', JSON.stringify(updatedUser));
            setActiveAchievement(null)
        }
        else if (res.status===401){
            const tempToken = await getNewToken(refToken);
            if (tempToken) {
                setAccToken(tempToken);
                return await updateAchievements(tempToken);
            }
        }}
        catch (error) {
            console.error("Achievement update error:", error);
        }
    }

    return (
        <UserStatsContext.Provider value={{
            userStats, translated_words,activeAchievement,setActiveAchievement,
            saved_words, pendingEarnedXP,incSaved,incTranslated,incXP,updateAchievements
        }}>
            {children}
        </UserStatsContext.Provider>
    );
};

export const useUserStats = () => useContext(UserStatsContext);