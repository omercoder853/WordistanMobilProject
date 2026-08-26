import { useState } from "react"
import { useUserStats } from "../contextapis/UserStatsContext"

export default function useRecentWords() {
    const {incTranslated} = useUserStats();
    const [recentWords, SetRecentWords] = useState([])
    const addWord = (lastword, lastmeaning) => {
        if (lastword != null && lastword.trim() != "" && lastmeaning != null && lastmeaning.trim() != "") {
            const wordTrimmed = lastword.trim();
            const meaningTrimmed = lastmeaning.trim();

            if (recentWords.length === 0 || recentWords[0].word.trim() !== wordTrimmed) {
                incTranslated();
            }

            SetRecentWords(prev => {
                if (prev.length > 0 && prev[0].word.trim() === wordTrimmed) {
                    return prev;
                }
                const newWord = { word: wordTrimmed, meaning: meaningTrimmed };
                const updatedList = [newWord, ...prev];
                return updatedList.slice(0, 5);
            });
        }
    }
    return {recentWords,addWord};
}