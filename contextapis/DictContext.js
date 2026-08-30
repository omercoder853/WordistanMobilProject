import { createContext } from "react";
import { useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useUserStats } from "./UserStatsContext";
import { BASE_URL, ENDPOINTS } from "../constants/ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DictContext = createContext();

export const DictionaryProvider = ({ children }) => {
    const { incSaved,incXP } = useUserStats();
    const [dicts, setDicts] = useState([]);
    const { accToken, refToken, getNewToken, setLogin, isLogin, setAccToken, setDataStorage, getDataStorage } = useAuth();
    const [dictReload, setDictReload] = useState(false)
    const [dailyWord, setDailyWord] = useState(null)

    useEffect(() => {
        const loadDailyWord = async () => {
            const rawStored = await AsyncStorage.getItem("@wordistan:dailyWord")
            const stored = JSON.parse(rawStored)
            if (stored) {
                const timestamp = Date.now()
                const today = new Date(timestamp).toISOString().split('T')[0]
                if (stored.target_date === today) {
                    setDailyWord(stored);
                }
                else {
                    console.log("There is no stored data for daily word")
                    await getDailyWord();
                }
            }
            else {
                console.log("There is no stored data for daily word")
                await getDailyWord();
            }
        }
        loadDailyWord()
    }, [])

    useEffect(() => {
        if (!accToken || !isLogin || !dictReload) return;
        fetchDicts()
    }, [dictReload, accToken, refToken])

    async function fetchDicts(manualToken = null) {
        const currentToken = manualToken || accToken
        const res = await fetch(BASE_URL + ENDPOINTS.dictionaries,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            })
        if (res.status === 200) {
            const data = await res.json();
            setDicts(data)
        }
        else if (res.status === 401) {
            const tempToken = await getNewToken(refToken)
            if (tempToken) {
                setAccToken(tempToken);
                return await fetchDicts(tempToken);
            }
        }
        else {
            console.log("Something went wrong!")
            setLogin(false)
        }
        setDictReload(false)
    }

    async function getWords(dictId) {
        const res = await fetch(BASE_URL + ENDPOINTS.words + "/" + dictId, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accToken}`
            }
        })
        if (res.status === 200) {
            const data = await res.json();
            return data
        }
        else {
            console.log("words cant fethed")
            console.log(res.status)
        }
    }

    function getDict(dictId) {
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict
    }

    async function createDictionary({ name, description, language }, manualToken = null) {
        const currentToken = manualToken || accToken
        const res = await fetch(BASE_URL + ENDPOINTS.newDictionary,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ name, description, language })
            })
        if (res.status === 401) {
            const tempToken = await getNewToken(refToken)
            if (tempToken) {
                setAccToken(tempToken)
                return await createDictionary({ name, description, language }, tempToken);
            }
            else {
                setLogin(false)
            }
        }
        else if (res.status === 201) {
            setDictReload(true)
        }
        return res
    }

    async function saveWord({ dictionary_id, word, meaning }, manualToken = null, isDaily = false) {
        const currentToken = manualToken || accToken
        const res = await fetch(BASE_URL + ENDPOINTS.newWord,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ dictionary_id, word, meaning })
            })
        if (res.status === 401) {
            const tempToken = await getNewToken(refToken)
            if (tempToken) {
                setAccToken(tempToken)
                return await saveWord({ dictionary_id, word, meaning }, tempToken, isDaily);
            }
            else {
                setLogin(false)
            }
        }
        else if (res.ok) {
            const word = await res.json();
            incSaved();
            setDictReload(true);
            if (isDaily) {
                await saveDailyWord(word[0].id)
            }
        }
        return res.ok
    }

    async function deleteWord(saved_id, tokenToUse = accToken) {
        try {
            const isDaily = dailyWord?.saved_id === saved_id
            const res = await fetch(BASE_URL + ENDPOINTS.wordDelete + String(saved_id), {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                },
                body: JSON.stringify(saved_id)
            })
            if (res.ok) {
                if (isDaily) {
                    await removeDailyWord();
                    setDictReload(true)
                }
                return { success: true }
            }
            else if (res.status === 401) {
                const newToken = await getNewToken(refToken);
                if (newToken) {
                    return await deleteWord(saved_id, newToken)
                }
            }
            else {
                const message = await res.json()
                console.log("Error while deleting word ", message, res.status)
                return { success: false }
            }
        }
        catch (error) {
            console.error(String(error))
            return { success: false }
        }
    }

    async function deleteDictionary(dict_id, currentToken = accToken) {
        try {
            const url = `${BASE_URL}${ENDPOINTS.deleteDictionary}/${dict_id}`;

            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            if (res.status === 204 || res.ok) {
                console.log("Dictionary deleted successfully!");
                return { success: true };
            }

            if (res.status === 401) {
                const newToken = await getNewToken(refToken);
                if (newToken) {
                    return await deleteDictionary(dict_id, newToken);
                }
                return { success: false, error: "Oturum süresi doldu, lütfen tekrar giriş yapın." };
            }

            const errData = await res.json().catch(() => ({}));
            console.log("Error while deleting dictionary:", errData, res.status);
            return { success: false, error: errData.detail || "Sözlük silinemedi." };

        } catch (error) {
            console.error("Delete dictionary network error:", error);
            return { success: false, error: "Ağ bağlantısı kurulamadı." };
        }
    }

    async function getDailyWord(tokenToUse = accToken) {
        try {
            console.log("Requesting for daily word...")
            const res = await fetch(BASE_URL + ENDPOINTS.dailyWord, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                }
            })
            if (res.ok) {
                const data = await res.json();
                setDailyWord(data)
                await setDataStorage("dailyWord", JSON.stringify(data))
            }
            else if (res.status === 401) {
                const newToken = await getNewToken(refToken);
                if (newToken) {
                    return await getDailyWord(newToken)
                }
            }
            else {
                const message = await res.json()
                console.log("Error while fetching daily word! ", message, res.status)
                return null
            }

        }
        catch (error) {
            console.error("Daily word couldn't be fetched!", error)
            return null
        }
    }

    async function saveDailyWord(saved_id) {
        const updatedDailyWord = {
            ...dailyWord,
            saved_id: saved_id,
            is_saved: true
        }
        setDailyWord(updatedDailyWord)
        await setDataStorage("dailyWord", JSON.stringify(updatedDailyWord))
    }

    async function removeDailyWord() {
        const updatedDailyWord = {
            ...dailyWord,
            saved_id: null,
            is_saved: false
        }
        setDailyWord(updatedDailyWord)
        await setDataStorage("dailyWord", JSON.stringify(updatedDailyWord))
    }

    return (<DictContext.Provider value={{
        dicts, getWords, getDict, createDictionary, setDictReload, deleteWord,
        saveWord, dictReload, deleteDictionary, dailyWord, setDailyWord, removeDailyWord
    }}>{children}</DictContext.Provider>)
}

export function useDictionary() {
    const context = useContext(DictContext)
    return context
}