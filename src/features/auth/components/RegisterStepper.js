import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function RegisterStepper({ currentStepIndex = 0, totalSteps = 3, isCurrentValid = false, hasError = false }) {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const aColors = colors.auth;

    // Renk paleti
    const successColor = isDark ? "#34D399" : "#10B981";
    const errorColor = aColors.errorText || (isDark ? "#F87171" : "#EF4444");
    const activeThemeColor = aColors.chipActiveBg || (isDark ? "#C084FC" : "#B565F5");
    const inactiveBorderColor = isDark ? "#2A2B36" : "#E2E8F0";
    const inactiveTextColor = isDark ? "#64748B" : "#94A3B8";

    // Adım başlıkları
    const stepTitles = [
        t("stepPersonalInfo"),
        t("stepPreferences"),
        t("stepAccount"),
        t("stepVerification"),
    ];

    // Animasyon değerleri: Daireler için spring scale animasyonu
    const scaleAnim0 = useRef(new Animated.Value(1)).current;
    const scaleAnim1 = useRef(new Animated.Value(1)).current;
    const scaleAnim2 = useRef(new Animated.Value(1)).current;
    const scaleAnim3 = useRef(new Animated.Value(1)).current;
    const scaleAnims = [scaleAnim0, scaleAnim1, scaleAnim2, scaleAnim3];

    // Çizgi dolma animasyonu: 0->1 ve 1->2 arası çizgilerin akıcı dolması
    const lineAnim0 = useRef(new Animated.Value(currentStepIndex > 0 ? 1 : 0)).current;
    const lineAnim1 = useRef(new Animated.Value(currentStepIndex > 1 ? 1 : 0)).current;
    const lineAnim2 = useRef(new Animated.Value(currentStepIndex > 2 ? 1 : 0)).current;
    const lineAnims = [lineAnim0, lineAnim1, lineAnim2];

    // Adım değiştikçe çizgilerin dolma/boşalma animasyonu
    useEffect(() => {
        lineAnims.forEach((animation, index) => {
            Animated.timing(animation, {
                toValue: currentStepIndex > index ? 1 : 0,
                duration: 350,
                useNativeDriver: false,
            }).start();
        });
    }, [currentStepIndex, lineAnim0, lineAnim1, lineAnim2]);

    // Daire mikro-animasyonu
    useEffect(() => {
        const targetAnim = scaleAnims[currentStepIndex];
        if (targetAnim) {
            Animated.sequence([
                Animated.timing(targetAnim, {
                    toValue: 1.18,
                    duration: 160,
                    useNativeDriver: true,
                }),
                Animated.spring(targetAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 50,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [currentStepIndex, isCurrentValid, hasError]);

    return (
        <View style={stepperStyles.container}>
            {/* Üst Bilgi: Adım X / Y ve Mevcut Adım İsmi */}
            <View style={stepperStyles.headerRow}>
                <Text style={[stepperStyles.stepCountText, { color: activeThemeColor }]}>
                    {t("stepOf", { current: currentStepIndex + 1, total: totalSteps })}
                </Text>
                <View style={[stepperStyles.badge, { backgroundColor: isDark ? "rgba(192, 132, 252, 0.12)" : "rgba(181, 101, 245, 0.12)" }]}>
                    <Text style={[stepperStyles.stepTitleText, { color: isDark ? "#F8FAFC" : "#1E293B" }]}>
                        {stepTitles[currentStepIndex] || ""}
                    </Text>
                </View>
            </View>

            {/* Stepper Daireleri ve Çizgileri */}
            <View style={stepperStyles.stepperRow}>
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive = index === currentStepIndex;
                    const isUpcoming = index > currentStepIndex;

                    // Aktif adımın renk durumu: geçerli ise yeşil, hatalı ise kırmızı, normalde tema rengi
                    let activeBorder = activeThemeColor;
                    let activeBg = isDark ? "#18181C" : "#FFFFFF";
                    let activeText = activeThemeColor;

                    if (isActive) {
                        if (isCurrentValid) {
                            activeBorder = successColor;
                            activeBg = isDark ? "rgba(52, 211, 153, 0.15)" : "rgba(16, 185, 129, 0.12)";
                            activeText = successColor;
                        } else if (hasError) {
                            activeBorder = errorColor;
                            activeBg = isDark ? "rgba(248, 113, 113, 0.12)" : "rgba(239, 68, 68, 0.08)";
                            activeText = errorColor;
                        }
                    }

                    return (
                        <React.Fragment key={index}>
                            {/* Daire */}
                            <Animated.View
                                style={[
                                    stepperStyles.circle,
                                    {
                                        transform: [{ scale: scaleAnims[index] }],
                                    },
                                    isCompleted && {
                                        backgroundColor: successColor,
                                        borderColor: successColor,
                                        borderWidth: 2,
                                    },
                                    isActive && {
                                        backgroundColor: activeBg,
                                        borderColor: activeBorder,
                                        borderWidth: 2,
                                    },
                                    isUpcoming && {
                                        backgroundColor: isDark ? "#18181C" : aColors.inputBg,
                                        borderColor: inactiveBorderColor,
                                        borderWidth: 1.5,
                                    },
                                ]}
                            >
                                {isCompleted ? (
                                    <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                                ) : (
                                    <Text
                                        style={[
                                            stepperStyles.circleText,
                                            {
                                                color: isActive ? activeText : inactiveTextColor,
                                                fontWeight: isActive ? "800" : "600",
                                            },
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>
                                )}
                            </Animated.View>

                            {/* Akıcı İlerleyen Bağlantı Çizgisi */}
                            {index < totalSteps - 1 && (
                                <View
                                    style={[
                                        stepperStyles.lineContainer,
                                        { backgroundColor: inactiveBorderColor },
                                    ]}
                                >
                                    <Animated.View
                                        style={[
                                            stepperStyles.lineFill,
                                            {
                                                backgroundColor: successColor,
                                                width: lineAnims[index].interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ["0%", "100%"],
                                                }),
                                            },
                                        ]}
                                    />
                                </View>
                            )}
                        </React.Fragment>
                    );
                })}
            </View>
        </View>
    );
}

const stepperStyles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 6,
        marginBottom: 10,
        marginTop: 2,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    stepCountText: {
        fontSize: 12.5,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    stepTitleText: {
        fontSize: 12,
        fontWeight: "600",
    },
    stepperRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 4,
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "transparent",
        overflow: "hidden",
    },
    circleText: {
        fontSize: 13,
    },
    lineContainer: {
        flex: 1,
        height: 3.5,
        borderRadius: 2,
        marginHorizontal: 8,
        overflow: "hidden",
    },
    lineFill: {
        height: "100%",
        borderRadius: 2,
    },
});
