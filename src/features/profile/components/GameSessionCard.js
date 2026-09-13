import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import gameSessionsStyle from "../styles/GameSessionsScreenStyle";
import { useTheme } from "@/contextapis/ThemeContext";

const MODE_CONFIG = {
    mp: { icon: "link-outline", color: "#6366F1", bgColor: "#EEF2FF", labelKey: "matchingPairs" },
    wc: { icon: "create-outline", color: "#EC4899", bgColor: "#FDF2F8", labelKey: "wordCompletion" },
    mcq: { icon: "list-outline", color: "#F59E0B", bgColor: "#FFFBEB", labelKey: "multipleChoice" },
};

export default function GameSessionCard({ session, isBest, onPress }) {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const config = MODE_CONFIG[session.game_mode] || MODE_CONFIG.mcq;

    const date = new Date(session.played_at);
    const dateStr = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${date.getFullYear()}`;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                gameSessionsStyle.sessionCard,
                { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder },
                isBest && (isDark ? { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#FCD34D' } : gameSessionsStyle.sessionCardBest)
            ]}
        >
            {/* Mode icon */}
            <View style={[gameSessionsStyle.modeIconBox, { backgroundColor: isDark ? colors.common.surface : config.bgColor }]}>
                <Ionicons name={config.icon} size={22} color={config.color} />
            </View>

            {/* Middle: name + date */}
            <View style={gameSessionsStyle.sessionMiddle}>
                <Text style={[gameSessionsStyle.sessionModeName, { color: colors.profile.textPrimary }]}>{t(config.labelKey)}</Text>
                <Text style={[gameSessionsStyle.sessionDate, { color: colors.profile.textSecondary }]}>{dateStr}</Text>
            </View>

            {/* Right: score */}
            <View style={gameSessionsStyle.sessionRight}>
                <Text style={[gameSessionsStyle.sessionScore, { color: colors.common.primary }, isBest && gameSessionsStyle.sessionScoreBest]}>
                    {session.score.toFixed(1)}
                </Text>
                <Text style={[gameSessionsStyle.sessionSubScore, { color: colors.profile.textSecondary }]}>
                    {session.correct_count}/{session.total_count}
                </Text>
                {isBest && (
                    <View style={gameSessionsStyle.bestBadge}>
                        <Ionicons name="trophy" size={10} color="#D97706" />
                        <Text style={gameSessionsStyle.bestBadgeText}>{t("bestPerformance")}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
