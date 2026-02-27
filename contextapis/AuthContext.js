import { createContext,useContext,useState,useEffect, useEffectEvent } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jsx } from "react/jsx-runtime";


export const AuthenticationContext = createContext() 

export const AuthProvider = ({children}) => {
    const [user,SetUser] = useState();
    const [accToken,setAccToken] = useState();
    const [refToken,setRefToken] = useState();
    const [isLogin,setLogin] = useState(false);
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
                verifyToken(tempAccToken,tempRefToken);
            }
            }
        getTokens();
        },[])

    const getNewToken = async (ReToken) => {
        const res = await fetch('http://192.168.1.4/api/token/refresh',{body:JSON.stringify({refresh:ReToken}),method:'POST',headers:{'Content-Type': 'application/json'}})
        if (res.status===200) {
            const data = await res.json();
            console.log("Token was taken for the first time")
            setAccToken(data['access'])
            setDataStorage("access-token",data['access'])
            setLogin(true)
        }
        else{
            console.log("I cant reach the api")
        }
    }

    const verifyToken = async (Actoken,ReToken) => {
        const res = await fetch('http://192.168.1.4/api/token/verify',{body:JSON.stringify({token:Actoken}),method:'POST',headers:{'Content-Type': 'application/json'}})
        if (res.status===200) {
            setLogin(true)
        }
        else {
            getNewToken(ReToken);
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

    return (<AuthenticationContext.Provider value={{isLogin,setLogin,setDataStorage,setAccToken,setRefToken,SetUser,user}}>{children}</AuthenticationContext.Provider>)
}

export const useAuth = () => {
    const AuthContext = useContext(AuthenticationContext);
    return AuthContext;
}