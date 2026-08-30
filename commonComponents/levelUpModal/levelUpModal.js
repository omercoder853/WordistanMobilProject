import { useEffect, useRef } from 'react';
import { View, Modal, Text, TouchableOpacity, Animated, Easing, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useUserStats } from '../../contextapis/UserStatsContext';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LevelUpModal() {
    const { t } = useTranslation();
    const { levelUpInfo, dismissLevelUp } = useUserStats();

    // 3D Flip animation for level number (Calendar page turn effect)
    const flipAnim = useRef(new Animated.Value(0)).current;

    // Modal progress bar animation
    const modalProgress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (levelUpInfo) {
            flipAnim.setValue(0);
            modalProgress.setValue(0.2);

            Animated.sequence([
                Animated.timing(modalProgress, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false,
                }),
                Animated.timing(flipAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
                Animated.timing(modalProgress, {
                    toValue: 0.15,
                    duration: 600,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false,
                })
            ]).start();
        }
    }, [levelUpInfo]);

    if (!levelUpInfo) return null;

    const oldLevel = levelUpInfo.oldLevel || 1;
    const newLevel = levelUpInfo.newLevel || 2;

    // 3D Rotation Interpolation for flip effect
    const frontRotate = flipAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '-90deg', '-180deg'],
    });

    const backRotate = flipAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['180deg', '90deg', '0deg'],
    });

    const frontOpacity = flipAnim.interpolate({
        inputRange: [0, 0.49, 0.5, 1],
        outputRange: [1, 1, 0, 0],
    });

    const backOpacity = flipAnim.interpolate({
        inputRange: [0, 0.49, 0.5, 1],
        outputRange: [0, 0, 1, 1],
    });

    const modalBarWidth = modalProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Modal statusBarTranslucent transparent visible={!!levelUpInfo} animationType="fade">
            <View style={modalStyles.overlay}>
                {/* Confetti Animation background */}
                <LottieView
                    source={require('../../assets/animations/ConfettiAnimation.json')}
                    autoPlay
                    loop
                    style={modalStyles.confetti}
                    resizeMode="cover"
                />

                <View style={modalStyles.card}>
                    {/* Header Badge */}
                    <LinearGradient
                        colors={['#6366F1', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={modalStyles.badge}
                    >
                        <Ionicons name="trophy" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={modalStyles.badgeText}>{t('levelUpTitle')}</Text>
                    </LinearGradient>

                    {/* Calendar Flip Card Container */}
                    <View style={modalStyles.flipContainer}>
                        {/* Front Side: Old Level */}
                        <Animated.View
                            style={[
                                modalStyles.levelBox,
                                {
                                    opacity: frontOpacity,
                                    transform: [{ perspective: 1000 }, { rotateX: frontRotate }],
                                }
                            ]}
                        >
                            <Text style={modalStyles.levelNumber}>{oldLevel}</Text>
                            <Text style={modalStyles.levelLabel}>{t('level')}</Text>
                        </Animated.View>

                        {/* Back Side: New Level */}
                        <Animated.View
                            style={[
                                modalStyles.levelBox,
                                modalStyles.levelBoxNew,
                                {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: backOpacity,
                                    transform: [{ perspective: 1000 }, { rotateX: backRotate }],
                                }
                            ]}
                        >
                            <Text style={modalStyles.levelNumberNew}>{newLevel}</Text>
                            <Text style={modalStyles.levelLabelNew}>{t('level')}</Text>
                        </Animated.View>
                    </View>

                    {/* Celebration Message */}
                    <Text style={modalStyles.message}>
                        {t('levelUpMessage', { level: newLevel })}
                    </Text>
                    <Text style={modalStyles.subText}>
                        {t('levelUpSub')}
                    </Text>

                    {/* Modal Progress Bar */}
                    <View style={modalStyles.progressTrack}>
                        <Animated.View style={[modalStyles.progressFillContainer, { width: modalBarWidth }]}>
                            <LinearGradient
                                colors={['#6366F1', '#EC4899']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={modalStyles.progressFill}
                            />
                        </Animated.View>
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        onPress={dismissLevelUp}
                        activeOpacity={0.8}
                        style={{ width: '100%' }}
                    >
                        <LinearGradient
                            colors={['#8B5CF6', '#EC4899']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={modalStyles.button}
                        >
                            <Text style={modalStyles.buttonText}>{t('keepGoing')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confetti: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
    card: {
        width: width * 0.86,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 15,
        borderWidth: 1.5,
        borderColor: '#EDE9FE',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        marginBottom: 20,
    },
    badgeText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    flipContainer: {
        width: 100,
        height: 110,
        marginVertical: 10,
    },
    levelBox: {
        width: 100,
        height: 110,
        backgroundColor: '#F3E8FF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8B5CF6',
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        backfaceVisibility: 'hidden',
    },
    levelBoxNew: {
        backgroundColor: '#8B5CF6',
        borderColor: '#EC4899',
    },
    levelNumber: {
        fontSize: 48,
        fontWeight: '900',
        color: '#8B5CF6',
    },
    levelLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#7C3AED',
        textTransform: 'uppercase',
        marginTop: -6,
    },
    levelNumberNew: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    levelLabelNew: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FDE047',
        textTransform: 'uppercase',
        marginTop: -6,
    },
    message: {
        fontSize: 19,
        fontWeight: '800',
        color: '#1E1B4B',
        textAlign: 'center',
        marginTop: 16,
    },
    subText: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 16,
        lineHeight: 18,
    },
    progressTrack: {
        width: '100%',
        height: 10,
        backgroundColor: '#EDE9FE',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressFillContainer: {
        height: '100%',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
});
