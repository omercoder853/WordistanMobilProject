import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useGame } from "../../contextapis/GamesContext";
import GameSessionCard from "../profileComponents/GameSessionCard";
import GameSessionModal from "../profileComponents/GameSessionModal";
import gameSessionsStyle from "../profileStyle/gameSessionsStyle";

export default function GameSessions() {
    const { t } = useTranslation();
    const { gameSessions } = useGame();
    const [selectedSession, setSelectedSession] = useState(null);

    const sessions = gameSessions?.sessions || [];
    const bestId = gameSessions?.best_performance?.id;
    const totalGames = sessions.length;
    const bestScore = gameSessions?.best_performance?.score;

    // Empty state
    if (!sessions || sessions.length === 0) {
        return (
            <View style={gameSessionsStyle.container}>
                <View style={gameSessionsStyle.emptyContainer}>
                    <Ionicons name="game-controller-outline" size={56} color="#D1D5DB" />
                    <Text style={gameSessionsStyle.emptyTitle}>{t("noGameSessions")}</Text>
                    <Text style={gameSessionsStyle.emptyDesc}>{t("noGameSessionsDesc")}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={gameSessionsStyle.container}>
            {/* Summary badges */}
            <View style={gameSessionsStyle.summaryRow}>
                <View style={gameSessionsStyle.summaryBadge}>
                    <Text style={gameSessionsStyle.summaryValue}>{totalGames}</Text>
                    <Text style={gameSessionsStyle.summaryLabel}>{t("totalGames")}</Text>
                </View>
                <View style={gameSessionsStyle.summaryBadge}>
                    <Text style={[gameSessionsStyle.summaryValue, { color: "#6366F1" }]}>
                        {bestScore ? bestScore.toFixed(1) : "—"}
                    </Text>
                    <Text style={gameSessionsStyle.summaryLabel}>{t("bestPerformance")}</Text>
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
