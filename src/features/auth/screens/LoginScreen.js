import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StyleSheet
} from "react-native";
import { useAuth } from "@/contextapis/AuthContext";
import { useState } from "react";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { storage } from "@/storage/storage";
import { ENDPOINTS } from "@/constants/ApiConfig";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { apiClient } from "@/services/ApiClient";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTheme } from "@/contextapis/ThemeContext";
import { statsSQLite } from "@/storage/StatsSQLite";
import { updateUserId, clearDatabase } from "@/storage/sqlite";

export default function LoginScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { colors, isDark } = useTheme();
    const aColors = colors.auth;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);
    const { setLogin, hydrateSession, manageGuest, setIsGuest, user } = useAuth();
    const [isLoading, setLoading] = useState(false);
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert, setVerticalButtons, showToast } = useFeedback();

    const isValidEmail = emailRegex.test(email);
    const isValidPassword = passwordRegex.test(password);
    const anyError = !isValidEmail || !isValidPassword;

    const preLoginOps = async (data,useGuestData=false,guestId=null) => {
        if (useGuestData===true && guestId!==null) {
            await updateUserId(guestId, data.profile.id);
        }
        else if (useGuestData===false){
            await clearDatabase();
        }
        await storage.clearSession();
        await storage.setSecure(STORAGE_KEYS.SECURE.ACCESS_TOKEN, data.access_token);
        await storage.setSecure(STORAGE_KEYS.SECURE.REFRESH_TOKEN, data.refresh_token);
        await storage.set(STORAGE_KEYS.SESSION.IS_GUEST, false);
        await hydrateSession({ profile: data.profile, user_stats: data.user_stats });
        setIsGuest(false);
        setLogin(true);
    }

    const login = async () => {
        Keyboard.dismiss();
        if (!anyError) {
            setLoading(true);
            const { ok, status, data } = await apiClient.post(ENDPOINTS.login, { email, password }, false);
            if (ok) {
                const tempGuestValue = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
                const tempUser = await storage.get(STORAGE_KEYS.SESSION.USER);
                let guestLogs=[]
                if(tempUser) guestLogs = await statsSQLite.selectOnlyLocalLogs(tempUser.id);

                if (tempGuestValue!==null && guestLogs?.length > 0) {
                    setAlertTitle(t('guestDataFound'));
                    setAlertMessage(t('guestDataFoundMessage'));
                    addAlertButton({ text: t('useData'), action: () => { hideAlert(),preLoginOps(data,true,tempUser.id) } });
                    addAlertButton({ text: t('discardData'), style: "cancel", action: () => { hideAlert(),preLoginOps(data,false) } });
                    setVerticalButtons(true);
                    setAlertVisible(true);
                }
                else {
                    await preLoginOps(data,false);
                }

            } else {
                console.log("❌ Login Screen : Error while signing in! Status :", status, data);
                if (status === 408) {
                    showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
                } else {
                    setAlertTitle(t('loginFailed'));
                    setAlertMessage(t('checkYourLoginDetails'));
                    addAlertButton({ text: t('cancel'), style: "danger", action: hideAlert });
                    setAlertVisible(true);
                }
            }
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: aColors.background }]}>
            <StatusBar style={isDark ? "light" : "dark"} backgroundColor={aColors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={[styles.mainContainer, { backgroundColor: aColors.mainContainerBg }]}>
                            <View style={[
                                styles.loginArea,
                                {
                                    backgroundColor: aColors.cardBg,
                                    borderColor: aColors.cardBorder,
                                    shadowColor: aColors.cardShadow
                                }
                            ]}>
                                {/* Header / Logo */}
                                <View style={styles.loginTitleRow}>
                                    <Image
                                        source={require('@/shared/assets/logo.png')}
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.loginTitle, { color: aColors.title }]}>
                                        {t('wordistan')}
                                    </Text>
                                </View>
                                <Text style={[styles.loginTitleSmall, { color: aColors.subtitle }]}>
                                    {t('translateDesc')}
                                </Text>

                                {/* Email Input */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.inputLabelRow}>
                                        <MaterialIcons name="email" size={18} color={aColors.inputIcon} />
                                        <Text style={[styles.inputLabel, { color: aColors.label }]}>
                                            {t('emailLabel')}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.inputWrapper,
                                        {
                                            backgroundColor: aColors.inputBg,
                                            borderColor: focusedInput === 'email'
                                                ? aColors.inputBorderFocused
                                                : aColors.inputBorder,
                                        }
                                    ]}>
                                        <TextInput
                                            style={[styles.textInput, { color: aColors.inputText }]}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            placeholder={t('emailPlaceholder')}
                                            placeholderTextColor={aColors.placeholder}
                                            value={email}
                                            onFocus={() => setFocusedInput('email')}
                                            onBlur={() => setFocusedInput(null)}
                                            onChangeText={(value) => setEmail(value.trim().toLowerCase())}
                                        />
                                    </View>
                                    {!isValidEmail && email.length > 0 && (
                                        <Text style={[styles.warningText, { color: aColors.errorText }]}>
                                            {t('validEmailAddressWarning')}
                                        </Text>
                                    )}
                                </View>

                                {/* Password Input */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.inputLabelRow}>
                                        <MaterialIcons name="vpn-key" size={18} color={aColors.inputIcon} />
                                        <Text style={[styles.inputLabel, { color: aColors.label }]}>
                                            {t('loginPasswordLabel')}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.inputWrapper,
                                        {
                                            backgroundColor: aColors.inputBg,
                                            borderColor: focusedInput === 'password'
                                                ? aColors.inputBorderFocused
                                                : aColors.inputBorder,
                                        }
                                    ]}>
                                        <TextInput
                                            style={[styles.textInput, styles.passwordInput, { color: aColors.inputText }]}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            secureTextEntry={!showPassword}
                                            textContentType="password"
                                            placeholder={t('password')}
                                            placeholderTextColor={aColors.placeholder}
                                            value={password}
                                            onFocus={() => setFocusedInput('password')}
                                            onBlur={() => setFocusedInput(null)}
                                            onChangeText={(value) => setPassword(value.trim())}
                                        />
                                        <TouchableOpacity
                                            style={styles.passwordToggle}
                                            onPress={() => setShowPassword(prev => !prev)}
                                            activeOpacity={0.7}
                                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                        >
                                            <MaterialIcons
                                                name={showPassword ? "visibility" : "visibility-off"}
                                                size={20}
                                                color={aColors.toggleIcon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {!isValidPassword && password.length > 0 && (
                                        <Text style={[styles.warningText, { color: aColors.errorText }]}>
                                            {t('passwordRule')}
                                        </Text>
                                    )}
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    onPress={login}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.loginButton,
                                        { backgroundColor: aColors.primaryButtonBg },
                                        (isLoading || anyError) && styles.disabledButton
                                    ]}
                                    disabled={isLoading || anyError}
                                >
                                    {isLoading ? (
                                        <LottieView
                                            source={require('../assets/anim_loading_dots.json')}
                                            style={styles.lottieLoading}
                                            loop
                                            autoPlay
                                            colorFilters={[{ keypath: "*", color: aColors.primaryButtonText }]}
                                        />
                                    ) : (
                                        <Text style={[styles.loginButtonText, { color: aColors.primaryButtonText }]}>
                                            {t('login')}
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    accessibilityRole="button"
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate("Forgot Password")}
                                    style={styles.forgotPasswordButton}
                                >
                                    <MaterialIcons name="lock-reset" size={17} color={aColors.linkText} />
                                    <Text style={[styles.forgotPasswordText, { color: aColors.linkText }]}>
                                        {t('forgotPassword')}
                                    </Text>
                                </TouchableOpacity>


                                <View style={styles.registerRow}>
                                    <View style={[styles.divider, { borderColor: colors.common.border }]}></View>
                                    <Text style={[styles.dontHaveAccountText, { color: aColors.linkSubtext }]}>
                                        {t('dontHaveAccount')}
                                    </Text>
                                    <View style={[styles.divider, { borderColor: colors.common.border }]}></View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.registerButton,
                                    { backgroundColor: aColors.mainContainerBg, borderColor: aColors.cardBorder },
                                    (isLoading) && styles.disabledButton]}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate("Register")}>
                                    <Text style={[styles.registerLinkText, { color: aColors.label }]}>
                                        {t('register')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.registerButton,
                                    { backgroundColor: aColors.mainContainerBg, borderColor: aColors.cardBorder },
                                    (isLoading) && styles.disabledButton]}
                                    activeOpacity={0.7}
                                    onPress={manageGuest}>
                                    <Text style={[styles.registerLinkText, { color: aColors.label }]}>
                                        {t('contAsGuest')}
                                    </Text>
                                    <AntDesign style={{ left: 30 }} name="right-circle" size={20} color={aColors.inputIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    divider: {
        flex: 1,
        borderWidth: 0.75,
        marginHorizontal: 5
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loginArea: {
        width: '88%',
        maxWidth: 420,
        borderWidth: 2,
        paddingHorizontal: 28,
        paddingVertical: 30,
        borderRadius: 24,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 5,
    },
    loginTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logo: {
        width: 54,
        height: 54,
    },
    loginTitle: {
        fontWeight: '900',
        fontSize: 30,
        letterSpacing: 0.5,
    },
    loginTitleSmall: {
        fontSize: 12.5,
        width: '80%',
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: 6,
        marginBottom: 24,
        lineHeight: 18,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    inputLabel: {
        fontWeight: '800',
        fontSize: 13.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        minHeight: 48,
    },
    textInput: {
        flex: 1,
        fontSize: 14.5,
        paddingVertical: 10,
    },
    passwordInput: {
        paddingRight: 8,
    },
    passwordToggle: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningText: {
        marginTop: 6,
        fontSize: 12,
        lineHeight: 16,
    },
    loginButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    registerButton: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        borderWidth: 1.5,
        flexDirection: "row",

    },
    disabledButton: {
        opacity: 0.55,
    },
    loginButtonText: {
        fontWeight: '800',
        fontSize: 15,
        letterSpacing: 0.3,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 8,
        paddingHorizontal: 2,
        marginTop: 4,
    },
    forgotPasswordText: {
        fontSize: 13,
        fontWeight: '700',
    },
    lottieLoading: {
        height: 20,
        width: 40,
        transform: [{ scale: 4 }],
    },
    registerRow: {
        flexDirection: 'row',
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    dontHaveAccountText: {
        fontSize: 13,
        fontWeight: '500',
    },
    registerLinkText: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: "center"
    },
});