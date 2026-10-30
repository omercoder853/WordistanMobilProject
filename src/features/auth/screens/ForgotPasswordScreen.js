import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTheme } from "@/contextapis/ThemeContext";
import { ENDPOINTS } from "@/constants/ApiConfig";
import { apiClient } from "@/services/ApiClient";

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const aColors = colors.auth;
    const {
        setAlertTitle,
        setAlertMessage,
        addAlertButton,
        setAlertVisible,
        hideAlert,
    } = useFeedback();
    const [email, setEmail] = useState("");
    const [focused, setFocused] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const showEmailError = (submitted || email.length > 0) && !isValidEmail;

    const showResultAlert = (success) => {
        hideAlert();
        setAlertTitle(t(success ? "passwordResetEmailSentTitle" : "passwordResetEmailFailedTitle"));
        setAlertMessage(t(success ? "passwordResetEmailSentMessage" : "passwordResetEmailFailedMessage"));
        addAlertButton({
            text: success ? t("login") : t("cancel"),
            style: success ? undefined : "danger",
            action: success
                ? () => {
                    hideAlert();
                    navigation.navigate("Login");
                }
                : hideAlert,
        });
        setAlertVisible(true);
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        if (!isValidEmail || loading) return;

        setLoading(true);
        try {
            const response = await apiClient.post(
                ENDPOINTS.forgotPassword,
                { email: email.trim() },
                false
            );
            showResultAlert(response.ok);
        } catch {
            showResultAlert(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: aColors.background }]}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={aColors.background}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.container, { backgroundColor: aColors.mainContainerBg }]}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={t("login")}
                            onPress={() => navigation.goBack()}
                            style={[styles.backButton, { backgroundColor: aColors.cardBg, borderColor: aColors.cardBorder }]}
                        >
                            <MaterialIcons name="arrow-back" size={22} color={aColors.inputIcon} />
                        </TouchableOpacity>

                        <View style={[
                            styles.card,
                            {
                                backgroundColor: aColors.cardBg,
                                borderColor: aColors.cardBorder,
                                shadowColor: aColors.cardShadow,
                            },
                        ]}>
                            <View style={[styles.iconCircle, { backgroundColor: colors.common.primarySubtle }]}>
                                <MaterialIcons name="lock-reset" size={38} color={aColors.title} />
                            </View>
                            <Text style={[styles.title, { color: aColors.title }]}>
                                {t("forgotPassword")}
                            </Text>
                            <Text style={[styles.description, { color: aColors.subtitle }]}>
                                {t("passwordResetDescription")}
                            </Text>

                            <View style={styles.inputGroup}>
                                <View style={styles.labelRow}>
                                    <MaterialIcons name="email" size={18} color={aColors.inputIcon} />
                                    <Text style={[styles.label, { color: aColors.label }]}>
                                        {t("emailLabel")}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.inputWrapper,
                                    {
                                        backgroundColor: aColors.inputBg,
                                        borderColor: showEmailError
                                            ? aColors.errorText
                                            : focused
                                                ? aColors.inputBorderFocused
                                                : aColors.inputBorder,
                                    },
                                ]}>
                                    <TextInput
                                        accessibilityLabel={t("emailLabel")}
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        onBlur={() => setFocused(false)}
                                        onChangeText={setEmail}
                                        onFocus={() => setFocused(true)}
                                        onSubmitEditing={handleSubmit}
                                        placeholder={t("emailPlaceholder")}
                                        placeholderTextColor={aColors.placeholder}
                                        returnKeyType="send"
                                        style={[styles.input, { color: aColors.inputText }]}
                                        value={email}
                                    />
                                </View>
                                {showEmailError && (
                                    <Text style={[styles.errorText, { color: aColors.errorText }]}>
                                        {t("validEmailAddressWarning")}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.82}
                                disabled={loading}
                                onPress={handleSubmit}
                                style={[
                                    styles.submitButton,
                                    { backgroundColor: aColors.primaryButtonBg },
                                    loading && styles.disabledButton,
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator color={aColors.primaryButtonText} />
                                ) : (
                                    <>
                                        <Text style={[styles.submitText, { color: aColors.primaryButtonText }]}>
                                            {t("sendResetLink")}
                                        </Text>
                                        <MaterialIcons name="arrow-forward" size={20} color={aColors.primaryButtonText} />
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                accessibilityRole="button"
                                onPress={() => navigation.navigate("Login")}
                                style={styles.loginLink}
                            >
                                <Text style={[styles.loginLinkText, { color: aColors.linkText }]}>
                                    {t("login")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    backButton: {
        position: "absolute",
        top: 16,
        left: 20,
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 14,
        zIndex: 1,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 5,
    },
    iconCircle: {
        width: 76,
        height: 76,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 38,
        marginBottom: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        textAlign: "center",
    },
    description: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 28,
    },
    inputGroup: {
        width: "100%",
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        marginBottom: 8,
    },
    label: {
        fontSize: 13.5,
        fontWeight: "700",
    },
    inputWrapper: {
        minHeight: 50,
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 14,
        justifyContent: "center",
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 11,
    },
    errorText: {
        fontSize: 12,
        lineHeight: 16,
        marginTop: 6,
    },
    submitButton: {
        width: "100%",
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.14,
        shadowRadius: 5,
        elevation: 3,
    },
    submitText: {
        fontSize: 15,
        fontWeight: "800",
    },
    disabledButton: {
        opacity: 0.6,
    },
    loginLink: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginTop: 8,
    },
    loginLinkText: {
        fontSize: 14,
        fontWeight: "700",
    },
});
