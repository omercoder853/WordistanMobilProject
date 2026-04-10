import { View,Text,TouchableOpacity,Switch,TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import * as Localization from 'expo-localization';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../profileStyle/preferencesStyle";

export default function Preferences(){
    const {t,i18n} = useTranslation();
    const [langOpen,setLangOpen] = useState(false);
    const [langValue,setLangValue] = useState(null);
    const [pageOpen,setPageOpen] = useState(false);
    const [pageValue,setPageValue] = useState(null);
    const [autoCont,setAutoCont] = useState(null);
    const [vibration,setVibration] = useState(null);
    const deviceLang = Localization.getLocales()[0].languageCode
    const deviceLangLabel = deviceLang == "tr" ? t("turkish") : t("english")
    const langItems = [{label:t("system")+` (${deviceLangLabel})`,value:"system"},
        {label:t("english"),value:"en"},{label:t("turkish"),value:"tr"}]
    const pageItems = [{label:t("home"),value:"Home"},{label:t("translate"),value:"Translate"},{label:t("dictionaries"),value:"Dictionaries"}]

    useEffect(() => {
        const loadSavedDefault = async () => {
            const savedLang = await AsyncStorage.getItem("@wordistan:language");
            setLangValue(savedLang || "system");
            const savedPage = await AsyncStorage.getItem("@wordistan:initialPage")
            setPageValue(savedPage || "Home")
            const savedAutoCont = await AsyncStorage.getItem("@wordistan:autoCont")
            setAutoCont(savedAutoCont !== null ? JSON.parse(savedAutoCont):false)
            const savedVibration = await AsyncStorage.getItem("@wordistan:vibration")
            setVibration(savedVibration !== null ? JSON.parse(savedVibration):true)
        };
        loadSavedDefault();
    }, []);

    useEffect(() => {
        if (!langValue) return;
        const updateLanguage = async () => {
            await AsyncStorage.setItem("@wordistan:language", langValue);
            if (langValue === "system") {
                i18n.changeLanguage(deviceLang);
            } else {
                i18n.changeLanguage(langValue);
            }
        };
        updateLanguage();
    }, [langValue]);

    useEffect(()=>{
        if (!pageValue) return;
        const updateInitialPage = async () => {
            await AsyncStorage.setItem("@wordistan:initialPage",pageValue)
        }
        updateInitialPage(); 
    },[pageValue])

    useEffect(()=>{
        if (autoCont == null) return;
        const updateAutoCont = async ()=>{
            await AsyncStorage.setItem("@wordistan:autoCont",JSON.stringify(autoCont))
        }
        updateAutoCont();
    },[autoCont])

    useEffect(()=>{
        if (vibration == null) return;
        const updateVibration = async()=>{
            await AsyncStorage.setItem("@wordistan:vibration",JSON.stringify(vibration))
        }
        updateVibration();
    },[vibration])

    return (
        <TouchableWithoutFeedback onPress={()=>{setPageOpen(false),setLangOpen(false)}}>
            <View style={{flex:1,width:'90%',alignSelf:'center',marginTop:20}}>
                <View style={[styles.preferenceCategory, { zIndex: 10 }]}>
                    <View style={{flexDirection:'row',alignItems:'center',zIndex:2000,marginBottom:20}}>
                        <Text>{t("appLanguage")}</Text>
                        <DropDownPicker open={langOpen} setOpen={setLangOpen} value={langValue} setValue={setLangValue} 
                        items={langItems} containerStyle={{width:150,marginLeft:'auto'}} 
                        style={{borderColor:"#8e4a7c",paddingVertical:0,minHeight:35}} zIndex={3000} zIndexInverse={1000} />
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',zIndex:1000}}>
                        <Text>{t("initialPage")}</Text>
                        <DropDownPicker open={pageOpen} setOpen={setPageOpen} items={pageItems} 
                        value={pageValue} setValue={setPageValue} containerStyle={{width:150,marginLeft:'auto'}} 
                        style={{borderColor:"#8e4a7c",paddingVertical:0,minHeight:35}} zIndex={2000} zIndexInverse={2000} />
                    </View>
                </View>
                <View style={[styles.preferenceCategory, { zIndex: 1 }]}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text>{t("autoCont")}</Text>
                        <Switch value={autoCont ?? false} onValueChange={(val)=>setAutoCont(val)} style={{marginLeft:'auto'}}/>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text>{t("vibration")}</Text>
                        <Switch value={vibration ?? true} onValueChange={(val)=>setVibration(val)} style={{marginLeft:'auto'}}/>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}