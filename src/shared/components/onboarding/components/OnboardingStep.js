import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function OnboardingStep({ image, imageWidth, imageHeight, titleKey, descriptionKey }) {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Image
                source={image}
                resizeMode="contain"
                style={{ width: imageWidth, height: imageHeight }}
            />
            <Text style={[styles.title, { color: colors.common.textPrimary }]}>
                {t(titleKey)}
            </Text>
            <Text style={[styles.description, { color: colors.common.textSecondary }]}>
                {t(descriptionKey)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        marginTop: 8,
        fontSize: 24,
        fontWeight: "800",
        textAlign: "center",
    },
    description: {
        marginTop: 10,
        maxWidth: 340,
        fontSize: 15,
        lineHeight: 23,
        textAlign: "center",
    },
});
