import { createContext } from "react";
import { useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useUserStats } from "./UserStatsContext";
import { useFeedback } from "./FeedbackContext";
import { useTranslation } from "react-i18next";
import useExports from "../hooks/exportHooks";
import { ENDPOINTS } from "../constants/ApiConfig";
import { STORAGE_KEYS } from "../constants/StorageKeys";
import { storage } from "../storage/storage";
import { apiClient } from "../services/ApiClient";

const DictContext = createContext();

export const DictionaryProvider = ({ children }) => {
    const { incSaved, incDictCreated } = useUserStats();
    const [dicts, setDicts] = useState([]);
    const { isLogin } = useAuth();
    const [dictReload, setDictReload] = useState(false)
    const [dailyWord, setDailyWord] = useState(null)

    const { shareAsJson, shareAsTxt, shareAsCsv, shareAsPdf } = useExports();

    const { t } = useTranslation();
    const { showToast } = useFeedback();

    useEffect(() => {
        const loadDailyWord = async () => {
            const stored = await storage.get(STORAGE_KEYS.SESSION.DAILY_WORD)
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
        if (!isLogin || !dictReload) return;
        fetchDicts()
    }, [dictReload, isLogin])

    async function fetchDicts() {
        const { ok, status, data } = await apiClient.get(ENDPOINTS.dictionaries);
        if (ok) {
            setDicts(data);
            setDictReload(false);
            return true;
        }
        else {
            showToast(t('error'), t('errorFetchingDicts'), "danger")
            console.log("Something went wrong while fetching dictionaries!", status, data);
        }
        setDictReload(false);
        return false;
    }

    async function getWords(dictId) {
        if (!dictId) {
            console.log("dictId eksik bu şekilde api isteği atılamaz")
            return false;
        }
        const { ok, status, data } = await apiClient.get(ENDPOINTS.words + "/" + dictId);
        if (ok) {
            return data
        }
        else {
            showToast(t("error"), t('errorFetchingWords'), "danger");
            console.log("Error while fetching words!", status, data);
            return false;
        }
    }

    function getDict(dictId) {
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict
    }

    async function createDictionary({ name, description, language }) {
        const { ok, status, data } = await apiClient.post(ENDPOINTS.newDictionary, { name, description, language })
        if (ok) {
            incDictCreated();
            showToast(t('dictionaryCreated'), t('dictionaryCreatedSuccessfully'), "success");
            setDictReload(true)
            return true
        }
        else {
            console.log("Error while creating a new dict!", status, data)
            showToast(t('ooops'), t('tryAgainLater'), "danger")
            return false
        }
    }

    async function saveWord({ dictionary_id, word, meaning }, isDaily = false) {
        const { ok, status, data } = await apiClient.post(ENDPOINTS.newWord, { dictionary_id, word, meaning })
        if (status === 409) {
            console.log("Word already exists in the dictionary.")
            showToast(t("warning"), t("wordAlreadyExists"), "warning");
            return false
        }
        else if (ok) {
            incSaved();
            setDictReload(true);
            if (isDaily) {
                console.log("Word : ", data)
                await saveDailyWord(data.id)
                showToast(t("dailyWordSaved"), t("dailyWordSavedMsg"), "success");
                return true;
            }
            showToast(t("wordAdded"), t("wordAddedSuccessfully"), "success");
            return true;
        } else {
            showToast(t('error'), t('wordSavingError'), "danger");
            console.log("Error while saving word. ", status, data);
            return false;
        }
    }

    async function deleteWord(saved_id) {
        const isDaily = dailyWord?.saved_id === saved_id
        const { ok, status, data } = await apiClient.delete(ENDPOINTS.wordDelete + String(saved_id))
        if (ok) {
            if (isDaily) {
                await removeDailyWord();
                setDictReload(true);
            }
            showToast(t('operationSuccessful'), t('wordDeletedSuccessfully'), "success");
            return true
        }
        else {
            console.log("Error while deleting word ", status, data);
            showToast(t('ooops'), t('wordDeletingError'), "danger");
            return false
        }
    }

    async function deleteDictionary(dict_id) {
        const { ok, status, data } = await apiClient.delete(ENDPOINTS.deleteDictionary + dict_id);
        if (ok) {
            console.log("Dictionary deleted successfully!");
            showToast(t('operationSuccessful'), t('dictDeletingSuccessfull'), "success");
            return true;
        } else {
            console.log("Error while deleting dictionary:", status, data);
            showToast(t('ooops'), t('dictDeletingError'), "danger");
            return false;
        }
    }

    async function getDailyWord() {
        console.log("Requesting for daily word...");
        const { ok, status, data } = await apiClient.get(ENDPOINTS.dailyWord)
        if (ok) {
            console.log("Daily word fetched successfully: ", data);
            setDailyWord(data);
            await storage.set(STORAGE_KEYS.SESSION.DAILY_WORD, data);
            return true;
        }
        else {
            console.log("Error while fetching daily word! ", status, data)
            return null;
        }
    }

    async function saveDailyWord(saved_id) {
        const updatedDailyWord = {
            ...dailyWord,
            saved_id: saved_id,
            is_saved: true
        }
        console.log(updatedDailyWord)
        setDailyWord(updatedDailyWord)
        await storage.set(STORAGE_KEYS.SESSION.DAILY_WORD, updatedDailyWord);
    }

    async function removeDailyWord() {
        const updatedDailyWord = {
            ...dailyWord,
            saved_id: null,
            is_saved: false
        }
        console.log(updatedDailyWord)
        setDailyWord(updatedDailyWord)
        await storage.set(STORAGE_KEYS.SESSION.DAILY_WORD, updatedDailyWord);
    }

    async function ShareDictionary({ fileType, dictID }) {
        const dict = getDict(dictID)
        const words = await getWords(dictID);
        if (!words || words.length == 0 || !dict) {
            showToast(t('error'), t('noWordsOrLoadFailed'), "danger");
            console.log("kelimeler çekilemedi")
            return false
        };
        switch (fileType) {
            case ".json":
                await shareAsJson({ dict, words });
                break;
            case ".txt":
                await shareAsTxt({ dict, words });
                break;
            case ".csv":
                await shareAsCsv({ dict, words });
                break;
            case ".pdf":
                await shareAsPdf({ dict, words });
                break;
            default:
                break;
        }
    }

    return (<DictContext.Provider value={{
        dicts, getWords, getDict, createDictionary, setDictReload, deleteWord, ShareDictionary,
        saveWord, dictReload, deleteDictionary, dailyWord, setDailyWord, removeDailyWord
    }}>{children}</DictContext.Provider>)
}

export function useDictionary() {
    const context = useContext(DictContext)
    return context
}