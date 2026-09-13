import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contextapis/ThemeContext';

const QuickMenu = () => {
    const { colors } = useTheme();
    const qmColors = colors.home.quickMenu;
    const { t } = useTranslation();
    const navigation = useNavigation();

    const items = [
        {
            key: 'collections',
            title: t('collections'),
            iconComponent: <MaterialCommunityIcons name="bookshelf" size={24} color={qmColors.collectionsIcon} />,
            bg: qmColors.collectionsBg,
            onPress: () => navigation.navigate('Dictionaries', { screen: 'Collections' }),
        },
        {
            key: 'badges',
            title: t('badges'),
            iconComponent: <Ionicons name="trophy" size={22} color={qmColors.badgesIcon} />,
            bg: qmColors.badgesBg,
            onPress: () => navigation.navigate('Profile Navigation', { screen: 'Achievements' }),
        },
        {
            key: 'statistics',
            title: t('statistics'),
            iconComponent: <Ionicons name="stats-chart" size={22} color={qmColors.statsIcon} />,
            bg: qmColors.statsBg,
            onPress: () => navigation.navigate('Profile Navigation', { screen: 'Statistics' }),
        },
        {
            key: 'myGames',
            title: t('myGames'),
            iconComponent: <Ionicons name="game-controller" size={24} color={qmColors.gamesIcon} />,
            bg: qmColors.gamesBg,
            onPress: () => navigation.navigate('Profile Navigation', { screen: 'Game Sessions' }),
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.sectionTitle, { color: colors.home.sectionTitle }]}>{t('shortcuts')}</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        style={[
                            styles.card,
                            {
                                backgroundColor: qmColors.cardBg,
                                borderColor: qmColors.cardBorder,
                                shadowColor: qmColors.shadow,
                            }
                        ]}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                            {item.iconComponent}
                        </View>
                        <Text style={[styles.cardText, { color: qmColors.text }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default QuickMenu;

const styles = StyleSheet.create({
    container: {
        marginTop: 18,
        marginBottom: 8,
    },
    headerRow: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: -0.3,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    card: {
        width: 100,
        height: 102,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
        textAlign: 'center',
    },
});