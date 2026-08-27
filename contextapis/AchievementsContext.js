import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { BASE_URL, ENDPOINTS } from "../constants/ApiConfig";
import { supabase } from "../services/supabase";

export const AchievementsContext = createContext();

export const AchievementsProvider = ({ children }) => {
    const { user, accToken, refToken, setAccToken, getNewToken, isLogin } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [earnedAchievementsList, setEarnedAchievements] = useState([]);
    const [newAchievement, setNewAchievement] = useState(null);

    const getAchievements = async () => {
        try {
            const response = await fetch(BASE_URL + ENDPOINTS.achievements)
            if (response.ok) {
                const data = await response.json();
                console.log("Achievements fetched successfully");
                return data;
            }
        }
        catch (error) {
            console.error("Error fetching achievements:", error);
        }
    }

    const getEarnedAchievements = async (tokenToUse = accToken) => {
        try {
            const response = await fetch(BASE_URL + ENDPOINTS.earnedAchievements, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokenToUse}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Earned Achievements fetched successfully");
                return data;
            }
            else if (response.status === 401) {
                const newToken = await getNewToken(refToken);
                if (newToken) {
                    setAccToken(newToken);
                    return await getEarnedAchievements(newToken);
                }
            }
        } catch (error) {
            console.error("Error fetching earned achievements:", error);
        }
    };

    useEffect(() => {
        const fetchAchievements = async () => {
            const achievements = await getAchievements();
            setAchievements(achievements);
            const earnedAchievements = await getEarnedAchievements();
            setEarnedAchievements(earnedAchievements);
        };

        fetchAchievements();
    }, []);

    useEffect(() => {
        if (!user?.sub) return;
        const channel = supabase
            .channel(`user-achievements-${user.sub}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_achievements',
                    filter: `user_id=eq.${user.sub}`,
                },
                (payload) => {
                    console.log('Yeni satır:', payload.new);

                    // 1. Gelen achievement_id'yi ana listede bul
                    const fullDetail = achievements.find(
                        (item) => String(item.id) === String(payload.new.achievement_id)
                    );
                    if (fullDetail) {
                        setNewAchievement(fullDetail);
                    } else {
                        setNewAchievement(payload.new);
                    }
                }
            )
            .subscribe((status) => {
                console.log('Realtime bağlantı durumu:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.sub, achievements, isLogin]);

    return (
        <AchievementsContext.Provider value={{ earnedAchievementsList, setEarnedAchievements, achievements, newAchievement, setNewAchievement }}>
            {children}
        </AchievementsContext.Provider>
    );
}

export const useAchievements = () => {
    return useContext(AchievementsContext);
}