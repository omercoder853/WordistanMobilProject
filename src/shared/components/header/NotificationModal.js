import React, { useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { formatNotificationTime } from '@/shared/components/header/Notification';
import { useTheme } from '@/contextapis/ThemeContext';

const { width } = Dimensions.get('window');

const NotificationModal = ({ visible, notification, onClose }) => {
    const { colors } = useTheme();
    const nmColors = colors.notificationModal;
    const styles = useMemo(() => getStyles(nmColors), [nmColors]);

    const { i18n } = useTranslation();
    const lang = i18n.language || 'tr';

    if (!notification) return null;

    const title = notification['title_' + lang] || notification.title_tr || notification.title_en || notification.title || '';
    const description = notification['description_' + lang] || notification.description_tr || notification.description_en || notification.description || '';
    const timeFormatted = formatNotificationTime(notification.created_at, lang);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalCard}>
                        {/* Header: Icon, Time and Close Button */}
                        <View style={styles.header}>
                            <View style={styles.headerLeft}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="notifications" size={22} color={nmColors.iconCircleIcon} />
                                </View>
                                {timeFormatted ? (
                                    <View style={styles.timeContainer}>
                                        <Ionicons name="time-outline" size={13} color={nmColors.timeIcon} style={{ marginRight: 4 }} />
                                        <Text style={styles.timeText}>{timeFormatted}</Text>
                                    </View>
                                ) : null}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onClose}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={20} color={nmColors.closeBtnIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* Title */}
                        <Text style={styles.titleText}>{title}</Text>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Description Scrollable Body */}
                        <ScrollView
                            style={styles.scrollArea}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <Text style={styles.descriptionText}>{description}</Text>
                        </ScrollView>

                        {/* Bottom Action Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={onClose}
                            style={styles.actionButton}
                        >
                            <Text style={styles.actionButtonText}>
                                {lang.startsWith('tr') ? 'Kapat' : 'Close'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

export default NotificationModal;

const getStyles = (nmColors) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: nmColors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: width * 0.88,
        maxHeight: '75%',
        backgroundColor: nmColors.cardBg,
        borderRadius: 24,
        padding: 20,
        shadowColor: nmColors.cardShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: nmColors.iconCircleBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: nmColors.timeContainerBg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    timeText: {
        fontSize: 12,
        color: nmColors.timeText,
        fontWeight: '600',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: nmColors.closeBtnBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: '700',
        color: nmColors.title,
        lineHeight: 24,
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: nmColors.divider,
        marginVertical: 10,
    },
    scrollArea: {
        maxHeight: 260,
        marginVertical: 4,
    },
    scrollContent: {
        paddingVertical: 4,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 22,
        color: nmColors.description,
    },
    actionButton: {
        backgroundColor: nmColors.actionBtnBg,
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    actionButtonText: {
        color: nmColors.actionBtnText,
        fontSize: 15,
        fontWeight: '700',
    },
});
