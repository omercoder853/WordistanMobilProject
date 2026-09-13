import { View, Text, Image, TouchableOpacity, Animated, Easing, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/contextapis/AuthContext";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStats } from "@/contextapis/UserStatsContext";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import { useNotification } from "@/contextapis/NotificationContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AVATAR_SIZE = 40;
const STROKE_WIDTH = 2.5;
const RADIUS = (AVATAR_SIZE + STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AppHeader = () => {
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { userStats, pendingEarnedXP } = useUserStats();
    const { user, setUser } = useAuth();
    const navigation = useNavigation();
    const { notifications, setNotificationPanel } = useNotification();
    const unreadCount = (notifications || []).filter(n => !n.is_read).length;

    const imgSource = user?.gender === "male"
        ? require('../../assets/default_avatar_boy.png')
        : require('../../assets/default_avatar_girl.png');

    useEffect(() => {
        if (!user) {
            const loadUser = async () => {
                const userData = await storage.get(STORAGE_KEYS.SESSION.USER);
                if (userData && setUser) {
                    setUser(userData);
                }
            };
            loadUser();
        }
    }, [user]);

    // XP progress calculation
    const required_xp_for_level = userStats?.required_xp_for_level || 1;
    const xp_for_next = userStats?.xp_for_next || 0;
    const earnedInLevel = Math.max(0, required_xp_for_level - xp_for_next + (pendingEarnedXP || 0));
    const progressRatio = Math.min(Math.max(earnedInLevel / required_xp_for_level, 0), 1);

    const animatedProgress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedProgress, {
            toValue: progressRatio,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [progressRatio]);

    const animatedStrokeDashoffset = animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0],
    });

    const svgSize = AVATAR_SIZE + STROKE_WIDTH * 2 + 4;

    const firstName = user?.first_name
        ? (user.first_name.includes(" ") ? user.first_name.split(" ")[0] : user.first_name)
        : "";

    return (
        <View style={[styles.profileRowContainer, { paddingTop: insets.top + 10, backgroundColor: colors.header.background, shadowColor: colors.header.shadow }]}>
            <View style={styles.greeting}>
                <Image
                    style={[styles.logoImage, { borderColor: colors.header.logoBorder }]}
                    source={require('../../assets/logo.png')}
                />
                <View style={styles.greetingTextContainer}>
                    <Text style={[styles.textWelcome, { color: colors.header.textWelcome }]}>{t('welcome')}</Text>
                    <Text style={[styles.textUserName, { color: colors.header.textUserName }]} numberOfLines={1}>
                        {firstName}
                    </Text>
                </View>
            </View>

            <View style={styles.profileContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile Navigation", { screen: "Statistics" })}
                    activeOpacity={0.7}
                    style={styles.avatarWithProgress}>
                    <Svg
                        width={svgSize}
                        height={svgSize}
                        style={{ position: 'absolute', top: -2, left: -2 }}>
                        <Circle
                            cx={svgSize / 2}
                            cy={svgSize / 2}
                            r={RADIUS}
                            stroke={colors.header.progressRingBg}
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                        />
                        <AnimatedCircle
                            cx={svgSize / 2}
                            cy={svgSize / 2}
                            r={RADIUS}
                            stroke={colors.header.progressRingFill}
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={animatedStrokeDashoffset}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${svgSize / 2}, ${svgSize / 2}`}
                        />
                    </Svg>
                    <Image
                        style={styles.profileImage}
                        source={imgSource}
                    />
                    <View style={[styles.levelBadge, { backgroundColor: colors.header.levelBadgeBg, borderColor: colors.header.levelBadgeBorder }]}>
                        <Text style={[styles.levelBadgeText, { color: colors.header.levelBadgeText }]}>{userStats?.level || 1}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setNotificationPanel(true)}
                    activeOpacity={0.7}
                    style={[styles.notificationButton, { backgroundColor: colors.header.iconButtonBg, borderColor: colors.header.iconButtonBorder }]}
                >
                    <Ionicons
                        name={unreadCount > 0 ? "notifications" : "notifications-outline"}
                        size={22}
                        color={colors.header.iconButtonColor}
                    />
                    {unreadCount > 0 && (
                        <View style={[styles.notificationBadge, { backgroundColor: colors.header.badgeBg, borderColor: colors.header.background }]}>
                            <Text style={[styles.notificationBadgeText, { color: colors.header.badgeText }]}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    profileRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
        backgroundColor: '#faf7fa',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 0,
    },
    greeting: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    logoImage: {
        width: 48,
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(91, 63, 211, 0.1)',
    },
    greetingTextContainer: {
        marginLeft: 11,
        justifyContent: 'center',
    },
    textWelcome: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
        lineHeight: 17,
    },
    textUserName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: -0.2,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight:2,
        marginBottom:4
    },
    avatarWithProgress: {
        width: 46,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    levelBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#8B5CF6',
        borderRadius: 9,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    levelBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
    },
    notificationButton: {
        width: 42,
        height: 42,
        borderRadius: 13,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#EF4444',
        borderRadius: 9,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: '#FFFFFF',
    },
    notificationBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '800',
        textAlign: 'center',
    },
});
