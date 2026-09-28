import {
    View, Modal, TextInput, Text, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,
    ActivityIndicator, StyleSheet, ScrollView, Image
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useDictionary } from "../../../contextapis/DictContext";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";
import { COVERS } from "@/constants/DictionaryCovers";

const COVER_KEYS = Object.keys(COVERS);

export default function CreateDictionary({ visible, setVisible, initialData = null }) {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();
    const { showToast } = useFeedback();
    const { createDictionary, updateDictionary } = useDictionary();

    const isEditMode = Boolean(initialData?.id);

    const [dictName, setDictName] = useState("");
    const [dictDesc, setDictDesc] = useState("");
    const [dictLang, setDictLang] = useState("TR to ENG");
    const [selectedCover, setSelectedCover] = useState("dictionary_cover_1");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setDictName(initialData.name || "");
                setDictDesc(initialData.description || "");
                setDictLang(initialData.language || "TR to ENG");
                setSelectedCover(initialData.cover || "dictionary_cover_1");
            } else {
                setDictName("");
                setDictDesc("");
                setDictLang("TR to ENG");
                setSelectedCover("dictionary_cover_1");
            }
        }
    }, [visible, initialData]);

    const handleClose = () => {
        if (!loading) {
            setVisible(false);
            if (!isEditMode) {
                setDictName("");
                setDictDesc("");
                setSelectedCover("dictionary_cover_1");
            }
        }
    };

    const hasChanges = isEditMode
        ? (dictName.trim() !== (initialData?.name || "").trim() ||
           dictDesc.trim() !== (initialData?.description || "").trim() ||
           selectedCover !== (initialData?.cover || "dictionary_cover_1"))
        : true;

    const isFormValid = dictName.trim().length >= 3 && dictDesc.trim().length > 0 && hasChanges;

    const handleSubmit = async () => {
        const trimmedName = dictName.trim();
        const trimmedDesc = dictDesc.trim();

        if (!trimmedName || !trimmedDesc || loading) return;

        if (trimmedName.length < 3) {
            showToast(t('warning'), t('nameMinLength'), 'warning');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                const payload = {};
                if (trimmedName !== (initialData?.name || "").trim()) {
                    payload.name = trimmedName;
                }
                if (trimmedDesc !== (initialData?.description || "").trim()) {
                    payload.description = trimmedDesc;
                }
                if (selectedCover !== (initialData?.cover || "dictionary_cover_1")) {
                    payload.cover = selectedCover;
                }

                if (Object.keys(payload).length === 0) {
                    showToast(t('info'), t('noChangesToSave'), 'info');
                    setVisible(false);
                    return;
                }

                const ok = await updateDictionary(initialData.id, payload);
                if (ok) {
                    setVisible(false);
                }
            } else {
                const ok = await createDictionary({
                    name: trimmedName,
                    description: trimmedDesc,
                    language: dictLang,
                    cover: selectedCover
                });
                if (ok) {
                    setDictName("");
                    setDictDesc("");
                    setSelectedCover("dictionary_cover_1");
                    setVisible(false);
                }
            }
        } catch (error) {
            console.error("Dictionary submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            statusBarTranslucent={true}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={"padding"}
                style={styles.keyboardAvoid}>
                <ScrollView
                    contentContainerStyle={[
                        styles.overlay,
                        { backgroundColor: dColors.modalOverlay }]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag">

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={[styles.modalCard, { backgroundColor: dColors.modalBg, shadowColor: dColors.cardShadow }]}>
                            {/* Modal Header */}
                            <View style={[styles.headerRow, { borderBottomColor: dColors.cardBorder }]}>
                                <Text style={[styles.modalTitle, { color: dColors.modalTitle }]}>
                                    {isEditMode ? t('editDictionary') : t('createNewDictionary')}
                                </Text>
                                <TouchableOpacity onPress={handleClose} disabled={loading} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Ionicons name="close" size={22} color={dColors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Cover Selection Section */}
                            <View style={styles.coverSectionHeader}>
                                <Text style={[styles.fieldLabel, { color: dColors.textSecondary, marginBottom: 0 }]}>
                                    {t('selectCover')}
                                </Text>
                                <View style={[styles.coverPreviewMini, { borderColor: dColors.cardBorder }]}>
                                    <Image
                                        source={COVERS[selectedCover] || COVERS["dictionary_cover_1"]}
                                        style={styles.coverPreviewMiniImg}
                                    />
                                </View>
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.coverListContainer}
                                style={styles.coverScrollView}
                            >
                                {COVER_KEYS.map((coverKey) => {
                                    const isSelected = selectedCover === coverKey;
                                    return (
                                        <TouchableOpacity
                                            key={coverKey}
                                            activeOpacity={0.75}
                                            disabled={loading}
                                            onPress={() => setSelectedCover(coverKey)}
                                            style={[
                                                styles.coverItem,
                                                { borderColor: isSelected ? dColors.addBtnBg : dColors.cardBorder },
                                                isSelected && styles.coverItemSelected
                                            ]}
                                        >
                                            <Image
                                                source={COVERS[coverKey]}
                                                style={styles.coverItemImage}
                                            />
                                            {isSelected && (
                                                <View style={[styles.checkBadge, { backgroundColor: dColors.addBtnBg }]}>
                                                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

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

                            {/* Language Switcher or Locked Indicator */}
                            <Text style={[styles.fieldLabel, { color: dColors.textSecondary }]}>{t('dictionaryLanguage')}</Text>
                            {isEditMode ? (
                                <View style={[styles.lockedLangContainer, { backgroundColor: dColors.modalItemBg, borderColor: dColors.cardBorder }]}>
                                    <Ionicons name="lock-closed" size={14} color={dColors.textSecondary} />
                                    <Text style={[styles.lockedLangText, { color: dColors.textSecondary }]}>
                                        {dictLang === "TR to ENG" ? "TR → ENG" : "ENG → TR"}
                                    </Text>
                                </View>
                            ) : (
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
                            )}

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
                                    onPress={handleSubmit}
                                    disabled={!isFormValid || loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>
                                            {isEditMode ? t('save') : t('create')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexGrow: 1
    },
    keyboardAvoid: {
        flex: 1,
    },
    modalCard: {
        width: '100%',
        maxWidth: 370,
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
        marginBottom: 12,
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
    coverSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: 8,
    },
    coverPreviewMini: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 1.5,
        overflow: 'hidden',
    },
    coverPreviewMiniImg: {
        width: '100%',
        height: '100%',
    },
    coverScrollView: {
        marginBottom: 12,
    },
    coverListContainer: {
        gap: 10,
        paddingVertical: 4,
        paddingHorizontal: 2,
    },
    coverItem: {
        width: 52,
        height: 52,
        borderRadius: 12,
        borderWidth: 2,
        overflow: 'hidden',
        position: 'relative',
    },
    coverItemSelected: {
        transform: [{ scale: 1.05 }],
    },
    coverItemImage: {
        width: '100%',
        height: '100%',
    },
    checkBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
    lockedLangContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 20,
        gap: 8,
    },
    lockedLangText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.3,
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