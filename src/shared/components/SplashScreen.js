import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function SplashScreen() {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.common.background }]}>
            <View style={styles.logoStage}>
                <View style={[
                    styles.logoFrame,
                    {
                        backgroundColor: colors.common.surface,
                        borderColor: colors.header.logoBorder,
                        shadowColor: colors.common.shadow,
                    },
                ]}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/logo.png')}
                        resizeMode="contain"
                    />
                </View>
            </View>
            <Text style={[styles.title, { color: colors.common.textPrimary }]}>{t('wordistan')}</Text>
            <ActivityIndicator size="large" color={colors.common.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoStage: {
        width: 220,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoFrame: {
        width: 164,
        height: 164,
        borderRadius: 46,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    logo: {
        width: 132,
        height: 132,
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        marginTop: 16,
        marginBottom: 20,
    },
})