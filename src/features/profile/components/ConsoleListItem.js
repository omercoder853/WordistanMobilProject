import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contextapis/AuthContext";
import { useTheme } from "@/contextapis/ThemeContext";

const ITEM_THEMES = {
    "Personal Details": { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.12)" },
    "Statistics": { color: "#10B981", bg: "rgba(16, 185, 129, 0.12)" },
    "Game Sessions": { color: "#6366F1", bg: "rgba(99, 102, 241, 0.12)" },
    "Achievements": { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.12)" },
    "Preferences": { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.12)" },
    "Help & Support": { color: "#14B8A6", bg: "rgba(20, 184, 166, 0.12)" },
    "About Wordistan": { color: "#A855F7", bg: "rgba(168, 85, 247, 0.12)" },
    "Logout": { color: "#EF4444", bg: "rgba(239, 68, 68, 0.12)" },
};

export default function ConsoleButton({ item }) {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { logout,isGuest } = useAuth();
    const { colors, isDark } = useTheme();
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert, setAlertLoading } = useFeedback();

    async function logoutButton() {
        setAlertLoading(true);
        const res = await logout();
        hideAlert();
    }

    function handleLogout() {
        setAlertTitle(t("warning"));
        if (isGuest) {
            setAlertMessage(t('logoutWarningGuest'))
        }
        else {
            setAlertMessage(t("logoutWarning"));
        }
        addAlertButton({ text: t("cancel"), style: "cancel", action: () => hideAlert() });
        addAlertButton({ text: t("exit"), style: "danger", action: logoutButton, needLoading: true });
        setAlertVisible(true);
    }

    const isLogout = item.name === "Logout";
    const itemTheme = ITEM_THEMES[item.name] || { 
        color: colors.profile.textPrimary, 
        bg: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)" 
    };

    const cardBg = isLogout
        ? (isDark ? "rgba(239, 68, 68, 0.08)" : "#FEF2F2")
        : colors.profile.cardBg;

    const cardBorderColor = isLogout
        ? (isDark ? "rgba(239, 68, 68, 0.25)" : "#FEE2E2")
        : colors.profile.cardBorder;

    return (
        <TouchableOpacity 
            onPress={isLogout ? handleLogout : () => navigation.navigate("Profile Navigation", { screen: item.name })}
            activeOpacity={0.7}
        >
            <View style={[
                styles.consoleButton,
                {
                    backgroundColor: cardBg,
                    borderColor: cardBorderColor,
                }
            ]}>
                {/* Özel Renkli İkon Kutucuğu */}
                <View style={[
                    styles.consoleIconBox, 
                    { backgroundColor: itemTheme.bg }
                ]}>
                    <Ionicons name={item.icon} size={20} color={itemTheme.color} />
                </View>

                {/* Başlık Metni */}
                <Text style={[
                    styles.consoleLabel, 
                    { color: isLogout ? "#EF4444" : colors.profile.textPrimary }
                ]}>
                    {item.label || item.name}
                </Text>

                {/* Sağ Ok */}
                <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={isLogout ? "#EF4444" : colors.profile.textSecondary} 
                    style={styles.chevron}
                />
            </View>
        </TouchableOpacity>
    );
}