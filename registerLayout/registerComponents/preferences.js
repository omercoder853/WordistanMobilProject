import { View,Text,TextInput,TouchableOpacity,Keyboard,KeyboardAvoidingView,Platform,TouchableWithoutFeedback } from "react-native";
import styles from "../registerStyles/styles";
import LogoArea from "./logoArea";
import NavigationButtons from "./navigationButtons";
import {FontAwesome5,FontAwesome} from '@expo/vector-icons';
import { useState,useEffect } from "react";
import { useAuth } from "../../contextapis/AuthContext";
import { useTranslation } from "react-i18next";

export default function PreferencesPage(){
    const { t } = useTranslation();
    const {appLanguage, changeAppLanguage} = useAuth();
    const [username,setUsername] = useState("");
    const [lang,setLang] = useState(appLanguage || "en");
    const [error,setError] = useState();

    const usernameValid = username && username?.length >= 4
    const validLang = lang ? true : false
    const isFormValid = usernameValid && validLang

    const data = isFormValid ? {
        "nick_name" : username
    }:null;

    useEffect(()=>{
        if (isFormValid) {
            setError(false)
        }
        else{
            setError(true)
        }
    },[isFormValid])
    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <View style={styles.mainContainer}>
                    <LogoArea/>
                    <Text style={styles.titleText}>{t('ruleYourWordistan')}</Text>
                    <View>
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <FontAwesome5 name="user-alt" size={15} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('username')}</Text>
                        </View>
                        <TextInput autoCapitalize="none" onChangeText={(value)=>setUsername(value)} style={styles.inputArea} placeholder={t('howShouldICallYou')}/>
                        {!usernameValid && username?.length>0 && <Text style={styles.warningText}>{t('usernameWarning')}</Text>}
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <FontAwesome name="language" size={15} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('languageSelection')}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-around',marginBottom:20}}>
                            <TouchableOpacity onPress={()=>{setLang("tr"); changeAppLanguage("tr");}} style={[styles.languageButton,{backgroundColor:lang=="tr" ? "green":"white"}]}>
                                <Text style={{color:lang=="tr" ? "white":"black"}}>🇹🇷 Türkçe</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setLang("en"); changeAppLanguage("en");}} style={[styles.languageButton,{backgroundColor:lang=="en" ? "green" : "white"}]}>
                                <Text style={{color:lang=="en" ? "white":"black"}}>🇬🇧 English</Text>
                            </TouchableOpacity>
                        </View>
                        <NavigationButtons anyError={error} data={data}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}