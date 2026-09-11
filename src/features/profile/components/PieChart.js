import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, Text as SvgText, G } from "react-native-svg";

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 75;

export default function PieChart({ data, colors, labels }) {
    const [selected, setSelected] = useState(null);

    if (!data || data.length === 0 || data.every((v) => v === 0)) return null;

    const total = data.reduce((s, v) => s + v, 0);
    if (total === 0) return null;

    let currentAngle = -90; // Start from top

    const slices = data.map((value, i) => {
        const percentage = value / total;
        const angle = percentage * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const isSelected = selected === i;
        const r = isSelected ? RADIUS + 6 : RADIUS;

        const x1 = CENTER + r * Math.cos(startRad);
        const y1 = CENTER + r * Math.sin(startRad);
        const x2 = CENTER + r * Math.cos(endRad);
        const y2 = CENTER + r * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        const d = [
            `M ${CENTER} ${CENTER}`,
            `L ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
            "Z",
        ].join(" ");

        return { d, color: colors[i], value, label: labels[i], percentage, index: i };
    });

    return (
        <View style={pieStyles.container}>
            <Svg width={SIZE} height={SIZE}>
                {slices.map((slice) => (
                    <Path
                        key={slice.index}
                        d={slice.d}
                        fill={slice.color}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        onPress={() => setSelected(selected === slice.index ? null : slice.index)}
                    />
                ))}

                {/* Center circle (donut hole) */}
                <Circle cx={CENTER} cy={CENTER} r={40} fill="#FFFFFF" />

                {/* Center text */}
                {selected !== null ? (
                    <G>
                        <SvgText
                            x={CENTER}
                            y={CENTER - 6}
                            fontSize={16}
                            fontWeight="700"
                            fill="#1E1B4B"
                            textAnchor="middle"
                        >
                            {data[selected]}
                        </SvgText>
                        <SvgText
                            x={CENTER}
                            y={CENTER + 12}
                            fontSize={10}
                            fill="#64748B"
                            textAnchor="middle"
                        >
                            {labels[selected]}
                        </SvgText>
                    </G>
                ) : (
                    <SvgText
                        x={CENTER}
                        y={CENTER + 5}
                        fontSize={18}
                        fontWeight="700"
                        fill="#1E1B4B"
                        textAnchor="middle"
                    >
                        {total}
                    </SvgText>
                )}
            </Svg>

            {/* Legend */}
            <View style={pieStyles.legend}>
                {labels.map((label, i) => (
                    <View key={i} style={pieStyles.legendItem}>
                        <View style={[pieStyles.legendDot, { backgroundColor: colors[i] }]} />
                        <Text style={pieStyles.legendLabel}>{label}</Text>
                        <Text style={pieStyles.legendValue}>
                            {data[i]} ({Math.round((data[i] / total) * 100)}%)
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const pieStyles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    legend: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 12,
        gap: 12,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        fontSize: 12,
        color: "#374151",
        fontWeight: "600",
    },
    legendValue: {
        fontSize: 11,
        color: "#94A3B8",
        fontWeight: "500",
    },
});
