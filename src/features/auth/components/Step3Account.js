import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Step3Account({ formData, updateFormField }) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const aColors = colors.auth;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const email = formData?.email || "";
    const password = formData?.password || "";
    const passwordVerification = formData?.password_confirm || "";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;

    const validEmail = emailRegex.test(email.trim());
    const validPassword = passwordRegex.test(password.trim());
    const validPasswordVerification = validPassword && password.trim() === passwordVerification.trim();

    return (
        <View style={{ width: "100%" }}>
            <Text style={[styles.titleText, { color: aColors.title }]}>{t("joinTheKingdom")}</Text>

            {/* Email */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <MaterialIcons name="email" size={18} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("email")}</Text>
            </View>
            <TextInput 
                autoCapitalize="none" 
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={(value) => updateFormField("email", value.toLowerCase())} 
                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                placeholder={t("emailPlaceholder")} 
                placeholderTextColor={aColors.placeholder}
                value={email}
            />
            {!validEmail && email.length > 0 && (
                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t("validEmailWarning")}</Text>
            )}

            {/* Password */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <MaterialIcons name="vpn-key" size={18} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("passwordLabel")}</Text>
            </View>
            <View style={{ position: "relative", justifyContent: "center" }}>
                <TextInput 
                    autoCapitalize="none" 
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    textContentType="newPassword"
                    onChangeText={(value) => updateFormField("password", value)} 
                    style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText, paddingRight: 40 }]} 
                    placeholder={t("yourPassword")} 
                    placeholderTextColor={aColors.placeholder}
                    value={password}
                />
                <TouchableOpacity 
                    onPress={() => setShowPassword(prev => !prev)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={{ position: "absolute", right: 10, top: 18 }}
                >
                    <MaterialIcons 
                        name={showPassword ? "visibility" : "visibility-off"} 
                        size={20} 
                        color={aColors.toggleIcon} 
                    />
                </TouchableOpacity>
            </View>
            {!validPassword && password.length > 0 && (
                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t("passwordRule")}</Text>
            )}

            {/* Password Verification */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <MaterialIcons name="vpn-key" size={18} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("passwordVerification")}</Text>
            </View>
            <View style={{ position: "relative", justifyContent: "center" }}>
                <TextInput 
                    autoCapitalize="none" 
                    autoCorrect={false}
                    secureTextEntry={!showConfirmPassword}
                    textContentType="newPassword"
                    onChangeText={(value) => updateFormField("password_confirm", value)} 
                    style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText, paddingRight: 40 }]} 
                    placeholder={t("enterPasswordAgain")} 
                    placeholderTextColor={aColors.placeholder}
                    value={passwordVerification}
                />
                <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(prev => !prev)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={{ position: "absolute", right: 10, top: 18 }}
                >
                    <MaterialIcons 
                        name={showConfirmPassword ? "visibility" : "visibility-off"} 
                        size={20} 
                        color={aColors.toggleIcon} 
                    />
                </TouchableOpacity>
            </View>
            {!validPasswordVerification && passwordVerification.length > 0 && (
                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t("passwordsNotSameWarning")}</Text>
            )}
        </View>
    );
}