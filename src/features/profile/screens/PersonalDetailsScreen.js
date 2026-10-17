import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import styles from "../styles/ProfileDetailsScreenStyle";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contextapis/AuthContext";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import EditProfileModal from "../components/EditProfileModal";
import { useTheme } from "@/contextapis/ThemeContext";
import { AVATARS } from "@/constants/AvatarUrls";

// ─── Detail field config (icon + color per row) ───
const detailFields = [
    { key: "nameProfile", userField: "first_name", icon: "person-outline", color: "#5B3FD3", bg: "rgba(91, 63, 211, 0.1)" },
    { key: "surnameProfile", userField: "last_name", icon: "people-outline", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
    { key: "emailProfile", userField: "email", icon: "mail-outline", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
    { key: "usernameProfile", userField: "nick_name", icon: "at-outline", color: "#EC4899", bg: "rgba(236, 72, 153, 0.1)" },
    { key: "genderProfile", userField: "gender", isTranslated: true, icon: "male-female-outline", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
    { key: "birthDateProfile", userField: "birth_date", icon: "calendar-outline", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
    { key: "dateJoinedProfile", userField: "created_at", slice: true, icon: "time-outline", color: "#6366F1", bg: "rgba(99, 102, 241, 0.1)" },
];

export default function PersonalDetails() {
    const { user, isGuest } = useAuth();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const imgSource = AVATARS[user?.avatar_url] || AVATARS["avatar_1"];

    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const getFieldValue = (field) => {
        const val = user?.[field.userField];
        if (field.slice) return val?.slice(0, 10) ?? "";
        if (field.isTranslated) return t(val);
        return val ?? "";
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.common.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ─── Avatar Header ─── */}
                <View style={[styles.avatarSection, { backgroundColor: colors.profile.cardBg }]}>
                    <View style={styles.avatarWrapper}>
                        <Image style={styles.profilePhoto} source={imgSource} />
                    </View>
                    <Text style={[styles.avatarName, { color: colors.profile.textPrimary }]}>
                        {user?.first_name} {user?.last_name}
                    </Text>
                    <Text style={[styles.avatarEmail, { color: colors.profile.textSecondary }]}>{user?.email}</Text>
                </View>

                {/* ─── Personal Info Card ─── */}
                <View style={[styles.detailsCard, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
                    <Text style={[styles.sectionTitle, { color: colors.profile.sectionTitle }]}>{t("personalDetails")}</Text>
                    {detailFields.map((field, index) => (
                        <View key={field.key}>
                            <View style={styles.profileDetailItem}>
                                <View style={[styles.detailIconBox, { backgroundColor: field.bg }]}>
                                    <Ionicons name={field.icon} size={20} color={field.color} />
                                </View>
                                <Text style={[styles.profileLabel, { color: colors.profile.textPrimary }]}>{t(field.key)}</Text>
                                <Text style={[styles.profileValue, { color: colors.profile.textSecondary }]}>{getFieldValue(field)}</Text>
                            </View>
                            {index < detailFields.length - 1 && <View style={[styles.separator, { backgroundColor: colors.profile.separator }]} />}
                        </View>
                    ))}
                </View>

                {/* ─── Security Card (Change Password) ─── */}
                <View style={[styles.detailsCard, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
                    <Text style={[styles.sectionTitle, { color: colors.profile.sectionTitle }]}>{t("security")}</Text>
                    <View style={styles.profileDetailItem}>
                        <View style={[styles.detailIconBox, { backgroundColor: colors.profile.editActionIconBg }]}>
                            <Ionicons name="create-outline" size={20} color={colors.profile.editActionIcon} />
                        </View>
                        <Text style={[styles.profileLabel, { color: colors.profile.textPrimary }]}>{t("editProfile")}</Text>
                        <TouchableOpacity
                            disabled={isGuest}
                            style={[
                                styles.changePasswordButton,
                                {
                                    backgroundColor: colors.profile.editActionBg,
                                    shadowColor: colors.profile.editActionBg,
                                },
                                isGuest && {
                                    backgroundColor: colors.profile.actionDisabledBg,
                                    shadowColor: colors.profile.actionDisabledBg,
                                    shadowOpacity: 0,
                                    elevation: 0,
                                },
                            ]}
                            onPress={() => setEditModalVisible(true)}
                        >
                            <Text style={[
                                styles.changePasswordText,
                                { color: isGuest ? colors.profile.actionDisabledText : colors.profile.actionButtonText },
                            ]}>{t("editProfile")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.separator, { backgroundColor: colors.profile.separator }]} />
                    <View style={styles.profileDetailItem}>
                        <View style={[styles.detailIconBox, { backgroundColor: colors.profile.passwordActionIconBg }]}>
                            <Ionicons name="key-outline" size={20} color={colors.profile.passwordActionIcon} />
                        </View>
                        <Text style={[styles.profileLabel, { color: colors.profile.textPrimary }]}>{t("changePassword")}</Text>
                        <TouchableOpacity
                            disabled={isGuest}
                            style={[
                                styles.changePasswordButton,
                                {
                                    backgroundColor: colors.profile.securityActionBg,
                                    shadowColor: colors.profile.securityActionBg,
                                },
                                isGuest && {
                                    backgroundColor: colors.profile.actionDisabledBg,
                                    shadowColor: colors.profile.actionDisabledBg,
                                    shadowOpacity: 0,
                                    elevation: 0,
                                },
                            ]}
                            onPress={() => setPasswordModalVisible(true)}
                        >
                            <Text style={[
                                styles.changePasswordText,
                                { color: isGuest ? colors.profile.actionDisabledText : colors.profile.actionButtonText },
                            ]}>{t("changePassword")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── Danger Zone (Delete Account) ─── */}
                <TouchableOpacity
                    disabled={isGuest}
                    style={[
                        styles.deleteAccountButton,
                        {
                            backgroundColor: colors.profile.deleteActionBg,
                            borderColor: colors.profile.deleteActionBorder,
                        },
                        isGuest && {
                            backgroundColor: colors.profile.actionDisabledBg,
                            borderColor: colors.profile.actionDisabledBorder,
                        },
                    ]}
                    onPress={() => setDeleteModalVisible(true)}
                >
                    <Ionicons
                        name="trash-outline"
                        size={18}
                        color={isGuest ? colors.profile.actionDisabledText : colors.profile.deleteActionIcon}
                    />
                    <Text style={[
                        styles.deleteAccountText,
                        { color: isGuest ? colors.profile.actionDisabledText : colors.profile.deleteActionIcon },
                    ]}>{t("deleteAccount")}</Text>
                </TouchableOpacity>
            </ScrollView>

            <ChangePasswordModal
                visible={passwordModalVisible}
                onClose={() => setPasswordModalVisible(false)}
            />

            <DeleteAccountModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
            />

            <EditProfileModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
            />
        </View>
    )
}