import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from "react-native";
import { useGame } from "@/contextapis/GamesContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "@/contextapis/ThemeContext";

export default function FinishGame() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const router = useRoute();
    const { remainTime, totalTry } = router.params || {};
    const navigation = useNavigation();
    const { numberQuestion, userAnswers, gameType, saveGameSession, seconds } = useGame();

    const [loading, setLoading] = useState(false);

    let true_count = 0;
    let empty_count = 0;
    let success = 0;

    switch (gameType) {
        case "mcq":
            true_count = userAnswers.filter(answer => answer.userAnswer == answer.correctAnswer).length;
            empty_count = numberQuestion - userAnswers.length;
            success = Math.ceil(100 * true_count / numberQuestion);
            break;
        case "wc":
            true_count = userAnswers.filter(ans => ans.userAnswer.join('').toLocaleLowerCase('tr-TR') == ans.answer.toLocaleLowerCase('tr-TR')).length;
            empty_count = numberQuestion - userAnswers.length;
            success = Math.ceil(100 * true_count / numberQuestion);
            break;
        case "mp":
            true_count = userAnswers.length;
            empty_count = numberQuestion - true_count;
            success = Math.ceil(100 * (totalTry ? true_count / totalTry : 1));
            break;
        default:
            break;
    }
    const wrong_count = numberQuestion - empty_count - true_count;

    const metricsData = [
        {
            id: 'total',
            label: t('total') || 'Toplam',
            value: numberQuestion,
            icon: 'help-circle-outline',
            color: '#dc9f9f',
            bg: 'rgba(220, 159, 159, 0.12)'
        },
        {
            id: 'time',
            label: t('remTime') || 'Kalan Süre',
            value: `${remainTime} ${t('sec') || 'sn'}`,
            icon: 'time-outline',
            color: '#8B5CF6',
            bg: 'rgba(139, 92, 246, 0.12)'
        },
        {
            id: 'success',
            label: t('success') || 'Başarı',
            value: `%${success}`,
            icon: 'ribbon-outline',
            color: '#EC4899',
            bg: 'rgba(236, 72, 153, 0.12)'
        },
        {
            id: 'correct',
            label: t('correct') || 'Doğru',
            value: true_count,
            icon: 'checkmark-circle-outline',
            color: '#10B981',
            bg: 'rgba(16, 185, 129, 0.12)'
        },
        {
            id: 'wrong',
            label: t('wrong') || 'Yanlış',
            value: wrong_count,
            icon: 'close-circle-outline',
            color: '#EF4444',
            bg: 'rgba(239, 68, 68, 0.12)'
        },
        {
            id: 'empty',
            label: t('empty') || 'Boş',
            value: empty_count,
            icon: 'ellipse-outline',
            color: '#6B7280',
            bg: 'rgba(107, 114, 128, 0.12)'
        },
    ];

    const saveResults = async (target) => {
        setLoading(true)
        const sessionData = {
            game_mode: String(gameType),
            score: success,
            correct_count: true_count,
            wrong_count: wrong_count,
            total_count: numberQuestion,
            passed_count: empty_count,
            duration_secs: seconds * numberQuestion - remainTime
        }
        try {
            const res = await saveGameSession(sessionData);
            if (res) {
                console.log("Game results saved successfully");
            } else {
                console.log("Failed to save game results.");
            }
        } catch (error) {
            console.log("Error while saving game results : ", error);
        }
        setLoading(false);
        navigation.replace("MainTabs", { screen: target });
    };

    return (
        <>
            <SafeAreaView style={[finishStyles.safeArea, { backgroundColor: colors.common.background }]}>
                <ScrollView
                    contentContainerStyle={finishStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={finishStyles.headerContainer}>
                        <View style={[finishStyles.trophyWrapper, { backgroundColor: colors.games.cardBg, borderColor: colors.games.cardBorder, shadowColor: colors.games.cardShadow }]}>
                            <Ionicons name="trophy" size={42} color={colors.common.primary} />
                        </View>
                        <Text style={[finishStyles.titleText, { color: colors.games.textPrimary }]}>{t('gameCompleted') || "Oyun Tamamlandı!"}</Text>
                        <Text style={[finishStyles.subtitleText, { color: colors.games.textSecondary }]}>
                            {t('resultsSummary') || "Performans özetin aşağıda yer almaktadır"}
                        </Text>
                    </View>

                    {/* 6 Metrics Grid */}
                    <View style={finishStyles.gridContainer}>
                        {metricsData.map((item) => (
                            <View
                                key={item.id}
                                style={[
                                    finishStyles.card,
                                    {
                                        backgroundColor: colors.games.cardBg,
                                        borderColor: colors.games.cardBorder,
                                        shadowColor: item.color,
                                    }
                                ]}
                            >
                                <View style={[finishStyles.iconCircle, { backgroundColor: item.bg }]}>
                                    <Ionicons name={item.icon} size={22} color={item.color} />
                                </View>
                                <Text style={[finishStyles.cardValue, { color: colors.games.textPrimary }]}>{item.value}</Text>
                                <Text style={[finishStyles.cardLabel, { color: colors.games.textSecondary }]}>{item.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Action Buttons */}
                    <View style={finishStyles.buttonRow}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[finishStyles.actionButton, finishStyles.homeButton, { backgroundColor: isDark ? colors.common.surface : '#dc9f9f', shadowColor: isDark ? colors.common.shadow : '#dc9f9f' }]}
                            onPress={() => saveResults("Home")}
                        >
                            <Ionicons name="home-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={finishStyles.buttonText}>{t('home') || "Ana Sayfa"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[finishStyles.actionButton, finishStyles.newGameButton, { backgroundColor: colors.common.primary, shadowColor: colors.common.primary }]}
                            onPress={() => saveResults("Games")}
                        >
                            <Ionicons name="game-controller-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={finishStyles.buttonText}>{t('newGame') || "Yeni Oyun"}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal visible={loading} transparent animationType="fade" statusBarTranslucent={true}>
                <View style={{ flex: 1, backgroundColor: colors.games.modalOverlay, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 100, height: 100, backgroundColor: colors.games.modalBg, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.common.primary} />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const finishStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 28,
    },
    trophyWrapper: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#F5D7D7',
        shadowColor: '#dc9f9f',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    titleText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#27272A',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    subtitleText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#71717A',
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
        marginBottom: 32,
    },
    card: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#F3E8E8',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 6,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#18181B',
        marginBottom: 2,
    },
    cardLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#71717A',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 14,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    homeButton: {
        backgroundColor: '#dc9f9f',
        shadowColor: '#dc9f9f',
    },
    newGameButton: {
        backgroundColor: '#5B3FD3',
        shadowColor: '#5B3FD3',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});
