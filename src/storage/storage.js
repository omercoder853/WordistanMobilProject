import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store'
import { STORAGE_KEYS } from "../constants/StorageKeys";

const PREFIX = "@wordistan:";
const SECURE_PREFIX = "wordistan_";

const getData = async (key) => {
    try {
        const data = await AsyncStorage.getItem(PREFIX + key)
        const parsedData = JSON.parse(data)
        return parsedData
    }catch (error) {
        console.log("Error while geting data from storage : " , error);
        return null;
    }
}

const setData = async (key,value) => {
    try {
        const safeValue = JSON.stringify(value);
        await AsyncStorage.setItem(PREFIX + key,safeValue);
        return true
    }catch (error) {
        console.log("Error while setting data to storage : " , error);
        return false;
    }
}

const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(PREFIX + key);
        return true;
    }catch (error) {
        console.log("Error wile deleting data from storage. " , error);
        return false;
    }
}

const getSecureData = async (key) => {
    try {
        const data = await SecureStore.getItemAsync(SECURE_PREFIX + key);
        return data
    }catch (error) {
        console.log("Error while getting data from secure storage. " , error)
        return null;
    }
}

const setSecureData = async (key,value) => {
    try {
        await SecureStore.setItemAsync(SECURE_PREFIX + key,value);
        return true;
    }catch (error) {
        console.log("Error while setting data to secure storage. , " , error);
        return false
    }
}

const removeSecureData = async (key) => {
    try {
        await SecureStore.deleteItemAsync(SECURE_PREFIX + key);
        return true
    }catch (error) {
        console.log("Error wile deleting data from secure storage. " , error);
        return false;
    }
}

const clearSession = async () => {
    const keyList = Object.values(STORAGE_KEYS.SESSION);
    const updatedKeys = keyList.map((key)=> PREFIX + key);
    try {
        await AsyncStorage.multiRemove(updatedKeys);
        await SecureStore.deleteItemAsync(SECURE_PREFIX + STORAGE_KEYS.SECURE.ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_PREFIX + STORAGE_KEYS.SECURE.REFRESH_TOKEN);
        return true;
    }catch (error){
        console.log("Error while clear session. " , error);
        return false
    }
}


export const storage = {
    get : getData,
    set : setData,
    remove : removeData,
    getSecure : getSecureData,
    setSecure : setSecureData,
    clearSession : clearSession,
    removeSecure : removeSecureData
}