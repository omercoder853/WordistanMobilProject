import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export const formatNotificationTime = (createdAt, lang = 'tr') => {
    if (!createdAt) return '';
    try {
        const date = new Date(createdAt);
        const now = Date.now();
        const diffMs = Math.max(0, now - date.getTime());

        const diffMins = Math.floor(diffMs / (60 * 1000));
        const diffHours = Math.floor(diffMs / (60 * 60 * 1000));

        const isTr = lang.startsWith('tr');

        if (diffHours < 24) {
            if (diffMins < 1) {
                return isTr ? 'Az önce' : 'Just now';
            }
            if (diffMins < 60) {
                return isTr ? `${diffMins} dk önce` : `${diffMins}m ago`;
            }
            return isTr ? `${diffHours} sa önce` : `${diffHours}h ago`;
        } else if (diffHours < 48) {
            return isTr ? 'Dün' : 'Yesterday';
        } else {
            return date.toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    } catch {
        return '';
    }
};

const Notification = ({ item, onPress }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'tr';

    const title = item['title_' + lang] || item.title_tr || item.title_en || item.title || '';
    const description = item['description_' + lang] || item.description_tr || item.description_en || item.description || '';
    const timeFormatted = formatNotificationTime(item.created_at, lang);
    const isRead = !!item.is_read;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.cardContainer,
                isRead ? styles.readCard : styles.unreadCard
            ]}
        >
            {/* Left Icon */}
            <View style={[styles.iconContainer, isRead ? styles.readIconContainer : styles.unreadIconContainer]}>
                <Ionicons
                    name={isRead ? "notifications-outline" : "notifications"}
                    size={20}
                    color={isRead ? "#9CA3AF" : "#6D28D9"}
                />
            </View>

            {/* Content Area */}
            <View style={styles.contentContainer}>
                {/* Header Row: Title, Time, and Unread Dot */}
                <View style={styles.headerRow}>
                    <Text
                        style={[styles.titleText, isRead ? styles.readTitleText : styles.unreadTitleText]}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <View style={styles.timeBadgeContainer}>
                        <Text style={styles.timeText}>{timeFormatted}</Text>
                        {!isRead && <View style={styles.unreadDot} />}
                    </View>
                </View>

                {/* Description (max 2 lines) */}
                <Text
                    style={[styles.descriptionText, isRead ? styles.readDescriptionText : styles.unreadDescriptionText]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {description}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default Notification;

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderRadius: 16,
        marginVertical: 5,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    unreadCard: {
        backgroundColor: '#FAF7FF',
        borderWidth: 1,
        borderColor: '#E9D5FF',
        borderLeftWidth: 4,
        borderLeftColor: '#7C3AED',
    },
    readCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    unreadIconContainer: {
        backgroundColor: '#EDE9FE',
    },
    readIconContainer: {
        backgroundColor: '#F3F4F6',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    titleText: {
        fontSize: 15,
        flex: 1,
        marginRight: 8,
    },
    unreadTitleText: {
        fontWeight: '700',
        color: '#1F2937',
    },
    readTitleText: {
        fontWeight: '600',
        color: '#4B5563',
    },
    timeBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 11,
        color: '#8B5CF6',
        fontWeight: '500',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7C3AED',
        marginLeft: 6,
    },
    descriptionText: {
        fontSize: 13,
        lineHeight: 18,
    },
    unreadDescriptionText: {
        color: '#374151',
    },
    readDescriptionText: {
        color: '#6B7280',
    },
});
