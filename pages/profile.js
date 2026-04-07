import {View,Text,TouchableOpacity} from 'react-native';
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

const Profile = () => {
    const { t } = useTranslation();
    const {user,getDataStorage,SetUser,logout} = useAuth();
    const [alertVisible,setAlertVisible] = useState(false)

    useEffect(() => {
    if (!user) {
        const loadUser = async () => {
            const userData = await getDataStorage("user");
            if (userData) {
                SetUser(JSON.parse(userData));
            }
        };
        loadUser();
    }}, [user]);

    return (
        <View style={{flex:1}}>
        <LinearGradient colors={['#e9d5ff', '#ffffff']} start={{x:0,y:0}} 
        end={{x:0,y:0.5}} style={{flex:1,alignItems:'center'}}>
            <View style={{width:'90%',alignItems:'center',paddingTop:35}}>
                <HeaderTopRow/>
                <ProfileInfo user={user}/>
                <ProfileStatsRow user={user}/>
                <InviteFriend/>
            </View>
            <View style={{flex:1,width:'100%',alignItems:'center'}}>
                <ProfileConsole setAlertVisible={setAlertVisible}/>
            </View>
        </LinearGradient>
        <CustomAlert visible={alertVisible} title={t('warning')} message={t('logoutWarning')} 
        buttons={[
            {text:t('cancel'),style:"cancel",action:()=>setAlertVisible(false)},
            {text:t('exit'),style:"danger",action:logout}]} />
        </View>    
        
    )
}

export default Profile;