import React, { useState, useMemo } from "react";
import { View, Text, ImageBackground, Dimensions, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from '@expo/vector-icons/Ionicons';
import Achievement from "../components/AchievementListItem";
import AchievementFilterModal, { DEFAULT_ACHIEVEMENT_FILTERS } from "../components/AchievementFilterModal";
import { useAchievements } from "@/contextapis/AchievementsContext";
import { useUserStats } from "@/contextapis/UserStatsContext";
import { useTheme } from "@/contextapis/ThemeContext";
import { useAuth } from "@/contextapis/AuthContext";

export default function Achievements() {
    const { achievements, isAlreadyEarned } = useAchievements();
    const { userStats } = useUserStats();
    const { isGuest } = useAuth();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { width: screenWidth } = Dimensions.get('window');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_ACHIEVEMENT_FILTERS);

    // 1. Pre-computation (Zenginleştirilmiş Liste): Her render'da döngüye girmemek için önceden tek seferde hesaplanır
    const enrichedAchievements = useMemo(() => {
        const currentSaved = userStats?.saved_words || 0;
        const currentTranslated = userStats?.translated_words || 0;
        const currentDicts = userStats?.dict_created || 0;

        return (achievements || []).map((ach) => {
            let progress = 0;
            if (ach.target_field === 'saved_words') progress = currentSaved;
            else if (ach.target_field === 'translated_words') progress = currentTranslated;
            else if (ach.target_field === 'dict_created' || ach.target_field === 'created_dicts' || ach.target_field === 'dict_created_count') progress = currentDicts;
            else progress = (userStats?.[ach.target_field] || 0);

            const isEarned = Boolean((isAlreadyEarned && isAlreadyEarned(ach.id)) || (ach.target_value && progress >= ach.target_value));
            const targetVal = ach.target_value || 1;
            const percentage = isEarned ? 100 : Math.min(100, Math.round((progress / targetVal) * 100));

            return {
                ...ach,
                _progress: progress,
                _isEarned: isEarned,
                _percentage: percentage,
                _xp: Number(ach.xp_reward) || 0,
                _type: (ach.type || 'bronze').toLowerCase(),
            };
        });
    }, [achievements, userStats, isAlreadyEarned]);

    // 2. Başarım Özeti (Summary Counts): Zenginleştirilmiş veri üzerinden hızlı sayaç
    const counts = useMemo(() => {
        return enrichedAchievements.reduce((acc, ach) => {
            if (ach._isEarned && ach._type) {
                acc[ach._type] = (acc[ach._type] || 0) + 1;
            }
            return acc;
        }, { bronze: 0, silver: 0, gold: 0 });
    }, [enrichedAchievements]);

    // 3. Client-side Filtreleme ve Sıralama: Ağ isteği atmaksızın anlık ve yüksek performanslı
    const filteredAchievements = useMemo(() => {
        let result = enrichedAchievements.filter((ach) => {
            // Durum Filtresi (Kazandıkları - default, Kazanmadıkları, Tümü)
            if (filters.status === 'earned' && !ach._isEarned) return false;
            if (filters.status === 'unearned' && ach._isEarned) return false;

            // Tür Filtresi (all, bronze, silver, gold)
            if (filters.type !== 'all' && ach._type !== filters.type) return false;

            return true;
        });

        // Sıralama (Yüzde veya XP)
        if (filters.sortBy === 'percentage_desc') {
            result.sort((a, b) => b._percentage - a._percentage);
        } else if (filters.sortBy === 'percentage_asc') {
            result.sort((a, b) => a._percentage - b._percentage);
        } else if (filters.sortBy === 'xp_desc') {
            result.sort((a, b) => b._xp - a._xp);
        } else if (filters.sortBy === 'xp_asc') {
            result.sort((a, b) => a._xp - b._xp);
        }

        return result;
    }, [enrichedAchievements, filters]);

    const isFilterActive =
        filters.status !== DEFAULT_ACHIEVEMENT_FILTERS.status ||
        filters.type !== DEFAULT_ACHIEVEMENT_FILTERS.type ||
        filters.sortBy !== DEFAULT_ACHIEVEMENT_FILTERS.sortBy;

    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.common.background}}>
            <View style={[styles.achievementSumMainContainer, { backgroundColor: colors.profile.cardBg , borderColor:colors.profile.cardBorder}]}>
                <Text style={[styles.achievementSumTitle, { color: colors.profile.textPrimary }]}>{t("achievementSummary")}</Text>
                <View style={styles.achievementSumContainer}>
                    <ImageBackground style={styles.achievementSumCover}
                        resizeMode="contain" imageStyle={{ resizeMode: 'contain' }}
                        source={require("../assets/bronze.png")}>
                        <Text style={styles.achievementCount}>{counts.bronze || 0}</Text>
                    </ImageBackground>
                    <ImageBackground style={styles.achievementSumCover}
                        resizeMode="contain" imageStyle={{ resizeMode: 'contain' }}
                        source={require("../assets/silver.png")}>
                        <Text style={[styles.achievementCount, { top: '28%' }]}>{counts.silver || 0}</Text>
                    </ImageBackground>
                    <ImageBackground style={styles.achievementSumCover}
                        resizeMode="contain" imageStyle={{ resizeMode: 'contain' }}
                        source={require("../assets/gold.png")}>
                        <Text style={styles.achievementCount}>{counts.gold || 0}</Text>
                    </ImageBackground>
                </View>
            </View>

            <View style={{ flexDirection: 'row', width: '90%', marginTop: 15, alignItems: 'center' }}>
                <Text style={[styles.mainTitle, { color: colors.profile.textPrimary }]}>{t("achievements")}</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsFilterModalOpen(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.filterButton}
                >
                    <Ionicons
                        name={isFilterActive ? "filter" : "filter-sharp"}
                        size={screenWidth * 0.07}
                        color={isFilterActive ? colors.common.primary : colors.profile.textPrimary}
                    />
                    {isFilterActive && (
                        <View style={[styles.filterActiveDot, { backgroundColor: colors.common.primary }]} />
                    )}
                </TouchableOpacity>
            </View>

            <View style={{ borderWidth: 1, borderColor: colors.profile.separator, width: '90%', marginVertical: 10 }} />

            {isGuest ? (
                <View style={[
                    styles.infoState,
                    { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder },
                ]}>
                    <Ionicons name="warning" size={42} color={colors.common.primary} />
                    <Text style={[styles.infoStateTitle, { color: colors.profile.textPrimary }]}>
                        {t("guestAchievementsTitle")}
                    </Text>
                    <Text style={[styles.infoStateMessage, { color: colors.profile.textSecondary }]}>
                        {t("guestAchievementsMessage")}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredAchievements}
                    keyExtractor={(item) => item.id?.toString()}
                    style={{ width: '100%' }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    ListEmptyComponent={
                        achievements && achievements.length > 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="filter-outline" size={42} color={colors.profile.textSecondary} />
                                <Text style={[styles.infoStateTitle, { color: colors.profile.textPrimary }]}>
                                    {t("noFilteredAchievementsTitle")}
                                </Text>
                                <Text style={[styles.infoStateMessage, { color: colors.profile.textSecondary }]}>
                                    {t("noFilteredAchievementsMessage")}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="alert-circle-outline" size={42} color={colors.common.warning} />
                                <Text style={[styles.infoStateTitle, { color: colors.profile.textPrimary }]}>
                                    {t("achievementsLoadErrorTitle")}
                                </Text>
                                <Text style={[styles.infoStateMessage, { color: colors.profile.textSecondary }]}>
                                    {t("achievementsLoadErrorMessage")}
                                </Text>
                            </View>
                        )
                    }
                    renderItem={({ item }) => (
                        <Achievement ach={item} isEarned={item._isEarned} />
                    )}
                />
            )}

            <AchievementFilterModal
                visible={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={filters}
                onApply={(newFilters) => setFilters(newFilters)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    achievementSumMainContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        paddingTop: 5,
        borderWidth:1
    },
    achievementSumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '95%',
        alignItems: 'center',
    },
    achievementSumCover: {
        flex: 1,
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    achievementCount: {
        position: 'absolute',
        top: '30%',
        width: '50%',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '900',
        color: 'white',
    },
    achievementSumTitle: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center'
    },
    mainTitle: {
        fontSize: 25,
    },
    infoState: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        marginTop: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 10,
    },
    emptyState: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 10,
    },
    infoStateTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    infoStateMessage: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
    filterButton: {
        marginLeft: 'auto',
        position: 'relative',
        padding: 4,
    },
    filterActiveDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});