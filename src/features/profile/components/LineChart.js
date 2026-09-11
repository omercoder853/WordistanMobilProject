import { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line, Text as SvgText } from "react-native-svg";

const CHART_HEIGHT = 180;
const PADDING = { top: 20, right: 16, bottom: 30, left: 40 };

export default function LineChart({ data, labels, color = "#6366F1", gradientColor = "#6366F120" }) {
    const [tooltip, setTooltip] = useState(null);
    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - 60;

    if (!data || data.length === 0) return null;

    const plotW = chartWidth - PADDING.left - PADDING.right;
    const plotH = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const minVal = Math.min(...data) * 0.9;
    const maxVal = Math.max(...data) * 1.1 || 1;
    const range = maxVal - minVal || 1;

    const getX = (i) => PADDING.left + (i / Math.max(data.length - 1, 1)) * plotW;
    const getY = (val) => PADDING.top + plotH - ((val - minVal) / range) * plotH;

    // Build line path
    let linePath = `M ${getX(0)} ${getY(data[0])}`;
    for (let i = 1; i < data.length; i++) {
        linePath += ` L ${getX(i)} ${getY(data[i])}`;
    }

    // Build area path (for gradient fill under line)
    const areaPath = `${linePath} L ${getX(data.length - 1)} ${PADDING.top + plotH} L ${getX(0)} ${PADDING.top + plotH} Z`;

    // Y axis labels (4 ticks)
    const yTicks = [];
    for (let i = 0; i <= 3; i++) {
        const val = minVal + (range * i) / 3;
        yTicks.push({ val: Math.round(val * 10) / 10, y: getY(val) });
    }

    return (
        <View>
            <Svg width={chartWidth} height={CHART_HEIGHT}>
                <Defs>
                    <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={color} stopOpacity="0.2" />
                        <Stop offset="1" stopColor={color} stopOpacity="0" />
                    </LinearGradient>
                </Defs>

                {/* Grid lines */}
                {yTicks.map((tick, i) => (
                    <Line
                        key={`grid-${i}`}
                        x1={PADDING.left}
                        y1={tick.y}
                        x2={chartWidth - PADDING.right}
                        y2={tick.y}
                        stroke="#E5E7EB"
                        strokeWidth={0.8}
                        strokeDasharray="4,3"
                    />
                ))}

                {/* Y axis labels */}
                {yTicks.map((tick, i) => (
                    <SvgText
                        key={`ylabel-${i}`}
                        x={PADDING.left - 6}
                        y={tick.y + 4}
                        fontSize={10}
                        fill="#94A3B8"
                        textAnchor="end"
                    >
                        {tick.val}
                    </SvgText>
                ))}

                {/* X axis labels */}
                {labels && labels.map((label, i) => {
                    // Show limited labels to avoid overlap
                    const showEvery = Math.max(1, Math.floor(labels.length / 5));
                    if (i % showEvery !== 0 && i !== labels.length - 1) return null;
                    return (
                        <SvgText
                            key={`xlabel-${i}`}
                            x={getX(i)}
                            y={CHART_HEIGHT - 5}
                            fontSize={9}
                            fill="#94A3B8"
                            textAnchor="middle"
                        >
                            {label}
                        </SvgText>
                    );
                })}

                {/* Area fill */}
                <Path d={areaPath} fill="url(#lineGrad)" />

                {/* Line */}
                <Path
                    d={linePath}
                    stroke={color}
                    strokeWidth={2.5}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {data.map((val, i) => (
                    <Circle
                        key={`dot-${i}`}
                        cx={getX(i)}
                        cy={getY(val)}
                        r={tooltip?.index === i ? 6 : 4}
                        fill="#FFFFFF"
                        stroke={color}
                        strokeWidth={2.5}
                        onPress={() => setTooltip({ index: i, val, x: getX(i), y: getY(val) })}
                    />
                ))}
            </Svg>

            {/* Tooltip overlay */}
            {tooltip && (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setTooltip(null)}
                    style={{
                        position: "absolute",
                        left: Math.min(Math.max(tooltip.x - 35, 0), chartWidth - 70),
                        top: Math.max(tooltip.y - 38, 0),
                        backgroundColor: "#1E1B4B",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                        zIndex: 10,
                    }}
                >
                    <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "700", textAlign: "center" }}>
                        {tooltip.val}
                    </Text>
                    {labels && labels[tooltip.index] && (
                        <Text style={{ color: "#A5B4FC", fontSize: 9, textAlign: "center" }}>
                            {labels[tooltip.index]}
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}
