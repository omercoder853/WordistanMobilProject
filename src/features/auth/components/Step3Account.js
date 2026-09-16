import { View, Text, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform, ScrollView, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import LogoArea from "./RegisterHeader";
import NavigationButtons from "../components/NavigationButtons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from "@/contextapis/ThemeContext";

export default function Step3Account() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const aColors = colors.auth;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerification, setPasswordVerification] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;

    const validEmail = emailRegex.test(email.trim());
    const validPassword = passwordRegex.test(password.trim());
    const validPasswordVerification = validPassword && password.trim() === passwordVerification.trim();
    const isValidForm = validEmail && validPassword && validPasswordVerification;

    const data = isValidForm ? {
        "email": email.trim(),
        "password": password.trim(),
        "password_confirm": passwordVerification.trim()
    } : null;

    useEffect(() => {
        if (!isValidForm) {
            setError(true);
        } else {
            setError(false);
        }
    }, [isValidForm]);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                    <View style={[styles.mainContainer, { backgroundColor: aColors.cardBg, borderColor: aColors.cardBorder }]}>
                        <LogoArea />
                        <Text style={[styles.titleText, { color: aColors.title }]}>{t('joinTheKingdom')}</Text>
                        <View>
                            {/* Email */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <MaterialIcons name="email" size={18} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('email')}</Text>
                            </View>
                            <TextInput 
                                autoCapitalize="none" 
                                autoCorrect={false}
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                onChangeText={(value) => setEmail(value.toLowerCase())} 
                                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                                placeholder={t('emailPlaceholder')} 
                                placeholderTextColor={aColors.placeholder}
                            />
                            {!validEmail && email.length > 0 && (
                                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t('validEmailWarning')}</Text>
                            )}

                            {/* Password */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <MaterialIcons name="vpn-key" size={18} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('passwordLabel')}</Text>
                            </View>
                            <View style={{ position: 'relative', justifyContent: 'center' }}>
                                <TextInput 
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={!showPassword}
                                    textContentType="newPassword"
                                    onChangeText={(value) => setPassword(value)} 
                                    style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText, paddingRight: 40 }]} 
                                    placeholder={t('yourPassword')} 
                                    placeholderTextColor={aColors.placeholder}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowPassword(prev => !prev)}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                    style={{ position: 'absolute', right: 10, top: 18 }}
                                >
                                    <MaterialIcons 
                                        name={showPassword ? "visibility" : "visibility-off"} 
                                        size={20} 
                                        color={aColors.toggleIcon} 
                                    />
                                </TouchableOpacity>
                            </View>
                            {!validPassword && password.length > 0 && (
                                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t('passwordRule')}</Text>
                            )}

                            {/* Password Verification */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <MaterialIcons name="vpn-key" size={18} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('passwordVerification')}</Text>
                            </View>
                            <View style={{ position: 'relative', justifyContent: 'center' }}>
                                <TextInput 
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={!showConfirmPassword}
                                    textContentType="newPassword"
                                    onChangeText={(value) => setPasswordVerification(value)} 
                                    style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText, paddingRight: 40 }]} 
                                    placeholder={t('enterPasswordAgain')} 
                                    placeholderTextColor={aColors.placeholder}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowConfirmPassword(prev => !prev)}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                    style={{ position: 'absolute', right: 10, top: 18 }}
                                >
                                    <MaterialIcons 
                                        name={showConfirmPassword ? "visibility" : "visibility-off"} 
                                        size={20} 
                                        color={aColors.toggleIcon} 
                                    />
                                </TouchableOpacity>
                            </View>
                            {!validPasswordVerification && passwordVerification.length > 0 && (
                                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t('passwordsNotSameWarning')}</Text>
                            )}
                        </View>

                        <NavigationButtons anyError={error} data={data} />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}