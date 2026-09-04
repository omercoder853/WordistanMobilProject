import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeedback } from '../../contextapis/FeedbackContext';
import { styles, getToastTheme } from './CustomToast.style';

export default function CustomToast() {
  const { toastVisible, toastTitle, toastMessage, toastType, hideToast } = useFeedback();
  const insets = useSafeAreaInsets();

  const [shouldRender, setShouldRender] = useState(false);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const dismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShouldRender(false);
      hideToast();
    });
  };

  useEffect(() => {
    if (toastVisible) {
      setShouldRender(true);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Reset initial values before starting animation
      translateY.setValue(-120);
      opacity.setValue(0);

      // Entrance animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 5,
          speed: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 4 seconds
      timerRef.current = setTimeout(() => {
        dismiss();
      }, 4000);
    } else if (shouldRender) {
      dismiss();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toastVisible, toastTitle, toastMessage, toastType]);

  if (!shouldRender) {
    return null;
  }

  const theme = getToastTheme(toastType);
  const topInset = Math.max(insets?.top || 0, 16);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          top: topInset + 8,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={dismiss}
        style={[
          styles.toastCard,
          {
            borderColor: theme.borderColor,
          },
        ]}
      >
        {/* Left vertical accent bar */}
        <View style={[styles.leftAccentBar, { backgroundColor: theme.accentBarColor }]} />

        {/* Circular icon container */}
        <View
          style={[
            styles.iconBadge,
            {
              backgroundColor: theme.badgeBgColor,
              borderColor: theme.badgeBorderColor,
            },
          ]}
        >
          <Ionicons name={theme.iconName} size={22} color={theme.iconColor} />
        </View>

        {/* Title and Message */}
        <View style={styles.contentContainer}>
          {!!toastTitle && (
            <Text style={[styles.title, { color: theme.titleColor }]} numberOfLines={1}>
              {toastTitle}
            </Text>
          )}
          {!!toastMessage && (
            <Text style={[styles.message, { color: theme.messageColor }]} numberOfLines={2}>
              {toastMessage}
            </Text>
          )}
        </View>

        {/* Close Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.closeButton}
          onPress={dismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={16} color="#64748B" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}