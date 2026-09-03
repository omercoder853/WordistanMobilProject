import { View, Text, Image, TouchableOpacity, Animated, Easing,StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../contextapis/AuthContext";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useUserStats } from "../contextapis/UserStatsContext";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import { useNotification } from "../contextapis/NotificationContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AVATAR_SIZE = 46;
const STROKE_WIDTH = 3;
const RADIUS = (AVATAR_SIZE + STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ProfileRow = () => {
    const insets = useSafeAreaInsets();
    const {userStats, pendingEarnedXP} = useUserStats();
    const {user,setUser,getDataStorage} = useAuth();
    const {t} = useTranslation();
    const navigation = useNavigation();
    const {notifications, setNotificationPanel} = useNotification();
    const unreadCount = (notifications || []).filter(n => !n.is_read).length;
    
    const imgSource = user?.gender=="male" ? require('../assets/avatarBoy.png') : require('../assets/avatarGirl.png')
    useEffect(() => {
        if (!user) {
            const loadUser = async () => {
                const userData = await getDataStorage("user");
                if (userData && setUser) {
                    setUser(JSON.parse(userData));
                }
            };
            loadUser();
        }}, [user]);

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

    return(
    <View style={[styles.profileRowContainer,{marginTop:insets.top}]}>
        <View style={styles.greeting}>
            <Image
                style={styles.logoImage}
                source={require("../assets/logo.png")}/>
            <Text style={styles.textWelcome}>elcome, </Text>
            <Text style={{fontSize:18}}>{user?.first_name.includes(" ") ? user?.first_name.split(" ")[0] : user?.first_name}</Text>
        </View>
        <View style={styles.profileContainer}>
            <TouchableOpacity 
                onPress={() => navigation.navigate("Settings Navigation", {screen: "Statistics"})}
                activeOpacity={0.7}
                style={styles.avatarWithProgress}>
                {/* Circular progress ring */}
                <Svg
                    width={svgSize}
                    height={svgSize}
                    style={{ position: 'absolute', top: -2, left: -2 }}>
                    {/* Track (background circle) */}
                    <Circle
                        cx={svgSize / 2}
                        cy={svgSize / 2}
                        r={RADIUS}
                        stroke="#EDE9FE"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"/>
                    {/* Progress arc */}
                    <AnimatedCircle
                        cx={svgSize / 2}
                        cy={svgSize / 2}
                        r={RADIUS}
                        stroke="#8B5CF6"
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={animatedStrokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${svgSize / 2}, ${svgSize / 2}`}/>
                </Svg>
                {/* Profile image */}
                <Image
                    style={styles.profileImage}
                    source={imgSource}/>
                {/* Level badge */}
                <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>{userStats?.level || 1}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setNotificationPanel(true)}
                activeOpacity={0.7}
                style={styles.notificationButton}
            >
                <Ionicons
                    name={unreadCount > 0 ? "notifications" : "notifications-outline"}
                    size={24}
                    color="#5B3FD3"
                />
                {unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    </View>
)};

export default ProfileRow;

const styles = StyleSheet.create({
    logoImage : {
        width:72,
        aspectRatio:1,
        borderRadius:25,
    },
    profileRowContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        justifyContent:'space-between',
        paddingVertical:5,
        paddingRight:10,
        backgroundColor: 'transparent'
    },
    textWelcome:{
        fontSize:18,
        marginLeft:-12
    },
    profileContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    greeting:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    profileImage:{
        width:46,
        height:46,
        borderRadius:23,
    },
    avatarWithProgress:{
        width: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
    },
    levelBadge:{
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#8B5CF6',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    levelBadgeText:{
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    notificationButton: {
        marginLeft: 8,
        position: 'relative',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -4,
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
    }
})
