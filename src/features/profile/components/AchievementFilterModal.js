import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    StyleSheet,
    Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

const { height: screenHeight } = Dimensions.get("window");

export const DEFAULT_ACHIEVEMENT_FILTERS = {
    status: "all", // 'earned' (Kazandıkları - DEFAULT), 'unearned', 'all'
    type: "all",      // 'all', 'bronze', 'silver', 'gold'
    sortBy: "default",// 'default', 'percentage_desc', 'percentage_asc', 'xp_desc', 'xp_asc'
};

export default function AchievementFilterModal({
    visible,
    onClose,
    currentFilters = DEFAULT_ACHIEVEMENT_FILTERS,
    onApply,
}) {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    // Modal içi geçici state (Kullanıcı 'Uygula' diyene kadar değişiklikleri tutar)
    const [localFilters, setLocalFilters] = useState(DEFAULT_ACHIEVEMENT_FILTERS);

    useEffect(() => {
        if (visible) {
            setLocalFilters(currentFilters || DEFAULT_ACHIEVEMENT_FILTERS);
        }
    }, [visible, currentFilters]);

    const handleApply = () => {
        if (onApply) {
            onApply(localFilters);
        }
        onClose();
    };

    const handleReset = () => {
        setLocalFilters(DEFAULT_ACHIEVEMENT_FILTERS);
    };

    const updateFilter = (key, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View
                    style={[
                        styles.bottomSheetContainer,
                        {
                            backgroundColor: colors.profile.cardBg || (isDark ? "#1E1E24" : "#FFFFFF"),
                            borderColor: colors.profile.cardBorder || (isDark ? "#2A2B36" : "#F1F5F9"),
                        }
                    ]}
                >
                    {/* Sürükleme İndikatörü */}
                    <View style={styles.indicatorContainer}>
                        <View
                            style={[
                                styles.indicator,
                                { backgroundColor: isDark ? "#3A3B4A" : "#E2E8F0" }
                            ]}
                        />
                    </View>

                    {/* Başlık ve Kapatma (Çarpı) Butonu */}
                    <View style={[styles.header, { borderBottomColor: colors.profile.separator || "#E2E8F0" }]}>
                        <View style={styles.headerTitleRow}>
                            <Ionicons
                                name="options-outline"
                                size={22}
                                color={colors.common.primary}
                                style={{ marginRight: 8 }}
                            />
                            <Text style={[styles.headerTitle, { color: colors.profile.textPrimary }]}>
                                {t("filterAchievements")}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[
                                styles.closeButton,
                                { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9" }
                            ]}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={20} color={colors.profile.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollArea}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* 1. DURUM (Tamamlanan / Tamamlanmayan / Tümü) */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.profile.textPrimary }]}>
                                {t("filterStatus")}
                            </Text>
                            <View style={styles.chipRow}>
                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => updateFilter("status", "earned")}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: localFilters.status === "earned"
                                                ? (colors.common.primarySubtle || "rgba(91, 63, 211, 0.12)")
                                                : (isDark ? "#2A2B36" : "#F8FAFC"),
                                            borderColor: localFilters.status === "earned"
                                                ? colors.common.primary
                                                : (isDark ? "#333544" : "#E2E8F0"),
                                        }
                                    ]}
                                >
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={16}
                                        color={localFilters.status === "earned" ? colors.common.primary : colors.profile.textSecondary}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text
                                        style={[
                                            styles.chipText,
                                            {
                                                color: localFilters.status === "earned"
                                                    ? colors.common.primary
                                                    : colors.profile.textSecondary,
                                                fontWeight: localFilters.status === "earned" ? "700" : "500",
                                            }
                                        ]}
                                    >
                                        {t("filterEarned")}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => updateFilter("status", "unearned")}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: localFilters.status === "unearned"
                                                ? (colors.common.primarySubtle || "rgba(91, 63, 211, 0.12)")
                                                : (isDark ? "#2A2B36" : "#F8FAFC"),
                                            borderColor: localFilters.status === "unearned"
                                                ? colors.common.primary
                                                : (isDark ? "#333544" : "#E2E8F0"),
                                        }
                                    ]}
                                >
                                    <Ionicons
                                        name="hourglass-outline"
                                        size={16}
                                        color={localFilters.status === "unearned" ? colors.common.primary : colors.profile.textSecondary}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text
                                        style={[
                                            styles.chipText,
                                            {
                                                color: localFilters.status === "unearned"
                                                    ? colors.common.primary
                                                    : colors.profile.textSecondary,
                                                fontWeight: localFilters.status === "unearned" ? "700" : "500",
                                            }
                                        ]}
                                    >
                                        {t("filterUnearned")}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.75}
                                    onPress={() => updateFilter("status", "all")}
                                    style={[
                                        styles.chip,
                                        {
                                            backgroundColor: localFilters.status === "all"
                                                ? (colors.common.primarySubtle || "rgba(91, 63, 211, 0.12)")
                                                : (isDark ? "#2A2B36" : "#F8FAFC"),
                                            borderColor: localFilters.status === "all"
                                                ? colors.common.primary
                                                : (isDark ? "#333544" : "#E2E8F0"),
                                        }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            {
                                                color: localFilters.status === "all"
                                                    ? colors.common.primary
                                                    : colors.profile.textSecondary,
                                                fontWeight: localFilters.status === "all" ? "700" : "500",
                                            }
                                        ]}
                                    >
                                        {t("filterAll")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 2. TÜR (Bronz / Gümüş / Altın / Tümü) */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.profile.textPrimary }]}>
                                {t("filterTier")}
                            </Text>
                            <View style={styles.chipRow}>
                                {[
                                    { key: "all", label: t("filterAll") },
                                    { key: "bronze", label: t("tierBronze"), color: "#C2410C" },
                                    { key: "silver", label: t("tierSilver"), color: "#64748B" },
                                    { key: "gold", label: t("tierGold"), color: "#D97706" },
                                ].map((tier) => {
                                    const isSelected = localFilters.type === tier.key;
                                    return (
                                        <TouchableOpacity
                                            key={tier.key}
                                            activeOpacity={0.75}
                                            onPress={() => updateFilter("type", tier.key)}
                                            style={[
                                                styles.chip,
                                                {
                                                    backgroundColor: isSelected
                                                        ? (colors.common.primarySubtle || "rgba(91, 63, 211, 0.12)")
                                                        : (isDark ? "#2A2B36" : "#F8FAFC"),
                                                    borderColor: isSelected
                                                        ? colors.common.primary
                                                        : (isDark ? "#333544" : "#E2E8F0"),
                                                }
                                            ]}
                                        >
                                            {tier.color && (
                                                <View
                                                    style={[
                                                        styles.tierDot,
                                                        { backgroundColor: tier.color }
                                                    ]}
                                                />
                                            )}
                                            <Text
                                                style={[
                                                    styles.chipText,
                                                    {
                                                        color: isSelected
                                                            ? colors.common.primary
                                                            : colors.profile.textSecondary,
                                                        fontWeight: isSelected ? "700" : "500",
                                                    }
                                                ]}
                                            >
                                                {tier.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* 3. SIRALAMA (Tamamlanma Yüzdesi & XP) */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.profile.textPrimary }]}>
                                {t("filterSort")}
                            </Text>
                            <View style={styles.sortList}>
                                {[
                                    { key: "default", label: t("filterSortDefault"), icon: "reorder-three-outline" },
                                    { key: "percentage_desc", label: t("filterSortPercentageDesc"), icon: "trending-down-outline" },
                                    { key: "percentage_asc", label: t("filterSortPercentageAsc"), icon: "trending-up-outline" },
                                    { key: "xp_desc", label: t("filterSortXpDesc"), icon: "flash" },
                                    { key: "xp_asc", label: t("filterSortXpAsc"), icon: "flash-outline" },
                                ].map((sortOption) => {
                                    const isSelected = localFilters.sortBy === sortOption.key;
                                    return (
                                        <TouchableOpacity
                                            key={sortOption.key}
                                            activeOpacity={0.75}
                                            onPress={() => updateFilter("sortBy", sortOption.key)}
                                            style={[
                                                styles.sortOptionItem,
                                                {
                                                    backgroundColor: isSelected
                                                        ? (colors.common.primarySubtle || "rgba(91, 63, 211, 0.08)")
                                                        : (isDark ? "#2A2B36" : "#F8FAFC"),
                                                    borderColor: isSelected
                                                        ? colors.common.primary
                                                        : (isDark ? "#333544" : "#E2E8F0"),
                                                }
                                            ]}
                                        >
                                            <View style={styles.sortOptionLeft}>
                                                <Ionicons
                                                    name={sortOption.icon}
                                                    size={18}
                                                    color={isSelected ? colors.common.primary : colors.profile.textSecondary}
                                                    style={{ marginRight: 10 }}
                                                />
                                                <Text
                                                    style={[
                                                        styles.sortOptionText,
                                                        {
                                                            color: isSelected
                                                                ? colors.common.primary
                                                                : colors.profile.textPrimary,
                                                            fontWeight: isSelected ? "700" : "500",
                                                        }
                                                    ]}
                                                >
                                                    {sortOption.label}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    styles.radioCircle,
                                                    {
                                                        borderColor: isSelected
                                                            ? colors.common.primary
                                                            : (isDark ? "#4B5563" : "#CBD5E1"),
                                                    }
                                                ]}
                                            >
                                                {isSelected && (
                                                    <View
                                                        style={[
                                                            styles.radioInner,
                                                            { backgroundColor: colors.common.primary }
                                                        ]}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Aksiyon Butonları (Sıfırla / Uygula) */}
                    <View
                        style={[
                            styles.footer,
                            {
                                borderTopColor: colors.profile.separator || "#E2E8F0",
                                backgroundColor: colors.profile.cardBg || (isDark ? "#1E1E24" : "#FFFFFF"),
                            }
                        ]}
                    >
                        <TouchableOpacity
                            activeOpacity={0.75}
                            onPress={handleReset}
                            style={[
                                styles.resetButton,
                                {
                                    backgroundColor: isDark ? "#2A2B36" : "#F1F5F9",
                                    borderColor: isDark ? "#3A3B4A" : "#E2E8F0",
                                }
                            ]}
                        >
                            <Ionicons name="refresh-outline" size={18} color={colors.profile.textSecondary} style={{ marginRight: 6 }} />
                            <Text style={[styles.resetButtonText, { color: colors.profile.textSecondary }]}>
                                {t("resetFilters")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleApply}
                            style={[
                                styles.applyButton,
                                { backgroundColor: colors.common.primary }
                            ]}
                        >
                            <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                            <Text style={styles.applyButtonText}>
                                {t("applyFilters")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    bottomSheetContainer: {
        width: "100%",
        maxHeight: screenHeight * 0.85,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderBottomWidth: 0,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 20,
    },
    indicatorContainer: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 4,
    },
    indicator: {
        width: 44,
        height: 5,
        borderRadius: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollArea: {
        maxHeight: screenHeight * 0.58,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 20,
    },
    section: {
        gap: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.3,
        textTransform: "uppercase",
        opacity: 0.85,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    chipText: {
        fontSize: 13,
    },
    tierDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    sortList: {
        gap: 8,
    },
    sortOptionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    sortOptionLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    sortOptionText: {
        fontSize: 13,
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
    },
    footer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        borderTopWidth: 1,
    },
    resetButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1,
    },
    resetButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    applyButton: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderRadius: 14,
        shadowColor: "#5B3FD3",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    applyButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
});
