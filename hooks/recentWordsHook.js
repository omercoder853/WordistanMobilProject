import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStats } from "../contextapis/UserStatsContext";

const RECENT_WORDS_KEY = "@wordistan:recentWords";

export default function useRecentWords() {
    const { incTranslated } = useUserStats();
    const [recentWords, setRecentWords] = useState([]);

    useEffect(() => {
        const loadRecentWords = async () => {
            try {
                const stored = await AsyncStorage.getItem(RECENT_WORDS_KEY);
                if (stored) {
                    setRecentWords(JSON.parse(stored));
                }
            } catch (e) {
                console.log("Error loading recent words:", e);
            }
        };
        loadRecentWords();
    }, []);

    const addWord = (lastword, lastmeaning, from = "TR") => {
        if (lastword != null && lastword.trim() != "" && lastmeaning != null && lastmeaning.trim() != "") {
            const wordTrimmed = lastword.trim();
            const meaningTrimmed = lastmeaning.trim();

            if (recentWords.length === 0 || recentWords[0].word.trim() !== wordTrimmed) {
                incTranslated();
            }

            setRecentWords(prev => {
                if (prev.length > 0 && prev[0].word.trim() === wordTrimmed) {
                    return prev;
                }
                const newWord = { word: wordTrimmed, meaning: meaningTrimmed, from: from || "TR" };
                const updatedList = [newWord, ...prev].slice(0, 5);
                AsyncStorage.setItem(RECENT_WORDS_KEY, JSON.stringify(updatedList)).catch(err => console.log("Error saving recent words:", err));
                return updatedList;
            });
        }
    }
    return { recentWords, addWord };
}