import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import styles from "../styles/styles";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function NavigationButtons({
    isFirst = false,
    isLast = false,
    onBack,
    onNext,
    disabled = false,
    loading = false,
}) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const aColors = colors.auth;

    return (
        <View style={styles.buttonsArea}>
            <TouchableOpacity 
                onPress={onBack} 
                style={[
                    styles.navigationButton, 
                    { backgroundColor: aColors.secondaryButtonBg,borderColor:aColors.cardBorder }, 
                    loading && { opacity: 0.5 }
                ]} 
                disabled={loading}
                activeOpacity={0.7}
            >
                <Text style={{ color: aColors.secondaryButtonText, fontWeight: "800" }}>
                    {isFirst ? t("loginPage") : t("back")}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={onNext} 
                disabled={loading || disabled}
                activeOpacity={0.7}
                style={[
                    styles.navigationButton, 
                    { backgroundColor: aColors.primaryButtonBg, marginLeft: "auto" }, 
                    (loading || disabled) && { opacity: 0.5 }
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={aColors.primaryButtonText} />
                ) : (
                    <Text style={{ color: aColors.primaryButtonText, fontWeight: "800", fontSize: 15 }}>
                        {isLast ? t("createAccount") : t("next")}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}