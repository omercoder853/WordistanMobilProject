import { View, TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import styles from "../styles/styles";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contextapis/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTheme } from "@/contextapis/ThemeContext";

export default function NavigationButtons({ anyError, data, setSuccess }) {
    const { t } = useTranslation()
    const { registerData, setRegisterData, register } = useAuth();
    const { colors } = useTheme();
    const aColors = colors.auth;
    const [loading, setLoading] = useState(false);
    const pages = ["Login", "Personal Info", "Preferences", "Entry Info"]
    const route = useRoute();
    const navigation = useNavigation();
    const currentPage = route.name
    const currentIndex = pages.indexOf(currentPage)
    const isFirst = currentPage === "Personal Info"
    const isLast = currentPage === "Entry Info"
    const currentData = { ...registerData, ...data }
    const nextPage = () => {
        if (!anyError && data != null) {
            setRegisterData((prev) => ({
                ...prev,
                ...data
            }));
            const nextScreen = pages[currentIndex + 1]
            navigation.navigate(nextScreen)
        }
    }

    const registerButton = async () => {
        setLoading(true);
        await register(currentData)
        setLoading(false);
    }
    const backPage = () => {
        const backScreen = pages[currentIndex - 1]
        navigation.navigate(backScreen)
    }

    return (
        <View style={styles.buttonsArea}>
            <TouchableOpacity 
                onPress={backPage} 
                style={[styles.navigationButton, { backgroundColor: aColors.secondaryButtonBg }, loading && { opacity: 0.5 }]} 
                disabled={loading}
            >
                <Text style={{ color: aColors.secondaryButtonText, fontWeight: '800' }}>{isFirst ? t('loginPage') : t('back')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={isLast ? registerButton : nextPage} 
                disabled={loading || anyError}
                style={[styles.navigationButton, { backgroundColor: aColors.primaryButtonBg, marginLeft: 'auto' }, (loading || anyError) && { opacity: 0.5 }]}
            >
                {loading ? (<ActivityIndicator color={aColors.primaryButtonText} />) :
                    (<Text style={{ color: aColors.primaryButtonText, fontWeight: '800', fontSize: 15 }}>
                        {isLast ? t('createAccount') : t('next')}
                    </Text>)}
            </TouchableOpacity>
        </View>
    )
}