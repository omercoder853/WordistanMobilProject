import { View, Text, Switch, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import * as Localization from "expo-localization";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/PreferencesScreenStyle";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Preferences() {
    const { t, i18n } = useTranslation();
    const { colors, themeMode, setThemeMode, isDark } = useTheme();
    const [langValue, setLangValue] = useState(null);
    const [pageValue, setPageValue] = useState(null);
    const [themeValue, setThemeValue] = useState(themeMode || "system");
    const [autoCont, setAutoCont] = useState(null);
    const [vibration, setVibration] = useState(null);

    const deviceLang = Localization.getLocales()[0]?.languageCode || "en";

    const langOptions = [
        { value: "system", label: `${t("system")} (${deviceLang.toUpperCase()})`, icon: "phone-portrait-outline" },
        { value: "en", label: "English", icon: "globe-outline" },
        { value: "tr", label: "Türkçe", icon: "globe-outline" },
    ];

    const pageOptions = [
        { value: "Home", label: t("home"), icon: "home-outline" },
        { value: "Translate", label: t("translate"), icon: "swap-horizontal-outline" },
        { value: "Dictionaries", label: t("dictionaries"), icon: "book-outline" },
    ];

    const themeOptions = [
        { value: "system", label: t("themeSystem"), icon: "phone-portrait-outline" },
        { value: "light", label: t("themeLight"), icon: "sunny-outline" },
        { value: "dark", label: t("themeDark"), icon: "moon-outline" },
    ];

    useEffect(() => {
        const loadSavedDefault = async () => {
            const savedLang = await storage.get(STORAGE_KEYS.PREFERENCES.LANGUAGE);
            setLangValue(savedLang || "system");

            const savedPage = await storage.get(STORAGE_KEYS.PREFERENCES.INITIAL_PAGE);
            setPageValue(savedPage || "Home");

            const savedAutoCont = await storage.get(STORAGE_KEYS.PREFERENCES.AUTO_CONT);
            setAutoCont(savedAutoCont !== null ? savedAutoCont : false);

            const savedVibration = await storage.get(STORAGE_KEYS.PREFERENCES.VIBRATION_PREF);
            setVibration(savedVibration !== null ? savedVibration : true);

            const savedTheme = await storage.get(STORAGE_KEYS.PREFERENCES.THEME);
            setThemeValue(savedTheme || themeMode || "system");
        };
        loadSavedDefault();
    }, []);

    useEffect(() => {
        if (themeMode) {
            setThemeValue(themeMode);
        }
    }, [themeMode]);

    useEffect(() => {
        if (!langValue) return;
        const updateLanguage = async () => {
            await storage.set(STORAGE_KEYS.PREFERENCES.LANGUAGE, langValue);
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
            await storage.set(STORAGE_KEYS.PREFERENCES.INITIAL_PAGE, pageValue);
        };
        updateInitialPage();
    }, [pageValue]);

    useEffect(() => {
        if (autoCont == null) return;
        const updateAutoCont = async () => {
            await storage.set(STORAGE_KEYS.PREFERENCES.AUTO_CONT, autoCont);
        };
        updateAutoCont();
    }, [autoCont]);

    useEffect(() => {
        if (vibration == null) return;
        const updateVibration = async () => {
            await storage.set(STORAGE_KEYS.PREFERENCES.VIBRATION_PREF, vibration);
        };
        updateVibration();
    }, [vibration]);

    // Theme selector: updates local state, storage, and ThemeContext
    const handleThemeSelect = async (val) => {
        setThemeValue(val);
        setThemeMode(val);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.common.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ─── GENEL (General) ─── */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.profile.sectionTitle }]}>{t("generalPreferences")}</Text>
                    <View style={[styles.card, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder, shadowColor: colors.common.shadow }]}>
                        {/* Uygulama Dili */}
                        <View style={styles.settingBlock}>
                            <View style={styles.settingHeader}>
                                <View style={[styles.iconBox, { backgroundColor: "rgba(99, 102, 241, 0.1)" }]}>
                                    <Ionicons name="globe-outline" size={20} color="#6366F1" />
                                </View>
                                <View style={styles.settingTextContainer}>
                                    <Text style={[styles.settingTitle, { color: colors.profile.textPrimary }]}>{t("appLanguage")}</Text>
                                    <Text style={[styles.settingDesc, { color: colors.profile.textSecondary }]}>{t("appLanguageDesc")}</Text>
                                </View>
                            </View>
                            <View style={[styles.segmentedContainer, { backgroundColor: colors.profile.segmentBg }]}>
                                {langOptions.map((opt) => {
                                    const isSelected = langValue === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => setLangValue(opt.value)}
                                            style={[styles.segmentBtn, isSelected && [styles.segmentBtnActive, { backgroundColor: colors.profile.segmentActiveBg }]]}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                 name={opt.icon}
                                                 size={15}
                                                 color={isSelected ? colors.profile.segmentActiveText : colors.profile.segmentInactiveText}
                                             />
                                             <Text
                                                 numberOfLines={1}
                                                 style={[styles.segmentText, { color: colors.profile.segmentInactiveText }, isSelected && { color: colors.profile.segmentActiveText, fontWeight: "700" }]}
                                             >
                                                 {opt.label}
                                             </Text>
                                         </TouchableOpacity>
                                     );
                                 })}
                             </View>
                         </View>

                        <View style={[styles.separator, { backgroundColor: colors.profile.separator }]} />

                        {/* Açılış Ekranı */}
                        <View style={styles.settingBlock}>
                            <View style={styles.settingHeader}>
                                <View style={[styles.iconBox, { backgroundColor: "rgba(59, 130, 246, 0.1)" }]}>
                                    <Ionicons name="compass-outline" size={20} color="#3B82F6" />
                                </View>
                                <View style={styles.settingTextContainer}>
                                    <Text style={[styles.settingTitle, { color: colors.profile.textPrimary }]}>{t("initialPage")}</Text>
                                    <Text style={[styles.settingDesc, { color: colors.profile.textSecondary }]}>{t("initialPageDesc")}</Text>
                                </View>
                            </View>
                            <View style={[styles.segmentedContainer, { backgroundColor: colors.profile.segmentBg }]}>
                                {pageOptions.map((opt) => {
                                    const isSelected = pageValue === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => setPageValue(opt.value)}
                                            style={[styles.segmentBtn, isSelected && [styles.segmentBtnActive, { backgroundColor: colors.profile.segmentActiveBg }]]}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                 name={opt.icon}
                                                 size={15}
                                                 color={isSelected ? colors.profile.segmentActiveText : colors.profile.segmentInactiveText}
                                             />
                                             <Text
                                                 numberOfLines={1}
                                                 style={[styles.segmentText, { color: colors.profile.segmentInactiveText }, isSelected && { color: colors.profile.segmentActiveText, fontWeight: "700" }]}
                                             >
                                                 {opt.label}
                                             </Text>
                                         </TouchableOpacity>
                                     );
                                 })}
                             </View>
                         </View>
                    </View>
                </View>

                {/* ─── GÖRÜNÜM (Appearance) ─── */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.profile.sectionTitle }]}>{t("appearancePreferences")}</Text>
                    <View style={[styles.card, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder, shadowColor: colors.common.shadow }]}>
                        {/* Tema */}
                        <View style={styles.settingBlock}>
                            <View style={styles.settingHeader}>
                                <View style={[styles.iconBox, { backgroundColor: "rgba(139, 92, 246, 0.1)" }]}>
                                    <Ionicons name="color-palette-outline" size={20} color="#8B5CF6" />
                                </View>
                                <View style={styles.settingTextContainer}>
                                    <Text style={[styles.settingTitle, { color: colors.profile.textPrimary }]}>{t("appTheme")}</Text>
                                    <Text style={[styles.settingDesc, { color: colors.profile.textSecondary }]}>{t("themeDesc")}</Text>
                                </View>
                            </View>
                            <View style={[styles.segmentedContainer, { backgroundColor: colors.profile.segmentBg }]}>
                                {themeOptions.map((opt) => {
                                    const isSelected = themeValue === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => handleThemeSelect(opt.value)}
                                            style={[styles.segmentBtn, isSelected && [styles.segmentBtnActive, { backgroundColor: colors.profile.segmentActiveBg }]]}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                 name={opt.icon}
                                                 size={15}
                                                 color={isSelected ? colors.profile.segmentActiveText : colors.profile.segmentInactiveText}
                                             />
                                             <Text
                                                 numberOfLines={1}
                                                 style={[styles.segmentText, { color: colors.profile.segmentInactiveText }, isSelected && { color: colors.profile.segmentActiveText, fontWeight: "700" }]}
                                             >
                                                 {opt.label}
                                             </Text>
                                         </TouchableOpacity>
                                     );
                                 })}
                             </View>
                         </View>
                    </View>
                </View>

                {/* ─── OYUNLAR (Games) ─── */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.profile.sectionTitle }]}>{t("gamePreferences")}</Text>
                    <View style={[styles.card, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder, shadowColor: colors.common.shadow }]}>
                        {/* Otomatik İlerleme */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconBox, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
                                    <Ionicons name="play-forward-outline" size={20} color="#10B981" />
                                </View>
                                <View style={styles.settingTextContainer}>
                                    <Text style={[styles.settingTitle, { color: colors.profile.textPrimary }]}>{t("autoCont")}</Text>
                                    <Text style={[styles.settingDesc, { color: colors.profile.textSecondary }]}>{t("autoContDesc")}</Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: isDark ? "#333544" : "#E2E8F0", true: colors.common.primary }}
                                thumbColor="#FFFFFF"
                                value={autoCont ?? false}
                                onValueChange={(val) => setAutoCont(val)}
                            />
                        </View>

                        <View style={[styles.separator, { backgroundColor: colors.profile.separator }]} />

                        {/* Titreşim */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconBox, { backgroundColor: "rgba(245, 158, 11, 0.1)" }]}>
                                    <MaterialCommunityIcons name="vibrate" size={20} color="#F59E0B" />
                                </View>
                                <View style={styles.settingTextContainer}>
                                    <Text style={[styles.settingTitle, { color: colors.profile.textPrimary }]}>{t("vibration")}</Text>
                                    <Text style={[styles.settingDesc, { color: colors.profile.textSecondary }]}>{t("vibrationDesc")}</Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: isDark ? "#333544" : "#E2E8F0", true: colors.common.primary }}
                                thumbColor="#FFFFFF"
                                value={vibration ?? true}
                                onValueChange={(val) => setVibration(val)}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}