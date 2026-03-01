import { createContext } from "react";
import { useContext, useState,useEffect } from "react";
import { useAuth } from "./AuthContext";

const DictContext = createContext();

export const DictionaryProvider = ({children}) => {
    const [dicts, setDicts] = useState([]);
    const [isFocused,setFocus] = useState(false);
    const { accToken, refToken, getNewToken, setLogin, isLogin, setAccToken } = useAuth();

    useEffect(()=>{
        if (!isFocused || !accToken || !isLogin) return;
        fetchDicts(getNewToken,setLogin,accToken,setDicts,refToken,setAccToken)
    },[accToken,isFocused])

    async function fetchDicts(getNewToken, setLogin, accToken, setDicts, refToken, setAccToken) {
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/dictionaries',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accToken}`
                }
            })
        if (res.status === 200) {
            const data = await res.json();
            setDicts(data)
        }
        else if (res.status === 401) {
            const tempToken = await getNewToken(refToken)
            if (tempToken) {
                setAccToken(tempToken)
            }
        }
        else {
            console.log("Something went wrong!")
            setLogin(false)
        }
    }

    function getWords(dictId){
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict['words']
    }

    function getDict(dictId) {
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict
    }

    return (<DictContext.Provider value={{setFocus,dicts,getWords,getDict}}>{children}</DictContext.Provider>)
}

export function useDictionary() {
    const context = useContext(DictContext)
    return context
}