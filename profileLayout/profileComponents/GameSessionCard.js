import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import gameSessionsStyle from "../profileStyle/gameSessionsStyle";

const MODE_CONFIG = {
    mp: { icon: "link-outline", color: "#6366F1", bgColor: "#EEF2FF", labelKey: "matchingPairs" },
    wc: { icon: "create-outline", color: "#EC4899", bgColor: "#FDF2F8", labelKey: "wordCompletion" },
    mcq: { icon: "list-outline", color: "#F59E0B", bgColor: "#FFFBEB", labelKey: "multipleChoice" },
};

export default function GameSessionCard({ session, isBest, onPress }) {
    const { t } = useTranslation();
    const config = MODE_CONFIG[session.game_mode] || MODE_CONFIG.mcq;

    const date = new Date(session.played_at);
    const dateStr = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${date.getFullYear()}`;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[gameSessionsStyle.sessionCard, isBest && gameSessionsStyle.sessionCardBest]}
        >
            {/* Mode icon */}
            <View style={[gameSessionsStyle.modeIconBox, { backgroundColor: config.bgColor }]}>
                <Ionicons name={config.icon} size={22} color={config.color} />
            </View>

            {/* Middle: name + date */}
            <View style={gameSessionsStyle.sessionMiddle}>
                <Text style={gameSessionsStyle.sessionModeName}>{t(config.labelKey)}</Text>
                <Text style={gameSessionsStyle.sessionDate}>{dateStr}</Text>
            </View>

            {/* Right: score */}
            <View style={gameSessionsStyle.sessionRight}>
                <Text style={[gameSessionsStyle.sessionScore, isBest && gameSessionsStyle.sessionScoreBest]}>
                    {session.score.toFixed(1)}
                </Text>
                <Text style={gameSessionsStyle.sessionSubScore}>
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
