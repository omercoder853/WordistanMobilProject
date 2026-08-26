import { createContext,useContext,useState,useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../src/i18n/i18n';
import { BASE_URL,ENDPOINTS } from "../constants/ApiConfig";
import { jwtDecode } from "jwt-decode";

export const AuthenticationContext = createContext() 

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState();
    const [isLoading,setLoading] = useState(true);
    const [accToken,setAccToken] = useState();
    const [refToken,setRefToken] = useState();
    const [isLogin,setLogin] = useState(false);
    const [registerData,setRegisterData] = useState({});
    const [registerLoading,setRegisterLoading] = useState(false)
    const [appLanguage,setAppLanguage] = useState(null);
    const [vibrationPref,setVibrationPref] = useState(true)
    
    useEffect(()=>{
        const getTokens = async () => {
            const tempAccToken = await getDataStorage("access-token");
            const tempRefToken = await getDataStorage("refresh-token");
            const tempUser = await getDataStorage("user");
            const tempLang = await getDataStorage("language");
            
            setAccToken(tempAccToken);
            setRefToken(tempRefToken);
            setUser(JSON.parse(tempUser) || null)
            setAppLanguage(tempLang || null)

            if (!tempAccToken && !tempRefToken) {
                setLogin(false)
            }
            else {
                await verifyToken(tempAccToken,tempRefToken);
            }
            setLoading(false);
            }
        getTokens();
        },[])

    const getNewToken = async (ReToken) => {
        const res = await fetch(BASE_URL + ENDPOINTS.refresh,
            {body:JSON.stringify({refresh_token:ReToken}),method:'POST',headers:{'Content-Type': 'application/json'}})
        if (res.status===200) {
            const data = await res.json();
            console.log("token refreshed successfully")
            setAccToken(data['access_token'])
            await setDataStorage("access-token",data['access_token'])
            if (!isLogin) {
                setLogin(true)
            }
            return(data['access_token'])
        }
        else{
            console.log("I cant reach the api")
            console.log(res)
            return(false)
        }
    }

    const verifyToken = async (Actoken,ReToken) => {
        console.log("token is verifying...")
        const decoded = jwtDecode(Actoken)
        const currentTime = Date.now() / 1000;
        if (currentTime > decoded.exp) {
            console.log("token is not valid!! \nrefreshing...")
            await getNewToken(ReToken)
        }
        else {
            console.log("token is valid")
            setLogin(true)
        }
    }

    const setDataStorage = async (name,value)  => {
        try {   
            await AsyncStorage.setItem(`@wordistan:${name}`,value)
        } 
        catch (error) {
            console.log("Error while setting: ",error)
        }
    }
    
    const getDataStorage = async (name) => {
        try 
        {
            return await AsyncStorage.getItem(`@wordistan:${name}`)
        } 
        catch (error) {
            console.log("Reading from storage error: " , error)
        }
    }

    const changeAppLanguage = async (val) => {
        setAppLanguage(val);
        await setDataStorage("language", val);
        i18n.changeLanguage(val);
    }

    const register = async(data)=>{
        setRegisterLoading(true)
        const res =await fetch(BASE_URL + ENDPOINTS.register,
            {method:'POST',headers:{
            'Content-Type': 'application/json'},body:JSON.stringify(data)})
        setRegisterLoading(false)
        return (res.status)  
    }

    return (<AuthenticationContext.Provider value={{isLogin,isLoading,setLogin,setDataStorage,
        setAccToken,getNewToken,setRefToken,setUser,user,accToken,refToken,registerData,
        setRegisterData,register,registerLoading,getDataStorage,appLanguage,changeAppLanguage}}>{children}</AuthenticationContext.Provider>)
}

export const useAuth = () => {
    const AuthContext = useContext(AuthenticationContext);
    return AuthContext;
}