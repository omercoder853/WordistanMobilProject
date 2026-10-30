import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";
import styles from "../styles/styles";

export default function Step4Verification({
    email,
    otpCode,
    setOtpCode,
    resendCountdown,
    resendLoading,
    onResend,
}) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const aColors = colors.auth;

    return (
        <View style={{ width: "100%" }}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
                <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.common.primarySubtle,
                    marginBottom: 14,
                }}>
                    <MaterialIcons name="mark-email-read" size={32} color={aColors.title} />
                </View>
                <Text style={[styles.titleText, { color: aColors.title, textAlign: "center", marginBottom: 8 }]}>
                    {t("stepVerificationTitle")}
                </Text>
                <Text style={{
                    color: aColors.subtitle,
                    fontSize: 13,
                    lineHeight: 19,
                    textAlign: "center",
                }}>
                    {t("verificationCodeInstructions")}
                </Text>
                <Text style={{
                    color: aColors.label,
                    fontSize: 14,
                    fontWeight: "700",
                    textAlign: "center",
                    marginTop: 6,
                }}>
                    {email}
                </Text>
            </View>

            <Text style={[styles.inputLabel, { color: aColors.label }]}>
                {t("verificationCodeLabel")}
            </Text>
            <TextInput
                accessibilityLabel={t("verificationCodeLabel")}
                autoComplete="one-time-code"
                autoFocus
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={(value) => setOtpCode(value.replace(/\D/g, ""))}
                placeholder="------"
                placeholderTextColor={aColors.placeholder}
                style={{
                    backgroundColor: aColors.inputBg,
                    borderColor: aColors.inputBorder,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    color: aColors.inputText,
                    fontSize: 25,
                    fontWeight: "800",
                    letterSpacing: 12,
                    marginTop: 8,
                    marginBottom: 18,
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                    textAlign: "center",
                }}
                textContentType="oneTimeCode"
                value={otpCode}
            />

            <View style={{ alignItems: "center" }}>
                <Text style={{ color: aColors.subtitle, fontSize: 12, marginBottom: 6 }}>
                    {t("didNotReceiveCode")}
                </Text>
                <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.7}
                    disabled={resendCountdown > 0 || resendLoading}
                    onPress={onResend}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 38,
                        paddingHorizontal: 12,
                        opacity: resendCountdown > 0 || resendLoading ? 0.55 : 1,
                    }}
                >
                    {resendLoading ? (
                        <ActivityIndicator size="small" color={aColors.linkText} />
                    ) : (
                        <Text style={{
                            color: aColors.linkText,
                            fontSize: 13,
                            fontWeight: "700",
                        }}>
                            {resendCountdown > 0
                                ? t("resendCodeCountdown", { seconds: resendCountdown })
                                : t("resendVerificationCode")}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
