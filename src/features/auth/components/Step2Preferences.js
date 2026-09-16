import { View, Text, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ScrollView } from "react-native";
import styles from "../styles/styles";
import LogoArea from "./RegisterHeader";
import NavigationButtons from "./NavigationButtons";
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { useAuth } from "@/contextapis/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Step2Preferences() {
    const { t } = useTranslation();
    const { appLanguage, changeAppLanguage, registerData } = useAuth();
    const { colors } = useTheme();
    const aColors = colors.auth;

    const [username, setUsername] = useState(registerData["nick_name"] || "");
    const [lang, setLang] = useState(appLanguage || "en");
    const [error, setError] = useState();

    const usernameValid = username && username?.length >= 4;
    const validLang = lang ? true : false;
    const isFormValid = usernameValid && validLang;

    const data = isFormValid ? {
        "nick_name": username
    } : null;

    useEffect(() => {
        if (isFormValid) {
            setError(false);
        } else {
            setError(true);
        }
    }, [isFormValid]);

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
                        <Text style={[styles.titleText, { color: aColors.title }]}>{t('ruleYourWordistan')}</Text>
                        <View>
                            {/* Username Input */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <FontAwesome5 name="user-alt" size={15} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('username')}</Text>
                            </View>
                            <TextInput 
                                autoCapitalize="none" 
                                onChangeText={(value) => setUsername(value)}
                                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                                placeholder={t('howShouldICallYou')} 
                                placeholderTextColor={aColors.placeholder}
                                value={username} 
                            />
                            {!usernameValid && username?.length > 0 && (
                                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t('usernameWarning')}</Text>
                            )}

                            {/* Language Selection */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                <FontAwesome name="language" size={16} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('languageSelection')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 20 }}>
                                <TouchableOpacity 
                                    onPress={() => { setLang("tr"); changeAppLanguage("tr"); }} 
                                    activeOpacity={0.7}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 10,
                                        borderWidth: 1.5,
                                        borderColor: lang === "tr" ? aColors.chipActiveBg : aColors.chipInactiveBorder,
                                        backgroundColor: lang === "tr" ? aColors.chipActiveBg : aColors.chipInactiveBg,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ 
                                        color: lang === "tr" ? aColors.chipActiveText : aColors.chipInactiveText,
                                        fontWeight: lang === "tr" ? '700' : '600',
                                        fontSize: 13.5
                                    }}>
                                        🇹🇷 Türkçe
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => { setLang("en"); changeAppLanguage("en"); }} 
                                    activeOpacity={0.7}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 10,
                                        borderWidth: 1.5,
                                        borderColor: lang === "en" ? aColors.chipActiveBg : aColors.chipInactiveBorder,
                                        backgroundColor: lang === "en" ? aColors.chipActiveBg : aColors.chipInactiveBg,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ 
                                        color: lang === "en" ? aColors.chipActiveText : aColors.chipInactiveText,
                                        fontWeight: lang === "en" ? '700' : '600',
                                        fontSize: 13.5
                                    }}>
                                        🇬🇧 English
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <NavigationButtons anyError={error} data={data} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}