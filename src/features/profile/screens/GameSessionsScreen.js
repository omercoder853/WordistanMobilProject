import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useGame } from "@/contextapis/GamesContext";
import GameSessionCard from "../components/GameSessionCard";
import GameSessionModal from "../components/GameSessionModal";
import gameSessionsStyle from "../styles/GameSessionsScreenStyle";
import { useTheme } from "@/contextapis/ThemeContext";

export default function GameSessions() {
    const { t } = useTranslation();
    const { gameSessions } = useGame();
    const { colors, isDark } = useTheme();
    const [selectedSession, setSelectedSession] = useState(null);

    const sessions = gameSessions?.sessions || [];
    const bestId = gameSessions?.best_performance?.id;
    const totalGames = sessions.length;
    const bestScore = gameSessions?.best_performance?.score;

    // Empty state
    if (!sessions || sessions.length === 0) {
        return (
            <View style={[gameSessionsStyle.container, { backgroundColor: colors.common.background }]}>
                <View style={gameSessionsStyle.emptyContainer}>
                    <Ionicons name="game-controller-outline" size={56} color={colors.profile.textSecondary} />
                    <Text style={[gameSessionsStyle.emptyTitle, { color: colors.profile.textPrimary }]}>{t("noGameSessions")}</Text>
                    <Text style={[gameSessionsStyle.emptyDesc, { color: colors.profile.textSecondary }]}>{t("noGameSessionsDesc")}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[gameSessionsStyle.container, { backgroundColor: colors.common.background }]}>
            {/* Summary badges */}
            <View style={gameSessionsStyle.summaryRow}>
                <View style={[gameSessionsStyle.summaryBadge, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
                    <Text style={[gameSessionsStyle.summaryValue, { color: colors.profile.textPrimary }]}>{totalGames}</Text>
                    <Text style={[gameSessionsStyle.summaryLabel, { color: colors.profile.textSecondary }]}>{t("totalGames")}</Text>
                </View>
                <View style={[gameSessionsStyle.summaryBadge, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
                    <Text style={[gameSessionsStyle.summaryValue, { color: colors.common.primary }]}>
                        {bestScore ? bestScore.toFixed(1) : "—"}
                    </Text>
                    <Text style={[gameSessionsStyle.summaryLabel, { color: colors.profile.textSecondary }]}>{t("bestPerformance")}</Text>
                </View>
            </View>

            {/* Session list */}
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={gameSessionsStyle.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <GameSessionCard
                        session={item}
                        isBest={item.id === bestId}
                        onPress={() => setSelectedSession(item)}
                    />
                )}
            />

            {/* Detail modal */}
            <GameSessionModal
                session={selectedSession}
                isBest={selectedSession?.id === bestId}
                visible={!!selectedSession}
                onClose={() => setSelectedSession(null)}
            />
        </View>
    );
}
