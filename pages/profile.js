import {View,Text,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contextapis/AuthContext';
import HeaderTopRow from '../profileLayout/profileComponents/headerTopRow';
import ProfileInfo from '../profileLayout/profileComponents/profileInfo';
import ProfileStatsRow from '../profileLayout/profileComponents/profileStatsRow';
import InviteFriend from '../profileLayout/profileComponents/inviteFriend';
import { LinearGradient } from 'expo-linear-gradient';
import CustomAlert from '../commonComponents/customAlert/customAlert';
import { useEffect } from "react";
import ProfileConsole from '../profileLayout/profileComponents/profileConsole';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useUserStats } from '../contextapis/UserStatsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

const Profile = () => {
    const {setUserStats} = useUserStats();
    const { t } = useTranslation();
    const {user,getDataStorage,setUser,accToken,setAccToken,setRefToken,setLogin} = useAuth();
    const [alertVisible,setAlertVisible] = useState(false)

    useEffect(() => {
    if (!user) {
        const loadUser = async () => {
            const userData = await getDataStorage("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };
        loadUser();
    }}, [user]);

    async function loadData() {
    const rawTranslated = await getDataStorage("pendingTranslated");
    const rawSavedWords = await getDataStorage("pendingSavedWords");
    const rawXP = await getDataStorage("pendingEarnedXP");

    const pendingTranslated = JSON.parse(rawTranslated || "0");
    const pendingSavedWords = JSON.parse(rawSavedWords || "0");
    const pendingEarnedXP = JSON.parse(rawXP || "0");

    return { pendingTranslated, pendingSavedWords, pendingEarnedXP };
    }

    async function logout() {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem("@wordistan:access-token")
        await AsyncStorage.removeItem("@wordistan:refresh-token")
        await AsyncStorage.removeItem("@wordistan:user")
        await AsyncStorage.removeItem("@wordistan:userStats")
        await AsyncStorage.removeItem("@wordistan:pendingTranslated")
        await AsyncStorage.removeItem("@wordistan:pendingSavedWords")
        setAccToken(null)
        setRefToken(null)
        setUser(null)
        setUserStats(null)
        setLogin(false)
    }

    const logoutHandler = async (tokenToUse=accToken)=>{
        try{
            const { pendingTranslated, pendingSavedWords, pendingEarnedXP } = await loadData();
            if (pendingTranslated > 0 || pendingSavedWords > 0 || pendingEarnedXP > 0) {
                console.log("Önce bekleyen veriler gönderiliyor...");
                const pendingValues = {
                    saved: pendingSavedWords,
                    translated: pendingTranslated,
                    xp: pendingEarnedXP
                };
                const savedUserStats = await getDataStorage("userStats");
            }
            console.log("pending veri yok logout ediliyor")
            logout();
        }
        catch (error) {
            console.log("something went wrong: ",error)
        }
    }

    return (
        <>
        <LinearGradient colors={['#e9d5ff', '#ffffff']} start={{x:0,y:0}} 
        end={{x:0,y:0.5}} style={{flex:1,alignItems:'center'}}>
            <SafeAreaView style={{flex:1}} edges={['top','left','right']}>
                <View style={{width:'90%',alignItems:'center'}}>
                    <HeaderTopRow/>
                    <ProfileInfo/>
                    <ProfileStatsRow/>
                    <InviteFriend/>
                </View>
                <View style={{flex:1,width:'100%',alignItems:'center'}}>
                    <ProfileConsole setAlertVisible={setAlertVisible}/>
                </View>
            </SafeAreaView>
        </LinearGradient>
        <CustomAlert visible={alertVisible} title={t('warning')} message={t('logoutWarning')} 
        buttons={[
            {text:t('cancel'),style:"cancel",action:()=>setAlertVisible(false)},
            {text:t('exit'),style:"danger",action:logoutHandler}]} />
        </>  
    )
}

export default Profile;