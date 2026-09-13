import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import styles from "../styles/styles";
import { useTheme } from "@/contextapis/ThemeContext";

export default function GameHeader({ onPause, remainTime }) {
    const { colors } = useTheme();

    return (
        <View style={styles.gameHeaderRow}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPause}
                style={[
                    styles.gameHeaderPauseBtn,
                    {
                        backgroundColor: colors.games.pauseBtnBg,
                        borderColor: colors.games.pauseBtnBorder,
                        shadowColor: colors.games.cardShadow,
                    }
                ]}
                accessibilityLabel="Pause"
            >
                <Feather name="pause" size={20} color={colors.common.primary} />
            </TouchableOpacity>

            <View style={[
                styles.gameHeaderTimerBadge,
                {
                    backgroundColor: colors.games.timerBadgeBg,
                    borderColor: colors.games.timerBadgeBorder,
                    shadowColor: colors.games.cardShadow,
                }
            ]}>
                <Feather name="clock" size={16} color={colors.common.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.gameHeaderTimerText, { color: colors.common.primary }]}>{remainTime}</Text>
            </View>
        </View>
    );
}