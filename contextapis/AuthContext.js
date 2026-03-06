import { createContext,useContext,useState,useEffect, useEffectEvent } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthenticationContext = createContext() 

export const AuthProvider = ({children}) => {
    const [user,SetUser] = useState();
    const [isLoading,setLoading] = useState(true);
    const [accToken,setAccToken] = useState();
    const [refToken,setRefToken] = useState();
    const [isLogin,setLogin] = useState(false);
    const [registerData,setRegisterData] = useState({});
    const [registerLoading,setRegisterLoading] = useState(false)
    useEffect(()=>{
        const getTokens = async () => {
            const tempAccToken = await getDataStorage("access-token")
            const tempRefToken = await getDataStorage("refresh-token")
            const tempUser = await getDataStorage("user")
            setAccToken(tempAccToken);
            setRefToken(tempRefToken);
            if (tempUser) {
                SetUser(JSON.parse(tempUser))
            }
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
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/token/refresh',{body:JSON.stringify({refresh:ReToken}),method:'POST',headers:{'Content-Type': 'application/json'}})
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
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/token/verify',{body:JSON.stringify({token:Actoken}),method:'POST',headers:{'Content-Type': 'application/json'}})
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

    const register = async(data)=>{
        setRegisterLoading(true)
        console.log("Register data",data)
        const res =await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/register',{method:'POST',headers:{
            'Content-Type': 'application/json'},body:JSON.stringify(data)})
        setRegisterLoading(false)
        return (res.status)
        
    }

    return (<AuthenticationContext.Provider value={{isLogin,isLoading,setLogin,setDataStorage,
        setAccToken,getNewToken,setRefToken,SetUser,user,accToken,refToken,registerData,
        setRegisterData,register,registerLoading}}>{children}</AuthenticationContext.Provider>)
}

export const useAuth = () => {
    const AuthContext = useContext(AuthenticationContext);
    return AuthContext;
}