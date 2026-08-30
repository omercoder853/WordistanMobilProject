import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../src/i18n/i18n';
import { BASE_URL, ENDPOINTS } from "../constants/ApiConfig";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../services/supabase";

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
            const tempAccToken = await getDataStorage("access-token");
            const tempRefToken = await getDataStorage("refresh-token");
            const tempUser = await getDataStorage("user");
            const tempLang = await getDataStorage("language");

            setUser(JSON.parse(tempUser) || null)
            setAppLanguage(tempLang || null)

            if (!tempAccToken && !tempRefToken) {
                setLogin(false)
            }
            else {
                await verifyToken(tempAccToken, tempRefToken);
            }
            setLoading(false);
        }
        getTokens();
    }, [])

    const getNewToken = async (ReToken) => {
        const res = await fetch(BASE_URL + ENDPOINTS.refresh,
            { body: JSON.stringify({ refresh_token: ReToken }), method: 'POST', headers: { 'Content-Type': 'application/json' } })
        if (res.status === 200) {
            const data = await res.json();
            console.log("token refreshed successfully")
            supabase.auth.setSession({ access_token: data['access_token'], refresh_token: ReToken })
            setAccToken(data['access_token'])
            await setDataStorage("access-token", data['access_token'])
            if (!isLogin) {
                setLogin(true)
            }
            return (data['access_token'])
        }
        else {
            console.log("I cant reach the api")
            return (false)
        }
    }

    const verifyToken = async (Actoken, ReToken) => {
        console.log("token is verifying...")
        const decoded = jwtDecode(Actoken)
        const currentTime = Date.now() / 1000;
        if (currentTime > decoded.exp) {
            console.log("token is not valid!! \nrefreshing...")
            const newToken = await getNewToken(ReToken)
            if (newToken) {
                setAccToken(newToken);
                setRefToken(ReToken);
            }
        }
        else {
            console.log("token is valid")
            supabase.auth.setSession({ access_token: Actoken, refresh_token: ReToken })
            setAccToken(Actoken);
            setRefToken(ReToken);
            setLogin(true)
        }
    }

    const setDataStorage = async (name, value) => {
        try {
            await AsyncStorage.setItem(`@wordistan:${name}`, value)
        }
        catch (error) {
            console.log("Error while setting: ", error)
        }
    }

    const getDataStorage = async (name) => {
        try {
            return await AsyncStorage.getItem(`@wordistan:${name}`)
        }
        catch (error) {
            console.log("Reading from storage error: ", error)
        }
    }

    const changeAppLanguage = async (val) => {
        setAppLanguage(val);
        await setDataStorage("language", val);
        i18n.changeLanguage(val);
    }

    const register = async (data) => {
        setRegisterLoading(true)
        const res = await fetch(BASE_URL + ENDPOINTS.register,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        setRegisterLoading(false)
        return (res.status)
    }

    async function logout() {
        console.log("Hafızada tutulan veriler siliniyor...")
        await supabase.auth.signOut();
        await AsyncStorage.removeItem("@wordistan:access-token")
        await AsyncStorage.removeItem("@wordistan:refresh-token")
        await AsyncStorage.removeItem("@wordistan:user")
        await AsyncStorage.removeItem("@wordistan:userStats")
        await AsyncStorage.removeItem("@wordistan:pendingTranslated")
        await AsyncStorage.removeItem("@wordistan:pendingSavedWords")
        await AsyncStorage.removeItem("@wordistan:pendingXP")
        await AsyncStorage.removeItem("@wordistan:dailyWord")
        await AsyncStorage.removeItem("@wordistan:recentWords")
        setAccToken(null)
        setRefToken(null)
        setUser(null)
        setLogin(false)
        console.log("Logout ediliyor...")
    }

    const changePassword = async (currentPassword, newPassword, tokenToUse = accToken) => {
        try {
            const res = await fetch(BASE_URL + ENDPOINTS.changePassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
            })
            if (res.ok) {
                console.log("Password changed successfully")
                return { success: true }
            }
            else if (res.status === 401) {
                const newToken = await getNewToken(refToken)
                if (newToken) {
                    return await changePassword(currentPassword, newPassword, newToken)
                }
            }
            else {
                console.log("Operation is not successfull please try again later : ", res.json())
                return { success: false }
            }
        }
        catch (error) {
            console.error("Şifre değiştirme hatası:", error);
            return { success: false, error: "Ağ bağlantısı kurulamadı." };
        }
    }

    const deleteAccount = async (tokenToUse = accToken) => {
        try {
            const res = await fetch(BASE_URL + ENDPOINTS.deleteAccount, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                }
            });

            if (res.ok) {
                console.log("User has just deleted successfully");
                await logout();
                return { success: true };
            }

            if (res.status === 401) {
                const newToken = await getNewToken(refToken);
                if (newToken) {
                    return await deleteAccount(newToken);
                }
                return { success: false, error: "Oturum süresi doldu, lütfen tekrar giriş yapın." };
            }

            // JSON parse hatasını önlemek için güvenli okuma
            const errData = await res.json().catch(() => ({}));
            console.log("Deleting account is not successful:", errData , res.status);
            return { success: false, error: errData.detail || "Hesap silinemedi." };

        } catch (error) {
            console.error("Error while deleting user:", error);
            return { success: false, error: "Ağ bağlantısı kurulamadı." };
        }
    };

    return (<AuthenticationContext.Provider value={{
        isLogin, isLoading, setLogin, setDataStorage, logout,
        setAccToken, getNewToken, setRefToken, setUser, user, accToken, refToken, registerData,
        setRegisterData, register, registerLoading, getDataStorage, appLanguage, changeAppLanguage, changePassword, deleteAccount
    }}>{children}</AuthenticationContext.Provider>)
}

export const useAuth = () => {
    const AuthContext = useContext(AuthenticationContext);
    return AuthContext;
}