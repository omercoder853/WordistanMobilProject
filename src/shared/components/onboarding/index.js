import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator, Alert, Animated, StyleSheet, Text, TouchableOpacity,
    View, useWindowDimensions, Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contextapis/ThemeContext";
import LogoImage from "../../assets/logo.png"
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";

const TOTAL_STEPS = 3;
const STEPS = [Step1, Step2, Step3];

export default function Onboarding({ onComplete }) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);
    const slideOpacity = useRef(new Animated.Value(1)).current;
    const slideOffset = useRef(new Animated.Value(0)).current;
    const dotProgress = useRef(
        Array.from({ length: TOTAL_STEPS }, (_, index) => new Animated.Value(index === 0 ? 1 : 0))
    ).current;
    const CurrentStep = STEPS[currentStep];

    useEffect(() => {
        const animation = Animated.parallel([
            Animated.timing(slideOpacity, {
                toValue: 1,
                duration: 260,
                useNativeDriver: true,
            }),
            Animated.spring(slideOffset, {
                toValue: 0,
                friction: 8,
                tension: 55,
                useNativeDriver: true,
            }),
            ...dotProgress.map((progress, index) => Animated.spring(progress, {
                toValue: index === currentStep ? 1 : 0,
                friction: 8,
                tension: 70,
                useNativeDriver: false,
            })),
        ]);

        slideOpacity.setValue(0);
        slideOffset.setValue(18);
        animation.start();

        return () => animation.stop();
    }, [currentStep, dotProgress, slideOffset, slideOpacity]);

    const handleContinue = async () => {
        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep((step) => step + 1);
            return;
        }

        setIsFinishing(true);
        const completed = await onComplete();
        if (!completed) {
            setIsFinishing(false);
            Alert.alert(t("error"), t("onboardingSaveFailed"));
        }
    };

    return (
        <SafeAreaView edges={["top", "bottom"]} style={[styles.container, { backgroundColor: colors.common.background }]}>
            <View style={styles.header}>
                <Image style={styles.logo} source={LogoImage} />
                <Text style={[styles.brand, { color: colors.common.primary }]}>{t("wordistan")}</Text>
            </View>

            <Animated.View
                style={[
                    styles.slide,
                    {
                        opacity: slideOpacity,
                        transform: [{ translateX: slideOffset }],
                    },
                ]}
            >
                <CurrentStep imageWidth={width - 40} imageHeight={Math.min(width - 40, height * 0.4)} />
            </Animated.View>

            <View style={styles.footer}>
                <View style={styles.progressRow}>
                    <View style={styles.dots}>
                        {dotProgress.map((progress, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        width: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [8, 24],
                                        }),
                                        backgroundColor: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [colors.common.borderSubtle, colors.common.primary],
                                        }),
                                    },
                                ]}
                            />
                        ))}
                    </View>
                    <Text style={[styles.stepCount, { color: colors.common.textSecondary }]}>
                        {t("stepOf", { current: currentStep + 1, total: TOTAL_STEPS })}
                    </Text>
                </View>

                <TouchableOpacity
                    accessibilityRole="button"
                    disabled={isFinishing}
                    activeOpacity={0.85}
                    onPress={handleContinue}
                    style={[styles.continueButton, { backgroundColor: colors.common.primary }]}
                >
                    {isFinishing ? (
                        <ActivityIndicator color={colors.common.white} />
                    ) : (
                        <>
                            <Text style={styles.continueLabel}>
                                {currentStep === TOTAL_STEPS - 1 ? t("finish") : t("next")}
                            </Text>
                            <Ionicons
                                name={currentStep === TOTAL_STEPS - 1 ? "checkmark" : "arrow-forward"}
                                size={20}
                                color={colors.common.white}
                            />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 12,
        alignItems: "center",
        alignSelf: "center"
    },
    logo: {
        width: 75,
        height: 75
    },
    brand: {
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: 0.3,
    },
    stepCount: {
        fontSize: 13,
        fontWeight: "600",
    },
    slide: {
        flex: 1,
        justifyContent: "center",
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginRight: 12,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    continueButton: {
        minHeight: 56,
        borderRadius: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    continueLabel: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
    },
});