import { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contextapis/AuthContext";

const { width } = Dimensions.get('window');

export default function DeleteAccountModal({ visible, onClose, onResult }) {
    const { t } = useTranslation();
    const { deleteAccount } = useAuth();

    const [step, setStep] = useState(1);
    const [confirmText, setConfirmText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const resetFields = () => {
        setStep(1);
        setConfirmText("");
        setErrorMessage("");
        setLoading(false);
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    const handleDeleteAccount = async () => {
        const expectedText = t("deleteAccountConfirmPlaceholder");
        if (confirmText.trim() !== expectedText) {
            setErrorMessage(t("deleteAccountConfirmMismatch"));
            return;
        }

        setLoading(true);
        const result = await deleteAccount();
        setLoading(false);
        resetFields();
        onResult(result);
    };

    return (
        <Modal statusBarTranslucent={true} visible={visible} transparent animationType="fade">
            <View style={modalStyles.overlay}>
                <View style={modalStyles.container}>
                    <View style={modalStyles.iconContainer}>
                        <MaterialCommunityIcons name="alert-octagon" size={40} color="#EF4444" />
                    </View>

                    <Text style={modalStyles.title}>{t("deleteAccountModalTitle")}</Text>

                    {step === 1 ? (
                        <>
                            <Text style={modalStyles.message}>{t("deleteAccountConfirmQuestion")}</Text>

                            <View style={modalStyles.buttonRow}>
                                <TouchableOpacity style={modalStyles.closeButton} onPress={handleClose}>
                                    <Text style={modalStyles.buttonText}>{t("close")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={modalStyles.dangerButton} onPress={() => setStep(2)}>
                                    <Text style={modalStyles.buttonText}>{t("deleteAccountProceed")}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={modalStyles.message}>{t("deleteAccountConfirmLabel")}</Text>

                            <TextInput
                                style={modalStyles.input}
                                placeholder={t("deleteAccountConfirmPlaceholder")}
                                placeholderTextColor="#94A3B8"
                                autoCapitalize="characters"
                                value={confirmText}
                                onChangeText={setConfirmText}
                            />

                            {errorMessage ? <Text style={modalStyles.errorText}>{errorMessage}</Text> : null}

                            <View style={modalStyles.buttonRow}>
                                <TouchableOpacity style={modalStyles.closeButton} onPress={handleClose} disabled={loading}>
                                    <Text style={modalStyles.buttonText}>{t("close")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={modalStyles.dangerButton} onPress={handleDeleteAccount} disabled={loading}>
                                    {loading
                                        ? <ActivityIndicator color="white" size="small" />
                                        : <Text style={modalStyles.buttonText}>{t("deleteAccountDeleteBtn")}</Text>}
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
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
        marginBottom: 15,
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
        marginBottom: 10,
        backgroundColor: '#FEF2F2',
        textAlign: 'center',
        letterSpacing: 2,
        fontWeight: '600',
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
    dangerButton: {
        flex: 1,
        backgroundColor: '#EF4444',
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
