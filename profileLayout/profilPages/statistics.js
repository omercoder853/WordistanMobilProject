import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, Animated, Easing, TouchableOpacity } from "react-native";
import { useUserStats } from "../../contextapis/UserStatsContext";
import { useGame } from "../../contextapis/GamesContext";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LineChart from "../profileComponents/LineChart";
import PieChart from "../profileComponents/PieChart";
import BarChart from "../profileComponents/BarChart";
import InfoTooltip from "../profileComponents/InfoTooltip";
import styles from "../profileStyle/statisticsStyle";

const FILTER_OPTIONS = [
    { key: 5, labelKey: "last5" },
    { key: 10, labelKey: "last10" },
    { key: 20, labelKey: "last20" },
    { key: 0, labelKey: "allGames" },
];

const METRIC_OPTIONS = [
    { key: "score", labelKey: "scoreMetric", color: "#6366F1" },
    { key: "performance_score", labelKey: "perfScoreMetric", color: "#EC4899" },
    { key: "correct_count", labelKey: "correctMetric", color: "#10B981" },
    { key: "duration_secs", labelKey: "durationMetric", color: "#F59E0B" },
];

export default function Statistics() {
    const { userStats, pendingEarnedXP } = useUserStats();
    const { gameSessions } = useGame();
    const { t } = useTranslation();

    const [filterCount, setFilterCount] = useState(5);
    const [selectedMetric, setSelectedMetric] = useState("score");

    // ─── Level progress calculations ───
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
        outputRange: ["0%", "100%"],
    });

    // ─── Game sessions data ───
    const sessions = gameSessions?.sessions || [];
    const totals = gameSessions?.totals || {};
    const avgScore = gameSessions?.average_score;
    const avgPerfScore = gameSessions?.average_performance_score;
    const gameModeCounts = gameSessions?.game_mode_counts || {};
    const hasSessions = sessions.length > 0;

    // ─── Filtered data for LineChart ───
    const filteredSessions = filterCount === 0
        ? [...sessions].reverse()
        : [...sessions.slice(0, Math.min(filterCount, sessions.length))].reverse();

    const metricConfig = METRIC_OPTIONS.find((m) => m.key === selectedMetric);
    const chartData = filteredSessions.map((s) => s[selectedMetric] || 0);
    const chartLabels = filteredSessions.map((s) => {
        const d = new Date(s.played_at);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    });

    // ─── PieChart data ───
    const pieData = [gameModeCounts.mp || 0, gameModeCounts.wc || 0, gameModeCounts.mcq || 0];
    const pieColors = ["#6366F1", "#EC4899", "#F59E0B"];
    const pieLabels = [t("matchingPairs"), t("wordCompletion"), t("multipleChoice")];

    // ─── BarChart data ───
    const barData = [totals.total || 0, totals.correct || 0, totals.wrong || 0, totals.passed || 0];
    const barColors = ["#6366F1", "#10B981", "#EF4444", "#F59E0B"];
    const barLabels = [t("totalQuestions"), t("correctAnswers"), t("wrongAnswers"), t("passedAnswers")];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* ─── Level Progress Card ─── */}
            <View style={styles.card}>
                <View style={styles.levelHeader}>
                    <View style={styles.levelBadge}>
                        <Ionicons name="star" size={14} color="#FFFFFF" />
                    </View>
                    <Text style={styles.levelTitle}>{t("level")} {level}</Text>
                    <Text style={styles.levelSubtitle}>{displayPercent}%</Text>
                </View>

                <View style={styles.progressTrack}>
                    <Animated.View style={[styles.progressFillContainer, { width: animatedWidth }]}>
                        <LinearGradient
                            colors={["#6366F1", "#EC4899"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.progressFill}
                        />
                    </Animated.View>
                </View>

                <View style={styles.xpRow}>
                    <Text style={styles.xpCurrent}>{earnedInLevel} / {required_xp_for_level} XP</Text>
                    <Text style={styles.xpTarget}>{remainingXP} XP {t("xpRemaining")}</Text>
                </View>

                <Text style={styles.xpHint}>
                    {t("level")} {level + 1} {t("xpFor")} {remainingXP} XP {t("xpRemaining")}
                </Text>
            </View>

            {/* ─── Average Score Badges ─── */}
            {hasSessions && (
                <View style={styles.avgRow}>
                    <View style={styles.avgBadge}>
                        <View style={styles.avgBadgeHeader}>
                            <Text style={styles.avgBadgeLabel}>{t("avgScore")}</Text>
                            <InfoTooltip text={t("scoreExplanation")} size={14} />
                        </View>
                        <Text style={styles.avgBadgeValue}>
                            {avgScore != null ? avgScore.toFixed(1) : "—"}
                        </Text>
                        <Text style={styles.avgBadgeSuffix}>/100</Text>
                    </View>
                    <View style={styles.avgBadge}>
                        <View style={styles.avgBadgeHeader}>
                            <Text style={styles.avgBadgeLabel}>{t("avgPerformance")}</Text>
                            <InfoTooltip text={t("performanceExplanation")} size={14} />
                        </View>
                        <Text style={[styles.avgBadgeValue, { color: "#EC4899" }]}>
                            {avgPerfScore != null ? avgPerfScore.toFixed(1) : "—"}
                        </Text>
                        <Text style={styles.avgBadgeSuffix}>/100</Text>
                    </View>
                </View>
            )}

            {/* ─── Empty state for charts ─── */}
            {!hasSessions && (
                <View style={styles.emptyContainer}>
                    <Ionicons name="bar-chart-outline" size={48} color="#D1D5DB" style={styles.emptyIcon} />
                    <Text style={styles.emptyTitle}>{t("noStatsYet")}</Text>
                    <Text style={styles.emptyDesc}>{t("noStatsYetDesc")}</Text>
                </View>
            )}

            {/* ─── LineChart: Score Progress ─── */}
            {hasSessions && (
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>{t("scoreProgress")}</Text>
                        <Text style={{ fontSize: 11, color: "#94A3B8" }}>
                            {filteredSessions.length} {t("games")}
                        </Text>
                    </View>

                    {/* Filter pills */}
                    <View style={styles.filterRow}>
                        {FILTER_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt.key}
                                style={[styles.filterPill, filterCount === opt.key && styles.filterPillActive]}
                                onPress={() => setFilterCount(opt.key)}
                            >
                                <Text
                                    style={[
                                        styles.filterPillText,
                                        filterCount === opt.key && styles.filterPillTextActive,
                                    ]}
                                >
                                    {t(opt.labelKey)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Metric tabs */}
                    <View style={styles.metricRow}>
                        {METRIC_OPTIONS.map((opt) => (
                            <TouchableOpacity
                                key={opt.key}
                                style={[styles.metricTab, selectedMetric === opt.key && styles.metricTabActive]}
                                onPress={() => setSelectedMetric(opt.key)}
                            >
                                <Text
                                    style={[
                                        styles.metricTabText,
                                        selectedMetric === opt.key && styles.metricTabTextActive,
                                    ]}
                                >
                                    {t(opt.labelKey)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <LineChart
                        data={chartData}
                        labels={chartLabels}
                        color={metricConfig?.color || "#6366F1"}
                    />
                </View>
            )}

            {/* ─── PieChart: Game Distribution ─── */}
            {hasSessions && (
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>{t("gameDistribution")}</Text>
                    </View>
                    <PieChart data={pieData} colors={pieColors} labels={pieLabels} />
                </View>
            )}

            {/* ─── BarChart: Question Stats ─── */}
            {hasSessions && (
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>{t("questionStats")}</Text>
                    </View>
                    <BarChart data={barData} labels={barLabels} colors={barColors} />
                </View>
            )}
        </ScrollView>
    );
}