import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InfoTooltip({ text, size = 16, color = "#94A3B8" }) {
    const [visible, setVisible] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const show = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setVisible(true);
        opacity.setValue(0);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        timerRef.current = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setVisible(false));
        }, 3000);
    };

    const dismiss = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    return (
        <View>
            <TouchableOpacity onPress={show} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="help-circle" size={size} color={color} />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="none" onRequestClose={dismiss}>
                <TouchableOpacity style={tooltipStyles.overlay} activeOpacity={1} onPress={dismiss}>
                    <Animated.View style={[tooltipStyles.bubble, { opacity }]}>
                        <Text style={tooltipStyles.text}>{text}</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const tooltipStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    bubble: {
        maxWidth: 280,
        backgroundColor: "#1E1B4B",
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    text: {
        color: "#FFFFFF",
        fontSize: 13,
        lineHeight: 19,
        fontWeight: "500",
        textAlign: "center",
    },
});
