import { createContext,useContext,useState,useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../src/i18n/i18n';


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
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/token/refresh',
            {body:JSON.stringify({refresh:ReToken}),method:'POST',headers:{'Content-Type': 'application/json'}})
        if (res.status===200) {
            const data = await res.json();
            setAccToken(data['access'])
            await setDataStorage("access-token",data['access'])
            if (!isLogin) {
                setLogin(true)
            }
            return(data['access'])
        }
        else{
            console.log("I cant reach the api")
            return(false)
        }
    }

    const verifyToken = async (Actoken,ReToken) => {
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/token/verify',
            {body:JSON.stringify({token:Actoken}),method:'POST',headers:{'Content-Type': 'application/json'}})
        if (res.status===200) {
            setLogin(true)
        }
        else {
            await getNewToken(ReToken);
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
        const res =await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/register',
            {method:'POST',headers:{
            'Content-Type': 'application/json'},body:JSON.stringify(data)})
        setRegisterLoading(false)
        return (res.status)  
    }

    const logout = async () =>{
        await AsyncStorage.removeItem("@wordistan:access-token")
        await AsyncStorage.removeItem("@wordistan:refresh-token")
        await AsyncStorage.removeItem("@wordistan:user")
        setAccToken(null)
        setRefToken(null)
        setUser(null)
        setLogin(false)
    }

    return (<AuthenticationContext.Provider value={{isLogin,isLoading,setLogin,setDataStorage,
        setAccToken,getNewToken,setRefToken,setUser,user,accToken,refToken,registerData,
        setRegisterData,register,registerLoading,getDataStorage,logout,appLanguage,changeAppLanguage}}>{children}</AuthenticationContext.Provider>)
}

export const useAuth = () => {
    const AuthContext = useContext(AuthenticationContext);
    return AuthContext;
}