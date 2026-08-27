import { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contextapis/AuthContext";

const { width } = Dimensions.get('window');

export default function ChangePasswordModal({ visible, onClose, onResult }) {
    const { t } = useTranslation();
    const { changePassword } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordRepeat("");
        setErrorMessage("");
        setLoading(false);
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    const handleChangePassword = async () => {
        setErrorMessage("");

        if (!currentPassword.trim() || !newPassword.trim() || !newPasswordRepeat.trim()) {
            setErrorMessage(t("fillAllFields"));
            return;
        }

        if (currentPassword === newPassword) {
            setErrorMessage(t("samePasswordError"));
            return;
        }

        if (newPassword !== newPasswordRepeat) {
            setErrorMessage(t("passwordsMustMatch"));
            return;
        }

        setLoading(true);
        const result = await changePassword(currentPassword, newPassword);
        setLoading(false);
        resetFields();
        onResult(result);
    };

    return (
        <Modal statusBarTranslucent={true} visible={visible} transparent animationType="fade">
            <View style={modalStyles.overlay}>
                <View style={modalStyles.container}>
                    <View style={modalStyles.iconContainer}>
                        <MaterialCommunityIcons name="alert" size={40} color="#F59E0B" />
                    </View>

                    <Text style={modalStyles.title}>{t("changePasswordModalTitle")}</Text>

                    <TextInput
                        style={modalStyles.input}
                        placeholder={t("currentPassword")}
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={modalStyles.input}
                        placeholder={t("newPassword")}
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={modalStyles.input}
                        placeholder={t("newPasswordRepeat")}
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={newPasswordRepeat}
                        onChangeText={setNewPasswordRepeat}
                    />

                    {errorMessage ? <Text style={modalStyles.errorText}>{errorMessage}</Text> : null}

                    <View style={modalStyles.buttonRow}>
                        <TouchableOpacity style={modalStyles.closeButton} onPress={handleClose} disabled={loading}>
                            <Text style={modalStyles.buttonText}>{t("close")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={modalStyles.submitButton} onPress={handleChangePassword} disabled={loading}>
                            {loading
                                ? <ActivityIndicator color="white" size="small" />
                                : <Text style={modalStyles.buttonText}>{t("changePasswordBtn")}</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
        marginBottom: 10,
        backgroundColor: '#F8FAFC',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
        width: '100%',
    },
    closeButton: {
        flex: 1,
        backgroundColor: '#6B7280',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#8e4a7c',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
});
