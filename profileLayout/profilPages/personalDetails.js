import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import styles from "../profileStyle/profileDetailsStyle";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contextapis/AuthContext";
import { useNavigation } from "@react-navigation/native";
import ChangePasswordModal from "../profileComponents/ChangePasswordModal";
import DeleteAccountModal from "../profileComponents/DeleteAccountModal";
import CustomAlert from "../../commonComponents/customAlert/customAlert";

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

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Image style={styles.profilePhoto} source={imgSource} />
                <TouchableOpacity style={styles.editPhoto}>
                    <MaterialCommunityIcons name="image-edit-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.profileDetailContainer}>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("nameProfile")}</Text>
                    <Text style={styles.profileValue}>{user.first_name}</Text>
                </View>
                <View style={{ borderColor: '#F1F5F9', borderWidth: 1 }}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("surnameProfile")}</Text>
                    <Text style={styles.profileValue}>{user.last_name}</Text>
                </View>
                <View style={{ borderColor: '#F1F5F9', borderWidth: 1 }}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("emailProfile")}</Text>
                    <Text style={styles.profileValue}>{user.email}</Text>
                </View>
                <View style={{ borderColor: '#F1F5F9', borderWidth: 1 }}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("usernameProfile")}</Text>
                    <Text style={styles.profileValue}>{user.nick_name}</Text>
                </View>
                <View style={{ borderColor: '#F1F5F9', borderWidth: 1 }}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("genderProfile")}</Text>
                    <Text style={styles.profileValue}>{t(user.gender)}</Text>
                </View>
                <View style={{ borderColor: '#F1F5F9', borderWidth: 1 }}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("birthDateProfile")}</Text>
                    <Text style={styles.profileValue}>{user.birth_date}</Text>
                </View>
                <View style={{ borderColor: '#F1F5F9', borderWidth: 1 }}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("dateJoinedProfile")}</Text>
                    <Text style={styles.profileValue}>{user?.date_joined?.slice(0, 10)}</Text>
                </View>
                <View style={{ borderColor: '#F1F5F9', borderWidth: 1 }}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("passwordProfile")}</Text>
                    <TouchableOpacity style={styles.changePasswordButton} onPress={() => setPasswordModalVisible(true)}>
                        <Text style={{ color: 'white' }}>{t("changePassword")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.deleteAccountButton} onPress={() => setDeleteModalVisible(true)}>
                <Text style={{ textAlign: 'center', color: '#64748B' }}>{t("deleteAccount")}</Text>
            </TouchableOpacity>

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