import {
    View, Modal, TextInput, Text, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,
    ActivityIndicator, Platform, StyleSheet
} from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useDictionary } from "../../../contextapis/DictContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function CreateDictionary({ visible, setVisible }) {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();
    const [dictName, setDictName] = useState("");
    const [dictDesc, setDictDesc] = useState("");
    const [dictLang, setDictLang] = useState("TR to ENG");
    const [loading, setLoading] = useState(false);
    const { createDictionary } = useDictionary();

    const handleCreate = async () => {
        if (!dictName.trim() || !dictDesc.trim() || loading) return;
        setLoading(true);
        try {
            await createDictionary({ name: dictName.trim(), description: dictDesc.trim(), language: dictLang });
            setDictName("");
            setDictDesc("");
            setVisible(false);
        } catch (error) {
            console.error("Create dictionary error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setVisible(false);
            setDictName("");
            setDictDesc("");
        }
    };

    const isFormValid = dictName.trim().length > 0 && dictDesc.trim().length > 0;

    return (
        <Modal
            visible={visible}
            statusBarTranslucent={true}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.overlay, { backgroundColor: dColors.modalOverlay }]}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.keyboardAvoid}
                    >
                        <View style={[styles.modalCard, { backgroundColor: dColors.modalBg, shadowColor: dColors.cardShadow }]}>
                            {/* Modal Header */}
                            <View style={[styles.headerRow, { borderBottomColor: dColors.cardBorder }]}>
                                <Text style={[styles.modalTitle, { color: dColors.modalTitle }]}>{t('createNewDictionary')}</Text>
                                <TouchableOpacity onPress={handleClose} disabled={loading} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Ionicons name="close" size={22} color={dColors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Name Input */}
                            <Text style={[styles.fieldLabel, { color: dColors.textSecondary }]}>{t('dictionaryName')}</Text>
                            <TextInput
                                placeholder={t('enterName')}
                                placeholderTextColor={dColors.searchBarPlaceholder}
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: dColors.searchBarBg,
                                        borderColor: dColors.searchBarBorder,
                                        color: dColors.textPrimary
                                    }
                                ]}
                                value={dictName}
                                editable={!loading}
                                onChangeText={setDictName}
                            />

                            {/* Description Input */}
                            <Text style={[styles.fieldLabel, { color: dColors.textSecondary }]}>{t('dictionaryDescription')}</Text>
                            <TextInput
                                placeholder={t('enterShortDescription')}
                                placeholderTextColor={dColors.searchBarPlaceholder}
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: dColors.searchBarBg,
                                        borderColor: dColors.searchBarBorder,
                                        color: dColors.textPrimary
                                    }
                                ]}
                                value={dictDesc}
                                editable={!loading}
                                onChangeText={setDictDesc}
                            />

                            {/* Language Switcher */}
                            <Text style={[styles.fieldLabel, { color: dColors.textSecondary }]}>{t('dictionaryLanguage')}</Text>
                            <View style={[styles.langSegmentContainer, { backgroundColor: dColors.modalItemBg, borderColor: dColors.cardBorder }]}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setDictLang("TR to ENG")}
                                    disabled={loading}
                                    style={[
                                        styles.langSegmentTab,
                                        dictLang === "TR to ENG" && [styles.langSegmentActive, { backgroundColor: dColors.tabActive }]
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.langSegmentText,
                                            { color: dictLang === "TR to ENG" ? "#FFFFFF" : dColors.textSecondary }
                                        ]}
                                    >
                                        TR → ENG
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setDictLang("ENG to TR")}
                                    disabled={loading}
                                    style={[
                                        styles.langSegmentTab,
                                        dictLang === "ENG to TR" && [styles.langSegmentActive, { backgroundColor: dColors.tabActive }]
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.langSegmentText,
                                            { color: dictLang === "ENG to TR" ? "#FFFFFF" : dColors.textSecondary }
                                        ]}
                                    >
                                        ENG → TR
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionButtonRow}>
                                <TouchableOpacity
                                    style={[styles.cancelButton, { backgroundColor: dColors.modalItemBg, borderColor: dColors.cardBorder }]}
                                    onPress={handleClose}
                                    disabled={loading}
                                >
                                    <Text style={[styles.cancelButtonText, { color: dColors.textSecondary }]}>{t('cancel')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        { backgroundColor: dColors.addBtnBg },
                                        (!isFormValid || loading) && styles.submitButtonDisabled
                                    ]}
                                    onPress={handleCreate}
                                    disabled={!isFormValid || loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>{t('create')}</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    keyboardAvoid: {
        width: '100%',
        alignItems: 'center',
    },
    modalCard: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 24,
        padding: 22,
        elevation: 12,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
        marginBottom: 16,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 6,
    },
    textInput: {
        borderRadius: 14,
        borderWidth: 1.5,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        marginBottom: 8,
    },
    langSegmentContainer: {
        flexDirection: 'row',
        borderRadius: 14,
        borderWidth: 1,
        padding: 4,
        marginBottom: 20,
        gap: 6,
    },
    langSegmentTab: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    langSegmentActive: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    langSegmentText: {
        fontSize: 13,
        fontWeight: '700',
    },
    actionButtonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});