import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import styles from "../styles/styles";

export default function GameHeader({ onPause, remainTime }) {
    return (
        <View style={styles.gameHeaderRow}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPause}
                style={styles.gameHeaderPauseBtn}
                accessibilityLabel="Pause"
            >
                <Feather name="pause" size={20} color="#5B3FD3" />
            </TouchableOpacity>

            <View style={styles.gameHeaderTimerBadge}>
                <Feather name="clock" size={16} color="#5B3FD3" style={{ marginRight: 6 }} />
                <Text style={styles.gameHeaderTimerText}>{remainTime}</Text>
            </View>
        </View>
    );
}