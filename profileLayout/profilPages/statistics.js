import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useUserStats } from "../../contextapis/UserStatsContext";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Statistics() {
    const { userStats, pendingEarnedXP } = useUserStats();
    const { t } = useTranslation();

    const required_xp_for_level = userStats?.required_xp_for_level || 1;
    const xp_for_next = userStats?.xp_for_next || 0;
    const earnedInLevel = Math.max(0, required_xp_for_level - xp_for_next + (pendingEarnedXP || 0));
    const progressRatio = Math.min(Math.max(earnedInLevel / required_xp_for_level, 0), 1);
    const remainingXP = Math.max(0, xp_for_next - (pendingEarnedXP || 0));
    const level = userStats?.level || 1;

    const animatedProgress = useRef(new Animated.Value(0)).current;
    const [displayPercent, setDisplayPercent] = useState(0);

    useEffect(() => {
        const listenerId = animatedProgress.addListener(({ value }) => {
            setDisplayPercent(Math.round(value * 100));
        });

        Animated.timing(animatedProgress, {
            toValue: progressRatio,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();

        return () => {
            animatedProgress.removeListener(listenerId);
        };
    }, [progressRatio]);

    const animatedWidth = animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={statStyles.container}>
            {/* Level Progress Card */}
            <View style={statStyles.card}>
                {/* Level header row */}
                <View style={statStyles.levelHeader}>
                    <View style={statStyles.levelBadge}>
                        <Ionicons name="star" size={14} color="#FFFFFF" />
                    </View>
                    <Text style={statStyles.levelTitle}>{t("level")} {level}</Text>
                    <Text style={statStyles.levelSubtitle}>
                        {displayPercent}%
                    </Text>
                </View>

                {/* Progress bar */}
                <View style={statStyles.progressTrack}>
                    <Animated.View
                        style={[
                            statStyles.progressFillContainer,
                            { width: animatedWidth }
                        ]}
                    >
                        <LinearGradient
                            colors={['#6366F1', '#EC4899']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={statStyles.progressFill}
                        />
                    </Animated.View>
                </View>

                {/* XP info row */}
                <View style={statStyles.xpRow}>
                    <Text style={statStyles.xpCurrent}>
                        {earnedInLevel} / {required_xp_for_level} XP
                    </Text>
                    <Text style={statStyles.xpTarget}>
                        {remainingXP} XP {t("xpRemaining")}
                    </Text>
                </View>

                {/* Remaining XP hint */}
                <Text style={statStyles.xpHint}>
                    {t("level")} {level + 1} {t("xpFor")} {remainingXP} XP {t("xpRemaining")}
                </Text>
            </View>
        </View>
    );
}

const statStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 16,
        paddingHorizontal: 12,
        backgroundColor: '#FAFAFA',
    },
    card: {
        width: '95%',
        backgroundColor: 'rgba(248, 247, 255, 0.92)',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#EDE9FE',
        // Shadow
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    levelBadge: {
        backgroundColor: '#8B5CF6',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    levelTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E1B4B',
        flex: 1,
    },
    levelSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B5CF6',
    },
    progressTrack: {
        height: 10,
        backgroundColor: '#EDE9FE',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFillContainer: {
        height: '100%',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    xpCurrent: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366F1',
    },
    xpTarget: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
    },
    xpHint: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 6,
        fontStyle: 'italic',
    },
});