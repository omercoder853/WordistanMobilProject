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
import { dictionaryApi } from "@/api/DictionaryApi";
import { syncEvents } from "@/services/SyncEvents";

const DictContext = createContext();

export const DictionaryProvider = ({ children }) => {
    const { incSaved, incDictCreated } = useUserStats();
    const [dicts, setDicts] = useState([]);
    const { isLogin } = useAuth();
    const [dictReload, setDictReload] = useState(false);
    const [dailyWord, setDailyWord] = useState(null);
    const [dailyWordLoading,setDailyWordLoading] = useState(false);

    const { shareAsJson, shareAsTxt, shareAsCsv, shareAsPdf } = useExports();

    const { t } = useTranslation();
    const { showToast } = useFeedback();

    useEffect(() => {
        const loadDailyWord = async () => {
            setDailyWordLoading(true);
            const stored = await storage.get(STORAGE_KEYS.SESSION.DAILY_WORD)
            if (stored) {
                const timestamp = Date.now()
                const today = new Date(timestamp).toISOString().split('T')[0]
                if (stored.target_date === today) {
                    setDailyWord(stored);
                }
                else {
                    console.log("ℹ️ Dict Context : There is no stored data for daily word.");
                    await getDailyWord();
                }
            }
            else {
                console.log("ℹ️ Dict Context : There is no stored data for daily word.");
                await getDailyWord();
            }
            setDailyWordLoading(false);
        }
        loadDailyWord()
    }, [])

    useEffect(() => {
        if (!isLogin || !dictReload) return;
        fetchDicts()
    }, [dictReload, isLogin])

    // Sync tamamlandığında otomatik UI refresh
    useEffect(() => {
        const unsubscribe = syncEvents.onSyncComplete(() => {
            console.log("🔄 Dict Context : Sync completed, triggering reload...");
            setDictReload(true);
        });
        return unsubscribe;
    }, []);

    async function fetchDicts() {
        const { ok, status, data } = await dictionaryApi.fetchDicts();
        if (ok) {
            setDicts(data);
            setDictReload(false);
            return true;
        }
        else {
            showToast(t('error'), t('errorFetchingDicts'), "danger")
            console.log("❌ Dict Context : Something went wrong while fetching dictionaries :", status, data);
        }
        setDictReload(false);
        return false;
    }

    async function getWords(dictId) {
        if (!dictId) {
            console.log("⚠️ Dict Context : dictId is missing, cannot perform words request.");
            return false;
        }
        const { ok, is_synced, status, data } = await dictionaryApi.getWords(dictId);
        if (ok && data !== null) {
            console.log("📥 Dict Context : Words fetched from :", is_synced ? "cloud" : "local storage");
            return data;
        }
        else {
            showToast(t("error"), t('errorFetchingWords'), "danger");
            console.log("❌ Dict Context : Error while fetching words :", data, status);
            return false;
        }
    }

    function getDict(dictId) {
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict
    }

    async function createDictionary({ name, description, language, cover = 'dictionary_cover_1' }) {
        const { ok, is_synced, status, data } = await dictionaryApi.createDictionary(name, description, language, cover);
        if (ok) {
            console.log("✅ Dict Context : New dictionary created at :", is_synced ? "cloud" : "local storage");
            incDictCreated();
            showToast(t('dictionaryCreated'), t('dictionaryCreatedSuccessfully'), "success");
            setDictReload(true);
            return true;
        }
        else {
            console.log("❌ Dict Context : Error while creating a new dictionary :", status, data);
            showToast(t('ooops'), t('tryAgainLater'), "danger");
            return false;
        }
    }

    async function updateDictionary(dictId, updateFields) {
        if (!dictId || !updateFields || Object.keys(updateFields).length === 0) {
            return false;
        }
        const { ok, is_synced, status, data } = await dictionaryApi.updateDictionary(dictId, updateFields);
        if (ok) {
            console.log("✅ Dict Context : Dictionary updated successfully! (is_synced:", is_synced, ")");
            showToast(t('operationSuccessful'), t('dictionaryUpdatedSuccessfully'), "success");
            setDictReload(true);
            return true;
        } else {
            console.log("❌ Dict Context : Error while updating dictionary :", status, data);
            showToast(t('ooops'), t('dictUpdatingError'), "danger");
            return false;
        }
    }

    async function saveWord({ dictionary_id, word, meaning }, isDaily = false) {
        const { ok, is_synced, status, data } = await dictionaryApi.saveWord({ dictionary_id, word, meaning });
        if (status === 409) {
            console.log("⚠️ Dict Context : Word already exists in the dictionary.");
            showToast(t("warning"), t("wordAlreadyExists"), "warning");
            return false;
        } else if (ok) {
            console.log("✅ Dict Context : Word saved successfully at :", is_synced ? "cloud" : "local storage");
            incSaved();
            setDictReload(true);
            if (isDaily && data?.id) {
                console.log("✅ Dict Context : Daily word saved :", data);
                await saveDailyWord(data.id);
                showToast(t("dailyWordSaved"), t("dailyWordSavedMsg"), "success");
                return true;
            }
            showToast(t("wordAdded"), t("wordAddedSuccessfully"), "success");
            return true;
        } else {
            showToast(t('error'), t('wordSavingError'), "danger");
            console.log("❌ Dict Context : Error while saving word :", status, data);
            return false;
        }
    }

    async function deleteWord(saved_id) {
        const isDaily = dailyWord?.saved_id === saved_id;
        const { ok, is_synced, status, data } = await dictionaryApi.deleteWord(saved_id);
        if (ok) {
            console.log("✅ Dict Context : Word deleted successfully! (is_synced:", is_synced, ")");
            if (isDaily) {
                await removeDailyWord();
                setDictReload(true);
            }
            showToast(t('operationSuccessful'), t('wordDeletedSuccessfully'), "success");
            return true;
        } else {
            console.log("❌ Dict Context : Error while deleting word :", status, data);
            showToast(t('ooops'), t('wordDeletingError'), "danger");
            return false;
        }
    }

    async function deleteDictionary(dict_id) {
        const { ok, is_synced } = await dictionaryApi.deleteDictionary(dict_id);
        if (ok) {
            console.log("✅ Dict Context : Dictionary deleted successfully! (is_synced:", is_synced, ")");
            showToast(t('operationSuccessful'), t('dictDeletingSuccessfull'), "success");
            setDictReload(true);
            return true;
        } else {
            console.log("❌ Dict Context : Error while deleting dictionary :", dict_id);
            showToast(t('ooops'), t('dictDeletingError'), "danger");
            return false;
        }
    }

    async function getDailyWord() {
        console.log("🔄 Dict Context : Requesting daily word...");
        const { ok, status, data } = await apiClient.get(ENDPOINTS.dailyWord)
        if (ok) {
            console.log("✅ Dict Context : Daily word fetched successfully :", data);
            setDailyWord(data);
            await storage.set(STORAGE_KEYS.SESSION.DAILY_WORD, data);
            return true;
        }
        else {
            console.log("❌ Dict Context : Error while fetching daily word :", status, data);
            return null;
        }
    }

    async function saveDailyWord(saved_id) {
        const updatedDailyWord = {
            ...dailyWord,
            saved_id: saved_id,
            is_saved: true
        }
        console.log("✅ Dict Context : Updated daily word :", updatedDailyWord);
        setDailyWord(updatedDailyWord)
        await storage.set(STORAGE_KEYS.SESSION.DAILY_WORD, updatedDailyWord);
    }

    async function removeDailyWord() {
        const updatedDailyWord = {
            ...dailyWord,
            saved_id: null,
            is_saved: false
        }
        console.log("✅ Dict Context : Removed daily word :", updatedDailyWord);
        setDailyWord(updatedDailyWord)
        await storage.set(STORAGE_KEYS.SESSION.DAILY_WORD, updatedDailyWord);
    }

    async function ShareDictionary({ fileType, dictID }) {
        const dict = getDict(dictID)
        const words = await getWords(dictID);
        if (!words || words.length == 0 || !dict) {
            showToast(t('error'), t('noWordsOrLoadFailed'), "danger");
            console.log("❌ Dict Context : Words could not be fetched for sharing.");
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
        dicts, getWords, getDict, createDictionary, updateDictionary, setDictReload, deleteWord, ShareDictionary,
        saveWord, dictReload, deleteDictionary, dailyWord, setDailyWord, removeDailyWord, dailyWordLoading
    }}>{children}</DictContext.Provider>)
}

export function useDictionary() {
    const context = useContext(DictContext)
    return context
}