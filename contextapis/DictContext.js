import { createContext } from "react";
import { useContext, useState,useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useUserStats } from "./UserStatsContext";
import { BASE_URL,ENDPOINTS } from "../constants/ApiConfig";

const DictContext = createContext();

export const DictionaryProvider = ({children}) => {
    const {incSaved} = useUserStats();
    const [dicts, setDicts] = useState([]);
    const { accToken, refToken, getNewToken, setLogin, isLogin, setAccToken } = useAuth();
    const [dictReload,setDictReload] = useState(false)

    useEffect(()=>{
        if ( !accToken || !isLogin || !dictReload) return;
        fetchDicts()
    },[dictReload,accToken,refToken])

    async function fetchDicts(manualToken=null) {
        const currentToken = manualToken || accToken
        const res = await fetch(BASE_URL + ENDPOINTS.dictionaries,
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

    async function getWords(dictId){
        const res = await fetch(BASE_URL + ENDPOINTS.words + "/" + dictId,{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accToken}`
            }
        })
        if (res.status === 200) {
            const data = await res.json()
            return data
        }
        else{
            console.log("words cant fethed")
            console.log(res.status)
        }
    }

    function getDict(dictId) {
        const targetDict = dicts.find((dict) => dict.id === dictId)
        return targetDict
    }

    async function createDictionary({name,description,language},manualToken = null) {
        const currentToken = manualToken || accToken
        const res = await fetch(BASE_URL + ENDPOINTS.newDictionary,
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

    async function saveWord({dictionary_id,word,meaning},manualToken = null) {
        const currentToken = manualToken || accToken
        console.log(dictionary_id)
        const res = await fetch(BASE_URL + ENDPOINTS.newWord,
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body:JSON.stringify({dictionary_id,word,meaning})
            })
        if (res.status===401) {
            const tempToken = await getNewToken(refToken)
            if (tempToken) {
                setAccToken(tempToken)
                return await saveWord({dictionary_id,word,meaning},tempToken);
            }
            else{
                setLogin(false)
            }
        }
        else if (res.ok) {
            incSaved();
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