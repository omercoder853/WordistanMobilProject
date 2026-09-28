import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles";
import { FontAwesome, FontAwesome6, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useUserStats } from "@/contextapis/UserStatsContext";
import { useAchievements } from "@/contextapis/AchievementsContext";
import { useTheme } from "@/contextapis/ThemeContext";

export default function ProfileStatsRow() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const { earnedAchievementsList } = useAchievements();
    const { userStats } = useUserStats();

    const translated_words = userStats?.translated_words || 0;
    const saved_words = userStats?.saved_words || 0;
    const badgesCount = earnedAchievementsList?.length || 0;

    return (
        <View style={[
            styles.statsCard, 
            { 
                backgroundColor: colors.profile.cardBg, 
                borderColor: colors.profile.cardBorder,
            }
        ]}>
            {/* 1. Çevrilen / Aramalar */}
            <View style={styles.statColumn}>
                <View style={[styles.statIconBox, { backgroundColor: isDark ? "rgba(99, 102, 241, 0.20)" : "rgba(99, 102, 241, 0.10)" }]}>
                    <Feather name="search" size={17} color={isDark ? "#818CF8" : "#6366F1"} />
                </View>
                <Text style={[styles.statValue, { color: colors.profile.textPrimary }]}>
                    {translated_words}
                </Text>
                <Text style={[styles.statLabel, { color: colors.profile.textSecondary }]}>
                    {t("lookups")}
                </Text>
            </View>

            {/* Dikey Çizgi */}
            <View style={[styles.statDivider, { backgroundColor: colors.profile.separator }]} />

            {/* 2. Kaydedilen Kelimeler */}
            <View style={styles.statColumn}>
                <View style={[styles.statIconBox, { backgroundColor: isDark ? "rgba(236, 72, 153, 0.20)" : "rgba(236, 72, 153, 0.10)" }]}>
                    <FontAwesome name="bookmark" size={16} color={isDark ? "#F472B6" : "#EC4899"} />
                </View>
                <Text style={[styles.statValue, { color: colors.profile.textPrimary }]}>
                    {saved_words}
                </Text>
                <Text style={[styles.statLabel, { color: colors.profile.textSecondary }]}>
                    {t("saved")}
                </Text>
            </View>

            {/* Dikey Çizgi */}
            <View style={[styles.statDivider, { backgroundColor: colors.profile.separator }]} />

            {/* 3. Kazanılan Rozetler */}
            <View style={styles.statColumn}>
                <View style={[styles.statIconBox, { backgroundColor: isDark ? "rgba(245, 158, 11, 0.20)" : "rgba(245, 158, 11, 0.10)" }]}>
                    <FontAwesome6 name="award" size={16} color={isDark ? "#FBBF24" : "#F59E0B"} />
                </View>
                <Text style={[styles.statValue, { color: colors.profile.textPrimary }]}>
                    {badgesCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.profile.textSecondary }]}>
                    {t("badges")}
                </Text>
            </View>
        </View>
    );
}