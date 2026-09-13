import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Vibration, StyleSheet } from "react-native";
import { useGame } from "@/contextapis/GamesContext";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@/contextapis/ThemeContext";

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuizOption({ option, correctIndex, index, currentQuestion }) {
    const { userAnswers, setUserAnswers } = useGame();
    const [isVibrate, setVibrate] = useState(true);
    const { colors, isDark } = useTheme();

    useEffect(() => {
        const loadVibration = async () => {
            const val = await storage.get(STORAGE_KEYS.PREFERENCES.VIBRATION_PREF);
            setVibrate(val !== null ? val : true);
        };
        loadVibration();
    }, []);

    const answeredRecord = userAnswers?.find(answer => answer.question === currentQuestion);
    const isAnswered = Boolean(answeredRecord);
    const isSelected = answeredRecord?.userAnswer === index;
    const isCorrectOption = index === correctIndex;

    const clickOption = () => {
        if (isVibrate) Vibration.vibrate(80);
        setUserAnswers(prev => [
            ...prev,
            { question: currentQuestion, userAnswer: index, correctAnswer: correctIndex }
        ]);
    };

    // Calculate dynamic styles based on theme & state
    let cardStyle = {
        backgroundColor: colors.games.optionBg,
        borderColor: colors.games.optionBorder,
        shadowColor: colors.games.cardShadow,
    };
    let badgeStyle = {
        backgroundColor: isDark ? colors.common.surface : '#F5F3FF',
    };
    let badgeTextStyle = {
        color: colors.common.primary,
    };
    let textStyle = {
        color: colors.games.textPrimary,
        fontWeight: '600',
    };
    let icon = null;

    if (isAnswered) {
        if (isCorrectOption) {
            // Correct answer
            cardStyle = {
                backgroundColor: colors.games.correctBg,
                borderColor: colors.games.correctBorder,
                shadowColor: colors.common.success,
            };
            badgeStyle = {
                backgroundColor: colors.common.success,
            };
            badgeTextStyle = {
                color: '#FFFFFF',
            };
            textStyle = {
                color: colors.games.correctText,
                fontWeight: '700',
            };
            icon = <Feather name="check" size={16} color="#FFFFFF" />;
        } else if (isSelected && !isCorrectOption) {
            // Selected wrong
            cardStyle = {
                backgroundColor: colors.games.wrongBg,
                borderColor: colors.games.wrongBorder,
                shadowColor: colors.common.danger,
            };
            badgeStyle = {
                backgroundColor: colors.common.danger,
            };
            badgeTextStyle = {
                color: '#FFFFFF',
            };
            textStyle = {
                color: colors.games.wrongText,
                fontWeight: '700',
            };
            icon = <Feather name="x" size={16} color="#FFFFFF" />;
        } else {
            // Dimmed unselected
            cardStyle = {
                backgroundColor: isDark ? colors.common.surface : '#F8FAFC',
                borderColor: colors.common.borderSubtle,
                opacity: 0.5,
            };
            badgeStyle = {
                backgroundColor: isDark ? '#2A2B36' : '#E2E8F0',
            };
            badgeTextStyle = {
                color: colors.games.textMuted,
            };
            textStyle = {
                color: colors.games.textSecondary,
                fontWeight: '500',
            };
        }
    }

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={[optionStyles.cardBase, cardStyle]}
            onPress={clickOption}
            disabled={isAnswered}
        >
            <View style={[optionStyles.letterBadge, badgeStyle]}>
                {icon ? icon : (
                    <Text style={[optionStyles.badgeText, badgeTextStyle]}>
                        {OPTION_LETTERS[index] || (index + 1)}
                    </Text>
                )}
            </View>
            <Text style={[optionStyles.optionText, textStyle]} numberOfLines={2}>
                {option}
            </Text>
        </TouchableOpacity>
    );
}

const optionStyles = StyleSheet.create({
    cardBase: {
        width: '100%',
        minHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 18,
        marginBottom: 12,
        borderWidth: 1.5,
    },
    defaultCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E9E3FF',
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    correctCard: {
        backgroundColor: '#DCFCE7',
        borderColor: '#22C55E',
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    wrongCard: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    dimmedCard: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        opacity: 0.65,
    },
    letterBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    defaultBadge: {
        backgroundColor: '#F5F3FF',
    },
    correctBadge: {
        backgroundColor: '#22C55E',
    },
    wrongBadge: {
        backgroundColor: '#EF4444',
    },
    dimmedBadge: {
        backgroundColor: '#E2E8F0',
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '800',
    },
    defaultBadgeText: {
        color: '#5B3FD3',
    },
    correctBadgeText: {
        color: '#FFFFFF',
    },
    wrongBadgeText: {
        color: '#FFFFFF',
    },
    dimmedBadgeText: {
        color: '#94A3B8',
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
    },
    defaultText: {
        color: '#1F2937',
        fontWeight: '600',
    },
    correctText: {
        color: '#15803D',
        fontWeight: '700',
    },
    wrongText: {
        color: '#B91C1C',
        fontWeight: '700',
    },
    dimmedText: {
        color: '#64748B',
        fontWeight: '500',
    },
});