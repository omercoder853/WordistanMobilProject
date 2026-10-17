import React, { useState, useRef, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Animated, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contextapis/AuthContext";
import { useTheme } from "@/contextapis/ThemeContext";
import styles from "../styles/styles";

import LogoArea from "../components/RegisterHeader";
import RegisterStepper from "../components/RegisterStepper";
import NavigationButtons from "../components/NavigationButtons";
import Step1Personal from "../components/Step1Personal";
import Step2Preferences from "../components/Step2Preferences";
import Step3Account from "../components/Step3Account";

export default function RegisterScreen() {
    const navigation = useNavigation();
    const { colors, isDark } = useTheme();
    const aColors = colors.auth;
    const { registerData, register, appLanguage, changeAppLanguage } = useAuth();

    // Adım Yönetimi (0: Kişisel, 1: Tercihler, 2: Hesap)
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Başlangıç tarihi
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 12);

    // Birleşik Form Verisi
    const [formData, setFormData] = useState({
        first_name: registerData["first_name"] || "",
        last_name: registerData["last_name"] || "",
        birth_date: registerData["birth_date"] || maxDate.toISOString().split("T")[0],
        gender: registerData["gender"] || null,
        nick_name: registerData["nick_name"] || "",
        avatar_url: registerData["avatar_url"] || "avatar_1",
        language: appLanguage || "en",
        email: "",
        password: "",
        password_confirm: "",
    });

    const updateFormField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Geçiş Animasyonu: Fade ve Slide
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const animateTransition = (direction, callback) => {
        const slideOut = direction === "next" ? -25 : 25;
        const slideIn = direction === "next" ? 25 : -25;

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: slideOut,
                duration: 120,
                useNativeDriver: true,
            }),
        ]).start(() => {
            callback();
            slideAnim.setValue(slideIn);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 6,
                    tension: 50,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    // Validasyon Mantıkları
    // Adım 1 Validasyonu
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ]{3,}(\s[a-zA-ZğüşıöçĞÜŞİÖÇ]{2,})*$/;
    const validName = nameRegex.test((formData.first_name || "").trim());
    const validSurname = nameRegex.test((formData.last_name || "").trim());
    const step0Valid = validName && validSurname && !!formData.birth_date && !!formData.gender;
    const step0Error = (!validName && formData.first_name.length > 0) || (!validSurname && formData.last_name.length > 0);

    // Adım 2 Validasyonu
    const usernameValid = (formData.nick_name || "").length >= 4;
    const step1Valid = usernameValid && !!formData.language;
    const step1Error = formData.nick_name.length > 0 && !usernameValid;

    // Adım 3 Validasyonu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;
    const validEmail = emailRegex.test((formData.email || "").trim());
    const validPassword = passwordRegex.test((formData.password || "").trim());
    const validPasswordConfirm = validPassword && formData.password.trim() === (formData.password_confirm || "").trim();
    const step2Valid = validEmail && validPassword && validPasswordConfirm;
    const step2Error = (!validEmail && formData.email.length > 0) ||
        (!validPassword && formData.password.length > 0) ||
        (!validPasswordConfirm && formData.password_confirm.length > 0);

    // Mevcut adımın geçerlilik ve hata durumları
    let isCurrentValid = false;
    let hasActiveError = false;

    if (currentStep === 0) {
        isCurrentValid = step0Valid;
        hasActiveError = step0Error;
    } else if (currentStep === 1) {
        isCurrentValid = step1Valid;
        hasActiveError = step1Error;
    } else if (currentStep === 2) {
        isCurrentValid = step2Valid;
        hasActiveError = step2Error;
    }

    // Android Geri Tuşu Yönetimi
    useEffect(() => {
        const onBackPress = () => {
            if (currentStep > 0) {
                handleBack();
                return true;
            }
            navigation.navigate("Login");
            return true;
        };

        const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => subscription.remove();
    }, [currentStep]);

    // Navigasyon Aksiyonları
    const handleBack = () => {
        if (currentStep > 0) {
            animateTransition("back", () => setCurrentStep((prev) => prev - 1));
        } else {
            navigation.navigate("Login");
        }
    };

    const handleNext = () => {
        if (currentStep < 2) {
            animateTransition("next", () => setCurrentStep((prev) => prev + 1));
        } else {
            handleRegister();
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        const payload = {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            birth_date: formData.birth_date,
            gender: formData.gender,
            nick_name: formData.nick_name.trim(),
            avatar_url: formData.avatar_url,
            email: formData.email.trim(),
            password: formData.password.trim(),
            password_confirm: formData.password_confirm.trim(),
        };
        await register(payload);
        setLoading(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.auth.background }}>
            <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.auth.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 20 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={[styles.mainContainer, { backgroundColor: aColors.cardBg, borderColor: aColors.cardBorder }]}>
                            {/* Sabit Logo */}
                            <LogoArea />

                            {/* Dinamik Form Alanı (Yumuşak Slide & Fade Animasyonuyla) */}
                            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
                                {currentStep === 0 && (
                                    <Step1Personal
                                        formData={formData}
                                        updateFormField={updateFormField}
                                    />
                                )}
                                {currentStep === 1 && (
                                    <Step2Preferences
                                        formData={formData}
                                        updateFormField={updateFormField}
                                        changeAppLanguage={changeAppLanguage}
                                    />
                                )}
                                {currentStep === 2 && (
                                    <Step3Account
                                        formData={formData}
                                        updateFormField={updateFormField}
                                    />
                                )}
                            </Animated.View>

                            {/* Sabit Stepper (Adımlar değiştikçe çizgi ve daire animasyonlarıyla akar) */}
                            <RegisterStepper
                                currentStepIndex={currentStep}
                                totalSteps={3}
                                isCurrentValid={isCurrentValid}
                                hasError={hasActiveError}
                            />

                            {/* Sabit Butonlar */}
                            <NavigationButtons
                                isFirst={currentStep === 0}
                                isLast={currentStep === 2}
                                onBack={handleBack}
                                onNext={handleNext}
                                disabled={!isCurrentValid}
                                loading={loading}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}