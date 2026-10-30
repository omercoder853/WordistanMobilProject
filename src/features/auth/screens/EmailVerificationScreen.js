import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contextapis/AuthContext";
import { useTheme } from "@/contextapis/ThemeContext";
import useTimer from "@/hooks/useTimer";
import Step4Verification from "../components/Step4Verification";

export default function EmailVerificationScreen() {
    const navigation = useNavigation();
    const { params } = useRoute();
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const aColors = colors.auth;
    const { verifyOTP, resendOTP } = useAuth();
    const email = params?.email || "";
    const { timer, timeLeft } = useTimer();
    const [otpCode, setOtpCode] = useState("");
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const initialRequestRef = useRef(false);

    useEffect(() => {
        if (!email || initialRequestRef.current) return;
        initialRequestRef.current = true;

        const requestCode = async () => {
            setResendLoading(true);
            try {
                const ok = await resendOTP(email);
                if (ok) {
                    timer.set(60);
                    timer.start();
                }
            } catch (error) {
                console.error("❌ Email Verification Screen : Initial OTP resend failed:", error);
            } finally {
                setResendLoading(false);
            }
        };

        requestCode();
    }, [email]);

    const handleVerify = async () => {
        if (!/^\d{6}$/.test(otpCode) || verifyLoading) return;
        setVerifyLoading(true);
        try {
            await verifyOTP(email, otpCode);
        } catch (error) {
            console.error("❌ Email Verification Screen : OTP verification failed:", error);
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email || timeLeft > 0 || resendLoading) return;
        setResendLoading(true);
        try {
            const ok = await resendOTP(email);
            if (ok) {
                timer.set(60);
                timer.start();
            }
        } catch (error) {
            console.error("❌ Email Verification Screen : OTP resend failed:", error);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: aColors.background }}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={aColors.background}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center", padding: 24 }}
            >
                <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => navigation.goBack()}
                    style={{
                        position: "absolute",
                        top: 12,
                        left: 20,
                        zIndex: 1,
                        width: 44,
                        height: 44,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: aColors.cardBg,
                        borderColor: aColors.cardBorder,
                        borderWidth: 1,
                        borderRadius: 14,
                    }}
                >
                    <MaterialIcons name="arrow-back" size={22} color={aColors.inputIcon} />
                </TouchableOpacity>

                <View style={{
                    width: "100%",
                    maxWidth: 440,
                    alignSelf: "center",
                    backgroundColor: aColors.cardBg,
                    borderColor: aColors.cardBorder,
                    borderWidth: 1.5,
                    borderRadius: 24,
                    padding: 24,
                    shadowColor: aColors.cardShadow,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.12,
                    shadowRadius: 16,
                    elevation: 5,
                }}>
                    {!email ? (
                        <Text style={{ color: aColors.errorText, textAlign: "center" }}>
                            {t("emailVerificationUnavailable")}
                        </Text>
                    ) : (
                        <>
                            <Step4Verification
                                email={email}
                                otpCode={otpCode}
                                setOtpCode={setOtpCode}
                                resendCountdown={timeLeft}
                                resendLoading={resendLoading}
                                onResend={handleResend}
                            />
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                disabled={!/^\d{6}$/.test(otpCode) || verifyLoading}
                                onPress={handleVerify}
                                style={{
                                    minHeight: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 20,
                                    borderRadius: 12,
                                    backgroundColor: aColors.primaryButtonBg,
                                    opacity: !/^\d{6}$/.test(otpCode) || verifyLoading ? 0.55 : 1,
                                }}
                            >
                                {verifyLoading ? (
                                    <ActivityIndicator color={aColors.primaryButtonText} />
                                ) : (
                                    <Text style={{
                                        color: aColors.primaryButtonText,
                                        fontSize: 15,
                                        fontWeight: "800",
                                    }}>
                                        {t("verifyEmail")}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
