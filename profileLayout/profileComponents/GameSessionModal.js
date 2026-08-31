import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import InfoTooltip from "./InfoTooltip";
import gameSessionsStyle from "../profileStyle/gameSessionsStyle";

const MODE_CONFIG = {
    mp: { icon: "link-outline", color: "#6366F1", labelKey: "matchingPairs" },
    wc: { icon: "create-outline", color: "#EC4899", labelKey: "wordCompletion" },
    mcq: { icon: "list-outline", color: "#F59E0B", labelKey: "multipleChoice" },
};

function ScoreRing({ value, maxValue = 100, size = 80, color, label }) {
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
                    stroke="#EDE9FE"
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
                    fill="#1E1B4B"
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
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity
                style={gameSessionsStyle.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} style={gameSessionsStyle.modalContent}>
                    <View style={gameSessionsStyle.modalHandle} />

                    {/* Header */}
                    <View style={gameSessionsStyle.modalHeader}>
                        <View>
                            <Text style={gameSessionsStyle.modalTitle}>{t("sessionDetails")}</Text>
                            <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{dateStr}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                                <Ionicons name={config.icon} size={14} color={config.color} />
                                <Text style={{ fontSize: 13, fontWeight: "600", color: config.color }}>
                                    {t(config.labelKey)}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={gameSessionsStyle.modalCloseBtn}>
                            <Ionicons name="close" size={24} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Best performance banner */}
                        {isBest && (
                            <View style={gameSessionsStyle.bestBanner}>
                                <Ionicons name="trophy" size={18} color="#D97706" />
                                <Text style={gameSessionsStyle.bestBannerText}>
                                    {t("bestPerformance")} 🏆
                                </Text>
                            </View>
                        )}

                        {/* Score circles */}
                        <View style={gameSessionsStyle.scoresRow}>
                            <View style={{ alignItems: "center" }}>
                                <ScoreRing
                                    value={session.score}
                                    color="#6366F1"
                                />
                                <View style={gameSessionsStyle.scoreCircleLabel}>
                                    <Text style={gameSessionsStyle.scoreCircleLabelText}>
                                        {t("scoreLabel")}
                                    </Text>
                                    <InfoTooltip text={t("scoreExplanation")} size={14} />
                                </View>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <ScoreRing
                                    value={session.performance_score}
                                    color="#EC4899"
                                />
                                <View style={gameSessionsStyle.scoreCircleLabel}>
                                    <Text style={gameSessionsStyle.scoreCircleLabelText}>
                                        {t("performanceScoreLabel")}
                                    </Text>
                                    <InfoTooltip text={t("performanceExplanation")} size={14} />
                                </View>
                            </View>
                        </View>

                        {/* Stats grid */}
                        <View style={gameSessionsStyle.statsGrid}>
                            {stats.map((stat, i) => (
                                <View key={i} style={gameSessionsStyle.statItem}>
                                    <Text style={[gameSessionsStyle.statItemValue, { color: stat.color }]}>
                                        {stat.value}
                                    </Text>
                                    <Text style={gameSessionsStyle.statItemLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
