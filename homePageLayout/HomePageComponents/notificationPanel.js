import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    RefreshControl,
    StyleSheet,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../contextapis/NotificationContext';
import Notification from './Notification';
import NotificationModal from './NotificationModal';

const { height } = Dimensions.get('window');

const NotificationPanel = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || 'tr';
    const isTr = lang.startsWith('tr');

    const {
        notifications = [],
        notificationPanel,
        setNotificationPanel,
        readAllNotifications,
        readNotification,
        getNotifications
    } = useNotification();

    const [selectedNotification, setSelectedNotification] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [readingAll, setReadingAll] = useState(false);

    const hasUnread = notifications.some(item => !item.is_read);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getNotifications();
        } catch (error) {
            console.error('Error refreshing notifications:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleReadAll = async () => {
        if (!hasUnread || readingAll) return;
        setReadingAll(true);
        try {
            await readAllNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        } finally {
            setReadingAll(false);
        }
    };

    const handleSelectNotification = (item) => {
        setSelectedNotification(item);
        if (!item.is_read) {
            readNotification(item.id).catch((err) => {
                console.error('Error marking notification as read:', err);
            });
        }
    };

    const handleClosePanel = () => {
        setNotificationPanel(false);
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="notifications-off-outline" size={48} color="#A78BFA" />
            </View>
            <Text style={styles.emptyTitle}>
                {isTr ? 'Henüz Bildirim Yok' : 'No Notifications Yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
                {isTr
                    ? 'Yeni bir bildirim aldığınızda burada listelenecektir.'
                    : 'When you receive a new notification, it will be listed here.'}
            </Text>
        </View>
    );

    return (
        <Modal
            visible={!!notificationPanel}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClosePanel}
        >
            <View style={styles.modalOverlay}>
                {/* Backdrop touch area to dismiss */}
                <TouchableOpacity
                    style={styles.backdropTouch}
                    activeOpacity={1}
                    onPress={handleClosePanel}
                />

                {/* Bottom Sheet Container */}
                <View style={styles.sheetContainer}>
                    {/* Drag Handle Indicator */}
                    <View style={styles.handleBarWrapper}>
                        <View style={styles.handleBar} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTitleRow}>
                            <Text style={styles.headerTitle}>
                                {isTr ? 'Bildirimler' : 'Notifications'}
                            </Text>
                            {notifications.length > 0 && (
                                <View style={styles.countBadge}>
                                    <Text style={styles.countBadgeText}>{notifications.length}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.headerActions}>
                            {/* Read All Button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleReadAll}
                                disabled={!hasUnread || readingAll}
                                style={[
                                    styles.readAllButton,
                                    !hasUnread && styles.readAllButtonDisabled
                                ]}
                            >
                                {readingAll ? (
                                    <ActivityIndicator size="small" color="#5B3FD3" />
                                ) : (
                                    <Text
                                        style={[
                                            styles.readAllText,
                                            !hasUnread && styles.readAllTextDisabled
                                        ]}
                                    >
                                        {isTr ? 'Tümünü Oku' : 'Read All'}
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Close Button */}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleClosePanel}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Notifications FlatList */}
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                        renderItem={({ item }) => (
                            <Notification
                                item={item}
                                onPress={() => handleSelectNotification(item)}
                            />
                        )}
                        contentContainerStyle={
                            notifications.length === 0 ? styles.emptyListContent : styles.listContent
                        }
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={renderEmptyComponent}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={['#5B3FD3']}
                                tintColor="#5B3FD3"
                            />
                        }
                    />
                </View>

                {/* Detail Modal */}
                <NotificationModal
                    visible={!!selectedNotification}
                    notification={selectedNotification}
                    onClose={() => setSelectedNotification(null)}
                />
            </View>
        </Modal>
    );
};

export default NotificationPanel;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'flex-end',
    },
    backdropTouch: {
        flex: 1,
    },
    sheetContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: height * 0.82,
        minHeight: height * 0.45,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 16,
        paddingBottom: 24,
    },
    handleBarWrapper: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handleBar: {
        width: 44,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#E5E7EB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    countBadge: {
        backgroundColor: '#EDE9FE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6D28D9',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    readAllButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#F5F0FF',
    },
    readAllButtonDisabled: {
        backgroundColor: '#F3F4F6',
        opacity: 0.6,
    },
    readAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5B3FD3',
    },
    readAllTextDisabled: {
        color: '#9CA3AF',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 8,
    },
    listContent: {
        paddingVertical: 6,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5EDFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 6,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    },
});
