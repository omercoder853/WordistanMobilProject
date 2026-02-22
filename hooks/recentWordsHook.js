import { useState } from "react"

export default function useRecentWords() {
    const [recentWords, SetRecentWords] = useState([])
    const addWord = (lastword,lastmeaning) => {
        if (lastword != null && lastword.trim() != "" && lastmeaning != null && lastmeaning.trim() != "") {
            SetRecentWords(prev => {
                if (prev.length > 0 && prev[0].word.trim() === lastword.trim()) 
                {
                    return prev
                }
                else{
                    const newWord = {word:lastword.trim(),meaning:lastmeaning.trim()}
                    const updatedList = [newWord,...prev]
                    return updatedList.slice(0,5)
                }
            })
        }
    }
    return {recentWords,addWord};
}