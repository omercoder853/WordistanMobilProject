import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useUserStats } from '@/contextapis/UserStatsContext';
import { useTheme } from '@/contextapis/ThemeContext';

const UserStatsBar = () => {
    const { colors } = useTheme();
    const statsColors = colors.home.statsBar;
    const { t } = useTranslation();
    const { userStats, pendingEarnedXP } = useUserStats();

    return (
        <View style={styles.statRow}>
            {/* Streak Card */}
            <TouchableOpacity
                style={[
                    styles.statItemButton,
                    {
                        backgroundColor: statsColors.cardBg,
                        borderColor: statsColors.cardBorder,
                        shadowColor: statsColors.shadow,
                    }
                ]}
                activeOpacity={0.7}
            >
                <View style={styles.statItemRow}>
                    <View style={[styles.iconBoxFire, { backgroundColor: statsColors.fireBg }]}>
                        <AntDesign name="fire" size={22} color={statsColors.fireIcon} />
                    </View>
                    <View style={styles.statColumn}>
                        <Text style={[styles.statValue, { color: statsColors.value }]}>{userStats?.current_streak || 0}</Text>
                        <Text style={[styles.statLabel, { color: statsColors.label }]}>{t('days')} {t('streak')}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* XP Card */}
            <TouchableOpacity
                style={[
                    styles.statItemButton,
                    {
                        backgroundColor: statsColors.cardBg,
                        borderColor: statsColors.cardBorder,
                        shadowColor: statsColors.shadow,
                    }
                ]}
                activeOpacity={0.7}
            >
                <View style={styles.statItemRow}>
                    <View style={[styles.iconBoxDiamond, { backgroundColor: statsColors.diamondBg }]}>
                        <FontAwesome name="diamond" size={20} color={statsColors.diamondIcon} />
                    </View>
                    <View style={styles.statColumn}>
                        <Text style={[styles.statValue, { color: statsColors.value }]}>{(userStats?.total_xp || 0) + (pendingEarnedXP || 0)}</Text>
                        <Text style={[styles.statLabel, { color: statsColors.label }]}>{t('xp')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default UserStatsBar;

const styles = StyleSheet.create({
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
        marginTop: 10,
    },
    statItemButton: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#FFFFFF',
        flex: 1,
        height: 72,
        justifyContent: 'center',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    statItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBoxFire: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: 'rgba(255, 138, 61, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBoxDiamond: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statColumn: {
        justifyContent: 'center',
    },
    statValue: {
        fontWeight: '800',
        fontSize: 18,
        color: '#1E293B',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
        marginTop: 1,
    },
});