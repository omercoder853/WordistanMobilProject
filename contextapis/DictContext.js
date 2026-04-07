import { createContext } from "react";
import { useContext, useState,useEffect } from "react";
import { useAuth } from "./AuthContext";

const DictContext = createContext();

export const DictionaryProvider = ({children}) => {
    const [dicts, setDicts] = useState([]);
    const { accToken, refToken, getNewToken, setLogin, isLogin, setAccToken } = useAuth();
    const [dictReload,setDictReload] = useState(false)

    useEffect(()=>{
        if ( !accToken || !isLogin || !dictReload) return;
        fetchDicts()
    },[dictReload,accToken,refToken])

    async function fetchDicts(manualToken=null) {
        const currentToken = manualToken || accToken
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/dictionaries',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
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
                return await fetchDicts(tempToken)
            }
        }
        else {
            console.log("Something went wrong!")
            setLogin(false)
        }
        setDictReload(false)
    }

    function getWords(dictId){
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict['words']
    }

    function getDict(dictId) {
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict
    }

    async function createDictionary({name,description,language},manualToken = null) {
        const currentToken = manualToken || accToken
        const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/dictionaries/add/',
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body:JSON.stringify({name,description,language})
            })
        if (res.status===401) {
            const tempToken = await getNewToken(refToken)
            if (tempToken) {
                setAccToken(tempToken)
                return await createDictionary({name,description,language},tempToken);
            }
            else{
                setLogin(false)
            }
        }
        else if (res.status===201) {
            setDictReload(true)
        }
        return res.status
    }

    async function saveWord({word,meaning,dict_id},manualToken = null) {
        const currentToken = manualToken || accToken
        const res = await fetch(`https://terribilita-milissa-unpermitted.ngrok-free.dev/api/words/add/dict_id-${dict_id}`,
            {
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body:JSON.stringify({word,meaning})
            })
        if (res.status===401) {
            const tempToken = await getNewToken(refToken)
            if (tempToken) {
                setAccToken(tempToken)
                return await saveWord({word,meaning},tempToken);
            }
            else{
                setLogin(false)
            }
        }
        else if (res.ok) {
            setDictReload(true)
        }
        return res.ok
    }

    

    return (<DictContext.Provider value={{dicts,getWords,getDict,createDictionary,setDictReload,saveWord,dictReload}}>{children}</DictContext.Provider>)
}

export function useDictionary() {
    const context = useContext(DictContext)
    return context
}