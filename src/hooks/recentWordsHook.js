import { useState, useEffect } from "react";
import { useUserStats } from "../contextapis/UserStatsContext";
import { storage } from "../storage/storage";
import { STORAGE_KEYS } from "../constants/StorageKeys";

export default function useRecentWords() {
    const { incTranslated } = useUserStats();
    const [recentWords, setRecentWords] = useState([]);

    useEffect(() => {
        const loadRecentWords = async () => {
            try {
                const stored = await storage.get(STORAGE_KEYS.SESSION.RECENT_WORDS);
                if (stored) {
                    setRecentWords(stored);
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
                storage.set(STORAGE_KEYS.SESSION.RECENT_WORDS, updatedList);
                return updatedList;
            });
        }
    }
    return { recentWords, addWord };
}