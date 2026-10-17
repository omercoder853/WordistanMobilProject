import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import styles from "../styles/styles";
import { FontAwesome5, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";
import { AVATARS } from "@/constants/AvatarUrls";

const AVATAR_KEYS = Object.keys(AVATARS);

export default function Step2Preferences({ formData, updateFormField, changeAppLanguage }) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const aColors = colors.auth;

    const username = formData?.nick_name || "";
    const lang = formData?.language || "en";
    const selectedAvatar = formData?.avatar_url || "avatar_1";
    const usernameValid = username && username.length >= 4;

    const selectLanguage = (selectedLang) => {
        updateFormField("language", selectedLang);
        if (changeAppLanguage) {
            changeAppLanguage(selectedLang);
        }
    };

    return (
        <View style={{ width: "100%" }}>
            <Text style={[styles.titleText, { color: aColors.title }]}>{t("ruleYourWordistan")}</Text>

            {/* Username Input */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <FontAwesome5 name="user-alt" size={15} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("username")}</Text>
            </View>
            <TextInput 
                autoCapitalize="none" 
                onChangeText={(value) => updateFormField("nick_name", value)}
                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                placeholder={t("howShouldICallYou")} 
                placeholderTextColor={aColors.placeholder}
                value={username} 
            />
            {!usernameValid && username.length > 0 && (
                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t("usernameWarning")}</Text>
            )}

            {/* Avatar Selection */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("selectAvatar")}</Text>
                <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: aColors.chipActiveBg,
                    overflow: "hidden",
                }}>
                    <Image
                        source={AVATARS[selectedAvatar] || AVATARS.avatar_1}
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
            >
                {AVATAR_KEYS.map((avatarKey) => {
                    const isSelected = selectedAvatar === avatarKey;
                    return (
                        <TouchableOpacity
                            key={avatarKey}
                            activeOpacity={0.75}
                            onPress={() => updateFormField("avatar_url", avatarKey)}
                            style={{
                                width: 54,
                                height: 54,
                                borderRadius: 27,
                                borderWidth: 2,
                                borderColor: isSelected ? aColors.chipActiveBg : aColors.chipInactiveBorder,
                                padding: 2,
                            }}
                        >
                            <Image
                                source={AVATARS[avatarKey]}
                                style={{ width: "100%", height: "100%", borderRadius: 24 }}
                            />
                            {isSelected && (
                                <View style={{
                                    position: "absolute",
                                    right: -2,
                                    top: -2,
                                    width: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    backgroundColor: aColors.chipActiveBg,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Language Selection */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                <FontAwesome name="language" size={16} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("languageSelection")}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 16 }}>
                <TouchableOpacity 
                    onPress={() => selectLanguage("tr")} 
                    activeOpacity={0.7}
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: lang === "tr" ? aColors.chipActiveBg : aColors.chipInactiveBorder,
                        backgroundColor: lang === "tr" ? aColors.chipActiveBg : aColors.chipInactiveBg,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ 
                        color: lang === "tr" ? aColors.chipActiveText : aColors.chipInactiveText,
                        fontWeight: lang === "tr" ? "700" : "600",
                        fontSize: 13.5
                    }}>
                        🇹🇷 Türkçe
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => selectLanguage("en")} 
                    activeOpacity={0.7}
                    style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 10,
                        borderWidth: 1.5,
                        borderColor: lang === "en" ? aColors.chipActiveBg : aColors.chipInactiveBorder,
                        backgroundColor: lang === "en" ? aColors.chipActiveBg : aColors.chipInactiveBg,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ 
                        color: lang === "en" ? aColors.chipActiveText : aColors.chipInactiveText,
                        fontWeight: lang === "en" ? "700" : "600",
                        fontSize: 13.5
                    }}>
                        🇬🇧 English
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}