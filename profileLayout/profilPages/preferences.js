import { View, Text,Switch } from "react-native";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import * as Localization from 'expo-localization';
import { useEffect } from "react";
import styles from "../profileStyle/preferencesStyle";
import { storage } from "../../src/storage/storage";
import { STORAGE_KEYS } from "../../src/constants/StorageKeys";

export default function Preferences() {
    const { t, i18n } = useTranslation();
    const [langOpen, setLangOpen] = useState(false);
    const [langValue, setLangValue] = useState(null);
    const [pageOpen, setPageOpen] = useState(false);
    const [pageValue, setPageValue] = useState(null);
    const [autoCont, setAutoCont] = useState(null);
    const [vibration, setVibration] = useState(null);
    const deviceLang = Localization.getLocales()[0].languageCode
    const deviceLangLabel = deviceLang == "tr" ? t("turkish") : t("english")
    const langItems = [{ label: t("system") + ` (${deviceLangLabel})`, value: "system" },
    { label: t("english"), value: "en" }, { label: t("turkish"), value: "tr" }]

    const pageItems = [{ label: t("home"), value: "Home" }, { label: t("translate"), value: "Translate" }, 
        { label: t("dictionaries"), value: "Dictionaries" }]

    useEffect(() => {
        const loadSavedDefault = async () => {
            const savedLang = await storage.get(STORAGE_KEYS.PREFERENCES.LANGUAGE);
            setLangValue(savedLang || "system");
            const savedPage = await storage.get(STORAGE_KEYS.PREFERENCES.INITIAL_PAGE);
            setPageValue(savedPage || "Home")
            const savedAutoCont = await storage.get(STORAGE_KEYS.PREFERENCES.AUTO_CONT);
            setAutoCont(savedAutoCont !== null ? savedAutoCont : false)
            const savedVibration = await storage.get(STORAGE_KEYS.PREFERENCES.VIBRATION_PREF);
            setVibration(savedVibration !== null ? savedVibration : true)
        };
        loadSavedDefault();
    }, []);

    useEffect(() => {
        if (!langValue) return;
        const updateLanguage = async () => {
            await storage.set(STORAGE_KEYS.PREFERENCES.LANGUAGE , langValue);
            if (langValue === "system") {
                i18n.changeLanguage(deviceLang);
            } else {
                i18n.changeLanguage(langValue);
            }
        };
        updateLanguage();
    }, [langValue]);

    useEffect(() => {
        if (!pageValue) return;
        const updateInitialPage = async () => {
            await storage.set(STORAGE_KEYS.PREFERENCES.INITIAL_PAGE,pageValue);
        }
        updateInitialPage();
    }, [pageValue])

    useEffect(() => {
        if (autoCont == null) return;
        const updateAutoCont = async () => {
            await storage.set(STORAGE_KEYS.PREFERENCES.AUTO_CONT , autoCont);
        }
        updateAutoCont();
    }, [autoCont])

    useEffect(() => {
        if (vibration == null) return;
        const updateVibration = async () => {
            await storage.set(STORAGE_KEYS.PREFERENCES.VIBRATION_PREF, vibration);
        }
        updateVibration();
    }, [vibration])

    return (
        <View style={{ flex: 1 }} onStartShouldSetResponder={() => { setPageOpen(false); setLangOpen(false); return false; }}>
            <View style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: 20 }}>
                <View style={[styles.preferenceCategory, { zIndex: 10 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 2000, marginBottom: 20 }}>
                        <Text>{t("appLanguage")}</Text>
                        <DropDownPicker open={langOpen} setOpen={setLangOpen} value={langValue} setValue={setLangValue}
                            items={langItems} containerStyle={{ width: 150, marginLeft: 'auto' }}
                            style={{ borderColor: "#8e4a7c", paddingVertical: 0, minHeight: 35 }} zIndex={3000} zIndexInverse={1000} 
                            listMode="FLATLIST" onOpen={() => setPageOpen(false)} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 1000 }}>
                        <Text>{t("initialPage")}</Text>
                        <DropDownPicker open={pageOpen} setOpen={setPageOpen} items={pageItems}
                            value={pageValue} setValue={setPageValue} containerStyle={{ width: 150, marginLeft: 'auto' }}
                            style={{ borderColor: "#8e4a7c", paddingVertical: 0, minHeight: 35 }} zIndex={2000} zIndexInverse={2000} 
                            listMode="FLATLIST" onOpen={() => setLangOpen(false)} />
                    </View>
                </View>
                <View style={[styles.preferenceCategory, { zIndex: 1 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>{t("autoCont")}</Text>
                        <Switch value={autoCont ?? false} onValueChange={(val) => setAutoCont(val)} 
                        style={{ marginLeft: 'auto' }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>{t("vibration")}</Text>
                        <Switch value={vibration ?? true} onValueChange={(val) => setVibration(val)} 
                        style={{ marginLeft: 'auto'}}/>
                    </View>
                </View>
            </View>
        </View>
    )
}