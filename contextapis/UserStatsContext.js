import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { BASE_URL, ENDPOINTS } from "../constants/ApiConfig";
export const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
    const { setDataStorage, getDataStorage, accToken,
        setAccToken, refToken, isLogin, setLogin, getNewToken, user, setUser } = useAuth();


    const [userStats, setUserStats] = useState(null);
    const [pendingTranslated, setPendingTranslated] = useState(0);
    const [pendingEarnedXP, setPendingEarnedXP] = useState(0);
    const [pendingSavedWords, setPendingSavedWords] = useState(0);
    const translated_words = pendingTranslated + (userStats?.translated_words || 0)
    const saved_words = pendingSavedWords + (userStats?.saved_words || 0)
    console.log("pending saved words : ", pendingSavedWords)

    const getUserStats = useCallback(async (tokenToUse = accToken) => {
        try {
            const res = await fetch(BASE_URL + ENDPOINTS.stats, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Sync user stats : ", data)
                await setDataStorage("userStats", JSON.stringify(data));
                setUserStats(data);
                await clearPendingData()
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

    const clearPendingData = async () => {
        setPendingEarnedXP(0);
        setPendingSavedWords(0);
        setPendingTranslated(0);
        await setDataStorage("pendingXP", "0");
        await setDataStorage("pendingSavedWords", "0");
        await setDataStorage("pendingTranslated", "0");
    }

    useEffect(() => {
        if (!isLogin) {
            setUserStats(null)
        }
        else {
            const getData = async () => {
                await getUserStats()
            };
            getData();
        }
    }, [isLogin]);

    const incTranslated = async (tokenToUse = accToken, isRetry = false) => {
        if (!isRetry) {
            await setDataStorage("pendingTranslated", JSON.stringify(pendingTranslated + 1));
            setPendingTranslated((prev) => {
                const newValue = prev + 1;
                return newValue;
            });
            incXP(2)
        }

        try {
            const res = await fetch(BASE_URL + ENDPOINTS.incrementTranslation, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenToUse}`,
                },
            });

            if (res.status === 204 || res.status === 200) {
                console.log("backend translated güncellendi");
            } else if (res.status === 401 && !isRetry) {
                const tempToken = await getNewToken(refToken);
                if (tempToken) {
                    setAccToken(tempToken);
                    await setDataStorage("accessToken", tempToken);
                    return await incTranslated(tempToken, true);
                }
            }
        } catch (error) {
            console.log("Backend translated güncellenemedi:", error);
        }
    };

    const incSaved = async () => {
        const newValue = pendingSavedWords + 1;
        setPendingSavedWords(newValue)
        await setDataStorage("pendingSavedWords", JSON.stringify(newValue));
        incXP(3)
    }

    const incXP = async (amount) => {
        await setDataStorage("pendingXP", JSON.stringify(pendingEarnedXP + amount))
        setPendingEarnedXP((prev) => {
            const newValue = prev + amount;
            return newValue;
        });
    }


    return (
        <UserStatsContext.Provider value={{
            userStats, translated_words,
            saved_words, pendingEarnedXP, incSaved, incTranslated, incXP, setUserStats
        }}>
            {children}
        </UserStatsContext.Provider>
    );
};

export const useUserStats = () => useContext(UserStatsContext);