import { createContext, useContext, useState, useEffect } from "react";
import i18n from '../src/i18n/i18n';
import { ENDPOINTS } from "../src/constants/ApiConfig";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../services/supabase";
import { getNewToken } from "../src/services/AuthService";
import { storage } from "../src/storage/storage";
import { STORAGE_KEYS } from "../src/constants/StorageKeys";
import { apiClient } from "../src/services/ApiClient";

export const AuthenticationContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [isLoading, setLoading] = useState(true);
    const [accToken, setAccToken] = useState();
    const [refToken, setRefToken] = useState();
    const [isLogin, setLogin] = useState(false);
    const [registerData, setRegisterData] = useState({});
    const [registerLoading, setRegisterLoading] = useState(false)
    const [appLanguage, setAppLanguage] = useState(null);
    const [vibrationPref, setVibrationPref] = useState(true)

    useEffect(() => {
        const getTokens = async () => {
            const tempAccToken = await storage.getSecure(STORAGE_KEYS.SECURE.ACCESS_TOKEN);
            const tempRefToken = await storage.getSecure(STORAGE_KEYS.SECURE.REFRESH_TOKEN);
            const tempUser = await storage.get(STORAGE_KEYS.SESSION.USER);
            const tempLang = await storage.get(STORAGE_KEYS.PREFERENCES.LANGUAGE);

            setUser(tempUser || null)
            setAppLanguage(tempLang || null)

            if (!tempAccToken || !tempRefToken) {
                setLogin(false)
            }
            else {
                await verifyToken(tempAccToken, tempRefToken);
            }
            setLoading(false);
        }
        getTokens();
    }, [])

    const verifyToken = async (Actoken, ReToken) => {
        console.log("token is verifying...")
        const decoded = jwtDecode(Actoken)
        const currentTime = Date.now() / 1000;

        if (currentTime > decoded.exp) {
            console.log("token is not valid!! \nrefreshing...")
            const data = await getNewToken();
            if (data) {
                setAccToken(data.acc_token);
                setRefToken(data.ref_token);
                setLogin(true);
            }
            else {
                setLogin(false)
            }
        }
        else {
            console.log("token is valid")
            setAccToken(Actoken);
            setRefToken(ReToken);
            setLogin(true)
        }
    }

    const changeAppLanguage = async (val) => {
        setAppLanguage(val);
        await storage.set(STORAGE_KEYS.PREFERENCES.LANGUAGE, val);
        i18n.changeLanguage(val);
    }

    const register = async (registerData) => {
        setRegisterLoading(true);
        const { ok, status, data } = await apiClient.post(ENDPOINTS.register, registerData,false);
        setRegisterLoading(false);
        return (status);
    }

    async function logout() {
        console.log("Hafızada tutulan veriler siliniyor...")
        await supabase.auth.signOut();
        const res = await storage.clearSession();
        if (res) {
            setAccToken(null)
            setRefToken(null)
            setUser(null)
            setLogin(false)
            console.log("Logout ediliyor...")
        }
    }

    const changePassword = async (currentPassword, newPassword) => {
        const { ok, status, data } = await apiClient.post(ENDPOINTS.changePassword, { current_password: currentPassword, new_password: newPassword });
        if (ok) {
            console.log("Password changed successfully");
            return true;
        }
        else {
            console.log("Operation is not successfull please try again later : ", status, data);
            return false;
        }
    }

    const deleteAccount = async () => {
        const { ok, status, data } = await apiClient.delete(ENDPOINTS.deleteAccount)
        if (ok) {
            console.log("User has just deleted successfully");
            await logout();
            return true;
        } else {
            console.log("Deleting account is not successful:", status, data);
            return false;
        }
    };

    return (<AuthenticationContext.Provider value={{
        isLogin, isLoading, setLogin, logout,
        setAccToken, getNewToken, setRefToken, setUser, user, accToken, refToken, registerData,
        setRegisterData, register, registerLoading, appLanguage, changeAppLanguage, changePassword, deleteAccount
    }}>{children}</AuthenticationContext.Provider>)
}

export const useAuth = () => {
    const AuthContext = useContext(AuthenticationContext);
    return AuthContext;
}