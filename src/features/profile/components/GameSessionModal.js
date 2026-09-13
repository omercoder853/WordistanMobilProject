import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import InfoTooltip from "@/shared/components/InfoTooltip";
import gameSessionsStyle from "../styles/GameSessionsScreenStyle";
import { useTheme } from "@/contextapis/ThemeContext";

const MODE_CONFIG = {
    mp: { icon: "link-outline", color: "#6366F1", labelKey: "matchingPairs" },
    wc: { icon: "create-outline", color: "#EC4899", labelKey: "wordCompletion" },
    mcq: { icon: "list-outline", color: "#F59E0B", labelKey: "multipleChoice" },
};

function ScoreRing({ value, maxValue = 100, size = 80, color, label, textColor = "#1E1B4B", trackColor = "#EDE9FE" }) {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(value / maxValue, 1);
    const offset = circumference * (1 - progress);

    return (
        <View style={gameSessionsStyle.scoreCircle}>
            <Svg width={size} height={size}>
                {/* Track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
                {/* Value */}
                <SvgText
                    x={size / 2}
                    y={size / 2 + 5}
                    fontSize={16}
                    fontWeight="700"
                    fill={textColor}
                    textAnchor="middle"
                >
                    {value.toFixed(1)}
                </SvgText>
            </Svg>
        </View>
    );
}

export default function GameSessionModal({ session, isBest, visible, onClose }) {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    if (!session) return null;

    const config = MODE_CONFIG[session.game_mode] || MODE_CONFIG.mcq;
    const date = new Date(session.played_at);
    const dateStr = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${date.getFullYear()}`;

    const secPerQuestion = session.total_count > 0
        ? (session.duration_secs / session.total_count).toFixed(1)
        : "—";

    const stats = [
        { label: t("correct"), value: session.correct_count, color: "#10B981" },
        { label: t("wrong"), value: session.wrong_count, color: "#EF4444" },
        { label: t("passed"), value: session.passed_count, color: "#F59E0B" },
        { label: t("total"), value: session.total_count, color: "#6366F1" },
        { label: t("duration"), value: `${session.duration_secs}${t("seconds")}`, color: "#8B5CF6" },
        { label: `${t("seconds")}/${t("questions")}`, value: secPerQuestion, color: "#0EA5E9" },
    ];

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
            <TouchableOpacity
                style={gameSessionsStyle.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} style={[gameSessionsStyle.modalContent, { backgroundColor: isDark ? colors.common.card : "#FFFFFF" }]}>
                    <View style={gameSessionsStyle.modalHandle} />

                    {/* Header */}
                    <View style={gameSessionsStyle.modalHeader}>
                        <Text style={[gameSessionsStyle.modalTitle, { color: colors.profile.textPrimary }]}>
                            {t(config.labelKey)} — {t("sessionDetails")}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={gameSessionsStyle.modalCloseBtn}>
                            <Ionicons name="close" size={22} color={colors.profile.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Best performance banner */}
                        {isBest && (
                            <View style={gameSessionsStyle.bestBanner}>
                                <Ionicons name="trophy" size={18} color="#D97706" />
                                <Text style={gameSessionsStyle.bestBannerText}>
                                    {t("bestPerformanceBanner")}
                                </Text>
                            </View>
                        )}

                        {/* Dual Score Rings */}
                        <View style={gameSessionsStyle.scoresRow}>
                            <View style={gameSessionsStyle.scoreCircle}>
                                <ScoreRing
                                    value={session.score}
                                    maxValue={100}
                                    color={config.color}
                                    textColor={colors.profile.textPrimary}
                                    trackColor={isDark ? colors.common.surface : "#EDE9FE"}
                                />
                                <View style={gameSessionsStyle.scoreCircleLabel}>
                                    <Text style={[gameSessionsStyle.scoreCircleLabelText, { color: colors.profile.textSecondary }]}>
                                        {t("successRate")}
                                    </Text>
                                    <InfoTooltip text={t("successRateTooltip")} />
                                </View>
                            </View>

                            <View style={gameSessionsStyle.scoreCircle}>
                                <ScoreRing
                                    value={session.performance_score}
                                    maxValue={100}
                                    color="#10B981"
                                    textColor={colors.profile.textPrimary}
                                    trackColor={isDark ? colors.common.surface : "#EDE9FE"}
                                />
                                <View style={gameSessionsStyle.scoreCircleLabel}>
                                    <Text style={[gameSessionsStyle.scoreCircleLabelText, { color: colors.profile.textSecondary }]}>
                                        {t("performanceScore")}
                                    </Text>
                                    <InfoTooltip text={t("performanceScoreTooltip")} />
                                </View>
                            </View>
                        </View>

                        {/* Stats Grid */}
                        <View style={gameSessionsStyle.statsGrid}>
                            {stats.map((item, i) => (
                                <View key={i} style={[gameSessionsStyle.statItem, { backgroundColor: isDark ? colors.common.surface : '#F8F9FB' }]}>
                                    <Text style={[gameSessionsStyle.statItemValue, { color: item.color || colors.profile.textPrimary }]}>
                                        {item.value}
                                    </Text>
                                    <Text style={[gameSessionsStyle.statItemLabel, { color: colors.profile.textSecondary }]}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
