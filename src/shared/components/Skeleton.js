import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contextapis/ThemeContext";

const Skeleton = ({
  width = "100%",
  height = 20,
  radius = 8,
  duration = 1250,
  style,
  baseColor,
  highlightColor,
  variant = "default", // "default" | "glass"
}) => {
  const { isDark } = useTheme();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const translateX = useSharedValue(0);

  // Sayısal değerleri güvenli ayrıştırma (örn. '36' -> 36)
  const parsedWidth = typeof width === "string" && !width.endsWith("%") && !isNaN(Number(width)) ? Number(width) : width;
  const parsedHeight = typeof height === "string" && !height.endsWith("%") && !isNaN(Number(height)) ? Number(height) : height;
  const parsedRadius = typeof radius === "string" && !isNaN(Number(radius)) ? Number(radius) : radius;

  // Renk Belirleme (Varyanta ve Temaya Göre)
  let resolvedBaseColor;
  let resolvedHighlightColor;

  if (variant === "glass") {
    // Gradient kartlar ve canlı zeminler için buzlu cam (frosted glass) stili
    resolvedBaseColor = isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.22)";
    resolvedHighlightColor = isDark ? "rgba(255, 255, 255, 0.38)" : "rgba(255, 255, 255, 0.52)";
  } else {
    // Normal kartlar ve açık/koyu zeminler için modern slate paleti
    resolvedBaseColor = isDark ? "#26262D" : "#E8EDF2";
    resolvedHighlightColor = isDark ? "#383844" : "#F8FAFC";
  }

  // Dışarıdan elle verilen renkler her zaman önceliklidir
  const defaultBaseColor = baseColor ?? resolvedBaseColor;
  const defaultHighlightColor = highlightColor ?? resolvedHighlightColor;

  // Işıltı (Shimmer) genişliği
  const shimmerWidth = Math.max(layoutWidth * 0.45, 80);

  useEffect(() => {
    if (layoutWidth <= 0) {
      return;
    }

    translateX.value = -shimmerWidth;

    translateX.value = withRepeat(
      withTiming(layoutWidth + shimmerWidth, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [layoutWidth, shimmerWidth, duration]);

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: parsedWidth,
          height: parsedHeight,
          borderRadius: parsedRadius,
          backgroundColor: defaultBaseColor,
        },
        style,
      ]}
      onLayout={(event) => {
        const { width: measuredWidth } = event.nativeEvent.layout;
        if (measuredWidth !== layoutWidth) {
          setLayoutWidth(measuredWidth);
        }
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          shimmerAnimatedStyle,
          {
            width: shimmerWidth,
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", defaultHighlightColor, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
});

export default Skeleton;