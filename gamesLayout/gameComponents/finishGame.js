import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Modal,ActivityIndicator } from "react-native";
import { useGame } from "../../contextapis/GamesContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabRouter, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {useState} from "react";

export default function FinishGame() {
    const { t } = useTranslation();
    const router = useRoute();
    const { remainTime, totalTry } = router.params || {};
    const navigation = useNavigation();
    const { numberQuestion, userAnswers, gameType , saveGameSession, seconds } = useGame();

    const [loading,setLoading] = useState(false);
    
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
            id: 'passed',
            label: t('passed') || 'Boş',
            value: empty_count,
            icon: 'remove-circle-outline',
            color: '#F59E0B',
            bg: 'rgba(245, 158, 11, 0.12)'
        },
    ];

    const saveResults = async(target) => {
        setLoading(true)
        const sessionData = {
            game_mode : String(gameType),
            score : success,
            correct_count : true_count,
            wrong_count : wrong_count,
            total_count : numberQuestion,
            passed_count : empty_count,
            duration_secs : seconds * numberQuestion - remainTime
        }
        try {
            const res = await saveGameSession(sessionData);
            if(res) {
                console.log("Game results saved successfully:", res);
            }
            else {
                console.log("Failed to save game results.");
            }
        }
        catch (error) {
            console.log("Error while saving game results : " , error)
        }
        setLoading(false)
        navigation.replace("MainTabs",{screen:target})
    }

    return (
        <>
        <LinearGradient
            colors={['#FFF8F8', '#FDF2F2', '#FAF0F0']}
            style={{ flex: 1 }}>
            <SafeAreaView style={finishStyles.safeArea}>
                <ScrollView
                    contentContainerStyle={finishStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={finishStyles.headerContainer}>
                        <View style={finishStyles.trophyWrapper}>
                            <Ionicons name="trophy" size={42} color="#dc9f9f" />
                        </View>
                        <Text style={finishStyles.titleText}>{t('gameCompleted') || "Oyun Tamamlandı!"}</Text>
                        <Text style={finishStyles.subtitleText}>
                            {t('resultsSummary') || "Performans özetin aşağıda yer almaktadır"}
                        </Text>
                    </View>

                    {/* 6 Metrics Grid */}
                    <View style={finishStyles.gridContainer}>
                        {metricsData.map((item) => (
                            <View key={item.id} style={[finishStyles.card, { shadowColor: item.color }]}>
                                <View style={[finishStyles.iconCircle, { backgroundColor: item.bg }]}>
                                    <Ionicons name={item.icon} size={22} color={item.color} />
                                </View>
                                <Text style={finishStyles.cardValue}>{item.value}</Text>
                                <Text style={finishStyles.cardLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Action Buttons */}
                    <View style={finishStyles.buttonRow}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[finishStyles.actionButton, finishStyles.homeButton]}
                            onPress={() => saveResults("Home")}
                        >
                            <Ionicons name="home-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={finishStyles.buttonText}>{t('home') || "Ana Sayfa"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[finishStyles.actionButton, finishStyles.newGameButton]}
                            onPress={() => saveResults("Games")}
                        >
                            <Ionicons name="game-controller-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={finishStyles.buttonText}>{t('newGame') || "Yeni Oyun"}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>

        <Modal visible={loading} transparent animationType="fade">
            <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:100,height:100,backgroundColor:'white',borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#0000ff" />
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
