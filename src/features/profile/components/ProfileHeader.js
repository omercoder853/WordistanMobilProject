import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/contextapis/AuthContext";
import { useTheme } from "@/contextapis/ThemeContext";
import { AVATARS } from "@/constants/AvatarUrls";

export default function ProfileHeader() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const imgSource = AVATARS[user?.avatar_url] || AVATARS["avatar_1"];

    const ringBorderColor = isDark ? "#3A384A" : "#FFFFFF";
    const nickBadgeBg = isDark ? "rgba(167, 139, 250, 0.15)" : "rgba(91, 63, 211, 0.08)";
    const nickBadgeColor = isDark ? "#C084FC" : "#5B3FD3";

    return (
        <View style={styles.profileHeader}>
            {/* Avatar with Elegant Ring */}
            <View style={styles.avatarWrapper}>
                <View style={[styles.avatarRing, { borderColor: ringBorderColor }]}>
                    <Image style={styles.profilePhoto} source={imgSource} />
                </View>
            </View>

            {/* Full Name */}
            <Text style={[styles.userName, { color: colors.profile.textPrimary }]}>
                {(user?.first_name || "") + " " + (user?.last_name || "")}
            </Text>

            {/* Nickname Badge */}
            {user?.nick_name ? (
                <View style={[styles.nickBadge, { backgroundColor: nickBadgeBg }]}>
                    <Text style={[styles.nickText, { color: nickBadgeColor }]}>
                        @{user.nick_name}
                    </Text>
                </View>
            ) : null}

            {/* Email */}
            {user?.email ? (
                <View style={styles.userEmailRow}>
                    <MaterialIcons name="mail-outline" size={14} color={colors.profile.textSecondary} />
                    <Text style={[styles.userEmail, { color: colors.profile.textSecondary }]}>
                        {user.email}
                    </Text>
                </View>
            ) : null}
        </View>
    );
}