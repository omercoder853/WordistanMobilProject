import {
    View, Modal, TextInput, Text, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,
    ActivityIndicator, StyleSheet, ScrollView, Image
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "@/contextapis/AuthContext";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";
import { AVATARS } from "@/constants/AvatarUrls";

const AVATAR_KEYS = Object.keys(AVATARS);

export default function EditProfileModal({ visible, onClose }) {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();
    const { showToast } = useFeedback();
    const { user, updateProfile } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [nickName, setNickName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("avatar_1");
    const [loading, setLoading] = useState(false);

    // Modal açıldığında mevcut user bilgilerini inputlara doldur
    useEffect(() => {
        if (visible && user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setNickName(user.nick_name || "");
            setSelectedAvatar(user.avatar_url || "avatar_1");
        }
    }, [visible, user]);

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    // Diff hesaplama: sadece değişen alanları payload olarak oluştur
    const buildDiffPayload = () => {
        const payload = {};
        if (firstName.trim() !== (user?.first_name || "").trim()) {
            payload.first_name = firstName.trim();
        }
        if (lastName.trim() !== (user?.last_name || "").trim()) {
            payload.last_name = lastName.trim();
        }
        if (nickName.trim() !== (user?.nick_name || "").trim()) {
            payload.nick_name = nickName.trim();
        }
        if (selectedAvatar !== (user?.avatar_url || "avatar_1")) {
            payload.avatar_url = selectedAvatar;
        }
        return payload;
    };

    const hasChanges = Object.keys(buildDiffPayload()).length > 0;

    const handleSubmit = async () => {
        if (loading) return;

        const payload = buildDiffPayload();

        // Hiçbir değişiklik yoksa API isteği atma
        if (Object.keys(payload).length === 0) {
            showToast(t('info'), t('noChangesToSave'), 'info');
            onClose();
            return;
        }

        setLoading(true);
        try {
            const ok = await updateProfile(payload);
            if (ok) {
                onClose();
            }
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
                                    {t('editProfile')}
                                </Text>
                                <TouchableOpacity onPress={handleClose} disabled={loading} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Ionicons name="close" size={22} color={dColors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Avatar Selection Section */}
                            <View style={styles.coverSectionHeader}>
                                <Text style={[styles.fieldLabel, { color: dColors.textSecondary, marginBottom: 0 }]}>
                                    {t('selectAvatar')}
                                </Text>
                                <View style={[styles.coverPreviewMini, { borderColor: dColors.cardBorder }]}>
                                    <Image
                                        source={AVATARS[selectedAvatar] || AVATARS["avatar_1"]}
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
                                {AVATAR_KEYS.map((avatarKey) => {
                                    const isSelected = selectedAvatar === avatarKey;
                                    return (
                                        <TouchableOpacity
                                            key={avatarKey}
                                            activeOpacity={0.75}
                                            disabled={loading}
                                            onPress={() => setSelectedAvatar(avatarKey)}
                                            style={[
                                                styles.coverItem,
                                                { borderColor: isSelected ? dColors.addBtnBg : dColors.cardBorder },
                                                isSelected && styles.coverItemSelected
                                            ]}
                                        >
                                            <Image
                                                source={AVATARS[avatarKey]}
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

                            {/* First Name Input */}
                            <Text style={[styles.fieldLabel, { color: dColors.textSecondary }]}>{t('nameProfile')}</Text>
                            <TextInput
                                placeholder={t('nameProfile')}
                                placeholderTextColor={dColors.searchBarPlaceholder}
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: dColors.searchBarBg,
                                        borderColor: dColors.searchBarBorder,
                                        color: dColors.textPrimary
                                    }
                                ]}
                                value={firstName}
                                editable={!loading}
                                onChangeText={setFirstName}
                            />

                            {/* Last Name Input */}
                            <Text style={[styles.fieldLabel, { color: dColors.textSecondary }]}>{t('surnameProfile')}</Text>
                            <TextInput
                                placeholder={t('surnameProfile')}
                                placeholderTextColor={dColors.searchBarPlaceholder}
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: dColors.searchBarBg,
                                        borderColor: dColors.searchBarBorder,
                                        color: dColors.textPrimary
                                    }
                                ]}
                                value={lastName}
                                editable={!loading}
                                onChangeText={setLastName}
                            />

                            {/* Nickname Input */}
                            <Text style={[styles.fieldLabel, { color: dColors.textSecondary }]}>{t('usernameProfile')}</Text>
                            <TextInput
                                placeholder={t('usernameProfile')}
                                placeholderTextColor={dColors.searchBarPlaceholder}
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: dColors.searchBarBg,
                                        borderColor: dColors.searchBarBorder,
                                        color: dColors.textPrimary
                                    }
                                ]}
                                value={nickName}
                                editable={!loading}
                                onChangeText={setNickName}
                            />

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
                                        (!hasChanges || loading) && styles.submitButtonDisabled
                                    ]}
                                    onPress={handleSubmit}
                                    disabled={!hasChanges || loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.submitButtonText}>
                                            {t('save')}
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
        width: 36,
        height: 36,
        borderRadius: 18,
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
        borderRadius: 26,
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
    actionButtonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
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
