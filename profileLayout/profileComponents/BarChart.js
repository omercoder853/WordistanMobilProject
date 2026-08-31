import { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions, StyleSheet } from "react-native";

export default function BarChart({ data, labels, colors, maxValue }) {
    if (!data || data.length === 0) return null;

    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - 80;
    const barMaxHeight = 130;
    const max = maxValue || Math.max(...data) || 1;

    return (
        <View style={barStyles.container}>
            <View style={barStyles.barsRow}>
                {data.map((val, i) => (
                    <BarItem
                        key={i}
                        value={val}
                        label={labels[i]}
                        color={colors[i]}
                        maxHeight={barMaxHeight}
                        maxValue={max}
                        width={chartWidth / data.length - 12}
                    />
                ))}
            </View>
        </View>
    );
}

function BarItem({ value, label, color, maxHeight, maxValue, width }) {
    const animHeight = useRef(new Animated.Value(0)).current;
    const targetHeight = Math.max((value / maxValue) * maxHeight, 4);

    useEffect(() => {
        Animated.timing(animHeight, {
            toValue: targetHeight,
            duration: 700,
            useNativeDriver: false,
        }).start();
    }, [targetHeight]);

    return (
        <View style={[barStyles.barColumn, { width }]}>
            <Text style={barStyles.barValue}>{value}</Text>
            <View style={[barStyles.barTrack, { height: maxHeight }]}>
                <Animated.View
                    style={[
                        barStyles.barFill,
                        {
                            height: animHeight,
                            backgroundColor: color,
                            width: "100%",
                        },
                    ]}
                />
            </View>
            <Text style={barStyles.barLabel} numberOfLines={1}>{label}</Text>
        </View>
    );
}

const barStyles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 8,
    },
    barsRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 12,
    },
    barColumn: {
        alignItems: "center",
        gap: 4,
    },
    barValue: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1E1B4B",
    },
    barTrack: {
        width: "100%",
        borderRadius: 8,
        backgroundColor: "#F1F5F9",
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    barFill: {
        borderRadius: 8,
    },
    barLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#64748B",
        marginTop: 2,
        textAlign: "center",
    },
});
