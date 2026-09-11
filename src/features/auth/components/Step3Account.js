import { View, Text, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from "react-native";
import styles from "../styles/styles";
import LogoArea from "./RegisterHeader";
import NavigationButtons from "../components/NavigationButtons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function Step3Account() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerification, setPasswordVerification] = useState("");
    const [error, setError] = useState();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;

    const validEmail = emailRegex.test(email.trim())
    const validPassword = passwordRegex.test(password.trim())
    const validPasswordVerification = validPassword && password.trim() == passwordVerification.trim()
    const isValidForm = validEmail && validPassword && validPasswordVerification

    const data = isValidForm ? {
        "email": email.trim(),
        "password": password.trim(),
        "password_confirm": passwordVerification.trim()
    } : null;

    useEffect(() => {
        if (!isValidForm) {
            setError(true)
        }
        else {
            setError(false)
        }
    }, [isValidForm])
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.mainContainer}>
                    <LogoArea />
                    <Text style={styles.titleText}>{t('joinTheKingdom')}</Text>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <MaterialIcons name="email" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('email')}</Text>
                        </View>
                        <TextInput autoCapitalize="none" onChangeText={(value) => setEmail(value.toLowerCase())} style={styles.inputArea} placeholder={t('emailPlaceholder')} />
                        {!validEmail && email.length > 0 && <Text style={styles.warningText}>{t('validEmailWarning')}</Text>}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <MaterialIcons name="password" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('passwordLabel')}</Text>
                        </View>
                        <TextInput onChangeText={(value) => setPassword(value)} style={styles.inputArea} placeholder={t('yourPassword')} />
                        {!validPassword && password.length > 0 && <Text style={styles.warningText}>{t('passwordRule')}</Text>}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <MaterialIcons name="password" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('passwordVerification')}</Text>
                        </View>
                        <TextInput onChangeText={(value) => setPasswordVerification(value)} style={styles.inputArea} placeholder={t('enterPasswordAgain')} />
                        {!validPasswordVerification && passwordVerification.length > 0 && <Text style={styles.warningText}>{t('passwordsNotSameWarning')}</Text>}
                    </View>

                    <NavigationButtons anyError={error} data={data} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}