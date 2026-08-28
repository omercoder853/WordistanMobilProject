import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import styles from "../profileStyle/profileDetailsStyle";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contextapis/AuthContext";
import { useNavigation } from "@react-navigation/native";
import ChangePasswordModal from "../profileComponents/ChangePasswordModal";
import DeleteAccountModal from "../profileComponents/DeleteAccountModal";
import CustomAlert from "../../commonComponents/customAlert/customAlert";

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
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const imgSource = user.gender == "male" ? require("../../assets/avatarBoy.png") : require("../../assets/avatarGirl.png")

    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, success: false, type: null });

    const handlePasswordResult = (result) => {
        setPasswordModalVisible(false);
        setAlertConfig({
            visible: true,
            success: result?.success === true,
            type: 'password',
        });
    };

    const handleDeleteResult = (result) => {
        setDeleteModalVisible(false);
        setAlertConfig({
            visible: true,
            success: result?.success === true,
            type: 'delete',
        });
    };

    const handleAlertClose = () => {
        const type = alertConfig.type;
        const success = alertConfig.success;
        setAlertConfig({ visible: false, success: false, type: null });

        if (type === 'password') {
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        } else if (type === 'delete' && !success) {
            // Başarısız silme — kullanıcı Personal Details'te kalır, sadece alert kapanır
        }
        // Başarılı silme durumunda logout() zaten çağrıldı, isLogin:false olunca auth stack devreye girer
    };

    const getAlertTitle = () => {
        if (alertConfig.type === 'password') {
            return alertConfig.success ? t("passwordChangedSuccess") : t("passwordChangeFailed");
        }
        return alertConfig.success ? t("deleteAccountSuccess") : t("deleteAccountFailed");
    };

    const getAlertMessage = () => {
        if (alertConfig.type === 'password') {
            return alertConfig.success ? t("passwordChangedSuccessMsg") : t("passwordChangeFailedMsg");
        }
        return alertConfig.success ? t("deleteAccountSuccessMsg") : t("deleteAccountFailedMsg");
    };

    const getAlertButtonStyle = () => {
        if (alertConfig.type === 'password') {
            return alertConfig.success ? "success" : "danger";
        }
        return alertConfig.success ? "defaultButton" : "danger";
    };

    const getFieldValue = (field) => {
        const val = user?.[field.userField];
        if (field.slice) return val?.slice(0, 10) ?? "";
        if (field.isTranslated) return t(val);
        return val ?? "";
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ─── Avatar Header ─── */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image style={styles.profilePhoto} source={imgSource} />
                        <TouchableOpacity style={styles.editPhoto}>
                            <MaterialCommunityIcons name="image-edit-outline" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarName}>
                        {user?.first_name} {user?.last_name}
                    </Text>
                    <Text style={styles.avatarEmail}>{user?.email}</Text>
                </View>

                {/* ─── Personal Info Card ─── */}
                <View style={styles.detailsCard}>
                    <Text style={styles.sectionTitle}>{t("personalDetails")}</Text>
                    {detailFields.map((field, index) => (
                        <View key={field.key}>
                            <View style={styles.profileDetailItem}>
                                <View style={[styles.detailIconBox, { backgroundColor: field.bg }]}>
                                    <Ionicons name={field.icon} size={18} color={field.color} />
                                </View>
                                <Text style={styles.profileLabel}>{t(field.key)}</Text>
                                <Text style={styles.profileValue}>{getFieldValue(field)}</Text>
                            </View>
                            {index < detailFields.length - 1 && <View style={styles.separator} />}
                        </View>
                    ))}
                </View>

                {/* ─── Security Card ─── */}
                <View style={styles.detailsCard}>
                    <Text style={styles.sectionTitle}>{t("passwordProfile")}</Text>
                    <View style={styles.profileDetailItem}>
                        <View style={[styles.detailIconBox, { backgroundColor: "rgba(239, 68, 68, 0.1)" }]}>
                            <Ionicons name="lock-closed-outline" size={18} color="#EF4444" />
                        </View>
                        <Text style={styles.profileLabel}>{t("changePassword")}</Text>
                        <TouchableOpacity
                            style={styles.changePasswordButton}
                            onPress={() => setPasswordModalVisible(true)}
                        >
                            <Text style={styles.changePasswordText}>{t("changePassword")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── Delete Account ─── */}
                <TouchableOpacity
                    style={styles.deleteAccountButton}
                    onPress={() => setDeleteModalVisible(true)}
                >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.deleteAccountText}>{t("deleteAccount")}</Text>
                </TouchableOpacity>
            </ScrollView>

            <ChangePasswordModal
                visible={passwordModalVisible}
                onClose={() => setPasswordModalVisible(false)}
                onResult={handlePasswordResult}
            />

            <DeleteAccountModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onResult={handleDeleteResult}
            />

            <CustomAlert
                visible={alertConfig.visible}
                title={getAlertTitle()}
                message={getAlertMessage()}
                buttons={[{
                    text: t("close"),
                    style: getAlertButtonStyle(),
                    action: handleAlertClose
                }]}
            />
        </View>
    )
}

const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";