import { createContext, useContext, useState, useEffect } from "react";
import i18n from '../i18n/i18n';
import { ENDPOINTS } from "../constants/ApiConfig";
import { jwtDecode } from "jwt-decode";
import { getNewToken } from "../services/TokenService";
import { storage } from "../storage/storage";
import { STORAGE_KEYS } from "../constants/StorageKeys";
import { apiClient } from "../services/ApiClient";
import { syncService } from "../services/SyncServisManager";
import { statsSQLite } from "../storage/StatsSQLite";
import { syncEvents } from "../services/SyncEvents";
import { useFeedback } from "./FeedbackContext";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { NetworkUtils } from "../utils/NetworkUtils";
import { getRandomId } from "@/utils/ApiUtils";
import { clearDatabase } from "@/storage/sqlite";

export const AuthenticationContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [accToken, setAccToken] = useState();
    const [refToken, setRefToken] = useState();
    const [isLogin, setLogin] = useState(false);
    const [registerData, setRegisterData] = useState({});
    const [appLanguage, setAppLanguage] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, 
        hideAlert, showToast,setVerticalButtons } = useFeedback();

    useEffect(() => {
        const getTokens = async () => {
            try {
                const tempIsGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
                const tempAccToken = await storage.getSecure(STORAGE_KEYS.SECURE.ACCESS_TOKEN);
                const tempRefToken = await storage.getSecure(STORAGE_KEYS.SECURE.REFRESH_TOKEN);
                const tempUser = await storage.get(STORAGE_KEYS.SESSION.USER);
                const tempLang = await storage.get(STORAGE_KEYS.PREFERENCES.LANGUAGE);
                setUser(tempUser || null);
                setAppLanguage(tempLang || null);

                if (tempIsGuest) {
                    setIsGuest(true);
                    setLogin(true);
                }
                else if (!tempAccToken || !tempRefToken) {
                    setLogin(false);
                }
                else {
                    await verifyToken(tempAccToken, tempRefToken);
                }
            } catch (error) {
                console.error("❌ Auth Context : Session could not be restored:", error);
                setUser(null);
                setIsGuest(false);
                setLogin(false);
                showToast(t("error"), t("somethingWentWrong"), "danger");
            } finally {
                setLoading(false);
            }
        }
        getTokens();
    }, [])



    const hydrateSession = async ({ profile, user_stats }) => {
        if (profile) {
            await storage.set(STORAGE_KEYS.SESSION.USER, profile);
            setUser(profile);
        }
        if (user_stats) {
            await statsSQLite.upsertUserStats(user_stats);
            syncEvents.emitSessionHydrated(user_stats);
        }
    };

    const manageGuest = async () => {
        const tempValue = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
        const tempProfile = await storage.get(STORAGE_KEYS.SESSION.USER)
        if (tempValue) {
            setAlertTitle(t('accountFound'));
            setAlertMessage(t('accountFoundMessage'));
            addAlertButton({ text: t('useExisting'), action: () => {hideAlert(), setLogin(true) } });
            addAlertButton({ text: t('newAccount'), style: "success", action: () => {hideAlert(), loginGuest() } });
            setVerticalButtons(true);
            setAlertVisible(true);
        }
        else {
            await loginGuest();
        }
    }

    const loginGuest = async () => {
        await storage.clearSession();
        await clearDatabase();
        const new_id = getRandomId();
        const nick_name = "guest_" + new_id.slice(-5);
        const GUEST_PROFILE = {
            "id": new_id,
            "first_name": t('guest'),
            "last_name": t('user'),
            "nick_name": nick_name
        }
        await storage.set(STORAGE_KEYS.SESSION.IS_GUEST, true);
        await storage.set(STORAGE_KEYS.SESSION.USER, GUEST_PROFILE);
        setUser(GUEST_PROFILE);
        setIsGuest(true);
        setLogin(true);
    }

    const fetchMe = async () => {
        try {
            console.log("🔄 Auth Context : Fetching /me endpoint...");
            const { ok, status, data } = await apiClient.get(ENDPOINTS.me, true);
            if (ok && data) {
                console.log("✅ Auth Context : /me successfully fetched");
                await hydrateSession(data);
                return true;
            } else {
                if (status === 408) {
                    showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
                }
                console.log("⚠️ Auth Context : /me request returned status:", status);
            }
        } catch (error) {
            console.log("⚠️ Auth Context : /me fetch error:", error.message);
        }
        return false;
    };

    const verifyToken = async (Actoken, ReToken) => {
        console.log("🔄 Auth Context : Verifying token...");
        try {
            const decoded = jwtDecode(Actoken)
            const currentTime = Date.now() / 1000;

            if (currentTime > decoded.exp) {
                console.log("🔄 Auth Context : Token is expired, refreshing...");
                const data = await getNewToken();
                if (data) {
                    setAccToken(data.acc_token);
                    setRefToken(data.ref_token);
                    await fetchMe();
                    setLogin(true);
                }
                else {
                    setLogin(false);
                }
            }
            else {
                console.log("✅ Auth Context : Token is valid.");
                setAccToken(Actoken);
                setRefToken(ReToken);
                await fetchMe();
                setLogin(true)
            }
        } catch (error) {
            console.log("❌ Auth Context : Error decoding or verifying token :", error);
            setLogin(false);
        }
    }

    const changeAppLanguage = async (val) => {
        setAppLanguage(val);
        await storage.set(STORAGE_KEYS.PREFERENCES.LANGUAGE, val);
        i18n.changeLanguage(val);
    }

    const register = async (registerData) => {
        const { ok, status, data } = await apiClient.post(ENDPOINTS.register, registerData, false);
        if (ok) {
            setAlertTitle(t('allSet'));
            setAlertMessage(t('takingYouToLogin'));
            addAlertButton({ text: t('login'), style: "success", action: () => { navigation.navigate("Login"), hideAlert() } });
            setAlertVisible(true);
        }
        else {
            if (status === 408) {
                showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
            } else {
                setAlertTitle(t('ooopsShort'));
                setAlertMessage(t('somethingWentWrong'));
                addAlertButton({ text: t('cancel'), style: "danger", action: () => hideAlert() });
                setAlertVisible(true);
            }
        }
        return ok;
    }

    async function logout() {
        if (!isGuest) {
            try {
                console.log("🔄 Auth Context : Syncing before logout...");
                const {success} = await syncService.pushData();
                if (!success) {
                    showToast(t('error'), t('logoutError'), "danger");
                    return false;
                }
                console.log("✅ Auth Context : Pre-logout sync completed.");
            } catch (e) {
                console.log("⚠️ Auth Context : Sync before logout failed:", e.message);
            }
        }
        console.log("🔄 Auth Context : Clearing session storage...");
        const res = await storage.clearSession();
        const db_res = await clearDatabase();

        if (res && db_res) {
            setAccToken(null);
            setRefToken(null);
            setUser(null);
            setIsGuest(false);
            console.log("✅ Auth Context : User logged out successfully.");
            setLogin(false);
            return true;
        }
        else {
            showToast(t('error'), t('logoutError'), "danger");
            return false;
        }
    }

    const changePassword = async (currentPassword, newPassword) => {
        const { ok, status, data } = await apiClient.post(ENDPOINTS.changePassword,
            { current_password: currentPassword, new_password: newPassword });
        if (ok) {
            console.log("✅ Auth Context : Password changed successfully.");
            return {ok:true,status:200};
        }
        else {
            if (status === 408) {
                showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
            }
            else if (status===401) {
                return {ok:false,status:401};
            }
            console.log("❌ Auth Context : Password change failed :", status, data);
            return {ok:false,status:400};
        }
    }

    const deleteAccount = async (password) => {
        const cleanPassword = password.trim()
        const { ok, status, data } = await apiClient.delete(ENDPOINTS.deleteAccount, { password:cleanPassword })
        if (ok) {
            console.log("✅ Auth Context : User account deleted successfully.");
            setAlertTitle(t('deleteAccountSuccess'))
            setAlertMessage(t('deleteAccountSuccessMsg'))
            addAlertButton({ text: t("close"), style: "success", action: async ()=>{hideAlert(),await logout()} });
            setAlertVisible();
            return true;
        } else {
            if (status === 408) {
                showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
            } else {
                setAlertTitle(t("deleteAccountFailed"));
                status === 401 ? setAlertMessage(t("passwordIncorrect")) : setAlertMessage(t("deleteAccountFailedMsg"));
                addAlertButton({ text: t("close"), style: "danger", action: hideAlert });
                setAlertVisible(true);
            }
            console.log("❌ Auth Context : Deleting account failed :", status, data);
            return false;
        }
    };

    const updateProfile = async (payload) => {
        const online = await NetworkUtils.isOnline();
        if (!online) {
            showToast(t('noInternetConnection'), t('offlineProfileUpdateMsg'), 'danger', 'wifi');
            return false;
        }
        try {
            console.log("🔄 Auth Context : Updating profile...");
            const { ok, status, data } = await apiClient.patch(ENDPOINTS.updateMe, payload);
            if (ok && data) {
                console.log("✅ Auth Context : Profile updated successfully.");
                await storage.set(STORAGE_KEYS.SESSION.USER, data);
                setUser(data);
                showToast(t('operationSuccessful'), t('profileUpdatedSuccess'), 'success');
                return true;
            } else {
                if (status === 408) {
                    showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
                } else {
                    console.log("❌ Auth Context : Profile update failed.");
                    showToast(t('error'), t('profileUpdateFailed'), 'danger');
                }
                return false;
            }
        } catch (error) {
            console.log("❌ Auth Context : Profile update error:", error.message);
            showToast(t('error'), t('profileUpdateFailed'), 'danger');
            return false;
        }
    };

    return (<AuthenticationContext.Provider value={{
        isLogin, isLoading, setLogin, logout, isGuest,setIsGuest,
        setAccToken, getNewToken, setRefToken, setUser, user, accToken, refToken, registerData,
        setRegisterData, register, appLanguage, changeAppLanguage, changePassword, deleteAccount,
        hydrateSession, fetchMe, updateProfile, manageGuest
    }}>{children}</AuthenticationContext.Provider>)
}

export const useAuth = () => {
    const AuthContext = useContext(AuthenticationContext);
    return AuthContext;
}