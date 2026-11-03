import React, { useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

const { height: screenHeight } = Dimensions.get("window");

export const DEFAULT_COLLECTION_FILTERS = {
    level: "",
    tags: [],
    sortBy: "az",
};

export default function CollectionFilterModal({
    visible,
    onClose,
    currentFilters = DEFAULT_COLLECTION_FILTERS,
    levels = [],
    tags = [],
    onApply,
}) {
    const { t, i18n } = useTranslation();
    const { colors, isDark } = useTheme();
    const { width: windowWidth } = useWindowDimensions();
    const dColors = colors.dictionaries;
    const language = i18n.language.split("-")[0];
    const [localFilters, setLocalFilters] = useState(DEFAULT_COLLECTION_FILTERS);
    const [tagSearch, setTagSearch] = useState("");

    const filteredTags = useMemo(() => tags.filter((tag) =>
        tag.toLocaleLowerCase(language).includes(tagSearch.trim().toLocaleLowerCase(language))
    ), [language, tags, tagSearch]);
    const tagRows = useMemo(() => {
        const availableWidth = windowWidth - 40;
        const rows = [];
        let currentRow = [];
        let currentRowWidth = 0;

        filteredTags.forEach((tag) => {
            const chipWidth = Math.min(tag.length * 8.5 + 51, availableWidth);
            const nextWidth = currentRowWidth + (currentRow.length > 0 ? 8 : 0) + chipWidth;

            if (nextWidth > availableWidth && currentRow.length > 0) {
                rows.push(currentRow);
                currentRow = [];
                currentRowWidth = 0;
            }

            currentRow.push(tag);
            currentRowWidth += (currentRow.length > 1 ? 8 : 0) + chipWidth;
        });

        if (currentRow.length > 0) {
            rows.push(currentRow);
        }

        return rows;
    }, [filteredTags, windowWidth]);
    const initialTagRowCount = useMemo(() => {
        let tagCount = 0;
        for (let index = 0; index < tagRows.length; index += 1) {
            tagCount += tagRows[index].length;
            if (tagCount >= 12) {
                return index + 1;
            }
        }
        return Math.max(tagRows.length, 1);
    }, [tagRows]);

    useEffect(() => {
        if (visible) {
            setLocalFilters({
                ...DEFAULT_COLLECTION_FILTERS,
                ...currentFilters,
                tags: currentFilters.tags ?? [],
            });
            setTagSearch("");
        }
    }, [visible, currentFilters]);

    const toggleTag = (tag) => {
        setLocalFilters((current) => ({
            ...current,
            tags: current.tags.includes(tag)
                ? current.tags.filter((selectedTag) => selectedTag !== tag)
                : [...current.tags, tag],
        }));
    };

    const resetFilters = () => {
        setLocalFilters(DEFAULT_COLLECTION_FILTERS);
        setTagSearch("");
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={[
                    styles.sheet,
                    { backgroundColor: dColors.modalBg, borderColor: dColors.modalBorder },
                ]}>
                    <View style={styles.indicatorContainer}>
                        <View style={[
                            styles.indicator,
                            { backgroundColor: isDark ? "#3A3B4A" : "#E2E8F0" },
                        ]} />
                    </View>

                    <View style={[styles.header, { borderBottomColor: dColors.tabBorder }]}>
                        <View style={styles.headerTitle}>
                            <Ionicons name="options-outline" size={22} color={dColors.tabActive} />
                            <Text style={[styles.headerText, { color: dColors.textPrimary }]}>
                                {t("filterCollections")}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.closeButton, { backgroundColor: dColors.badgeBg }]}
                            accessibilityRole="button"
                            accessibilityLabel={t("close")}
                        >
                            <Ionicons name="close" size={20} color={dColors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        style={styles.scrollArea}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        data={tagRows}
                        keyExtractor={(row) => row[0]}
                        initialNumToRender={initialTagRowCount}
                        maxToRenderPerBatch={4}
                        windowSize={5}
                        renderItem={({ item: row }) => (
                            <View style={styles.tagRow}>
                                {row.map((tag) => {
                                    const selected = localFilters.tags.includes(tag);
                                    return (
                                        <TouchableOpacity
                                            key={tag}
                                            onPress={() => toggleTag(tag)}
                                            style={[
                                                styles.chip,
                                                styles.tagChip,
                                                {
                                                    maxWidth: windowWidth - 40,
                                                    backgroundColor: selected ? dColors.badgeBg : dColors.modalItemBg,
                                                    borderColor: selected ? dColors.tabActive : dColors.modalBorder,
                                                },
                                            ]}
                                            activeOpacity={0.75}
                                        >
                                            <Ionicons
                                                name={selected ? "checkbox" : "square-outline"}
                                                size={16}
                                                color={selected ? dColors.tabActive : dColors.textSecondary}
                                                style={styles.tagIcon}
                                            />
                                            <Text style={[
                                                styles.chipText,
                                                { color: selected ? dColors.tabActive : dColors.textSecondary },
                                            ]} numberOfLines={1}>
                                                #{tag}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                        ListHeaderComponent={(
                            <View style={styles.listHeader}>
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: dColors.textPrimary }]}>
                                        {t("collectionNameSort")}
                                    </Text>
                                    <View style={styles.chipRow}>
                                        {[
                                            { value: "az", label: t("sortAZ") },
                                            { value: "za", label: t("sortZA") },
                                        ].map(({ value, label }) => {
                                            const selected = localFilters.sortBy === value;
                                            return (
                                                <TouchableOpacity
                                                    key={value}
                                                    onPress={() => setLocalFilters((current) => ({ ...current, sortBy: value }))}
                                                    style={[
                                                        styles.chip,
                                                        {
                                                            backgroundColor: selected ? dColors.badgeBg : dColors.modalItemBg,
                                                            borderColor: selected ? dColors.tabActive : dColors.modalBorder,
                                                        },
                                                    ]}
                                                    activeOpacity={0.75}
                                                >
                                                    <Text style={[
                                                        styles.chipText,
                                                        { color: selected ? dColors.tabActive : dColors.textSecondary },
                                                    ]}>
                                                        {label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: dColors.textPrimary }]}>
                                        {t("level")}
                                    </Text>
                                    <View style={styles.chipRow}>
                                        {["", ...levels].map((level, index) => {
                                            const selected = localFilters.level === level;
                                            return (
                                                <TouchableOpacity
                                                    key={level || `all-${index}`}
                                                    onPress={() => setLocalFilters((current) => ({ ...current, level }))}
                                                    style={[
                                                        styles.chip,
                                                        {
                                                            backgroundColor: selected ? dColors.badgeBg : dColors.modalItemBg,
                                                            borderColor: selected ? dColors.tabActive : dColors.modalBorder,
                                                        },
                                                    ]}
                                                    activeOpacity={0.75}
                                                >
                                                    <Text style={[
                                                        styles.chipText,
                                                        { color: selected ? dColors.tabActive : dColors.textSecondary },
                                                    ]}>
                                                        {level || t("filterAll")}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: dColors.textPrimary }]}>
                                        {t("collectionTagsFilter")}
                                    </Text>
                                    <TextInput
                                        value={tagSearch}
                                        onChangeText={setTagSearch}
                                        placeholder={t("searchCollectionTags")}
                                        placeholderTextColor={dColors.searchBarPlaceholder}
                                        style={[
                                            styles.nameInput,
                                            {
                                                backgroundColor: dColors.searchBarBg,
                                                borderColor: dColors.searchBarBorder,
                                                color: dColors.searchBarText,
                                            },
                                        ]}
                                        returnKeyType="search"
                                    />
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={(
                            <Text style={[styles.emptyTags, { color: dColors.textSecondary }]}>
                                {t("noCollectionTagsFound")}
                            </Text>
                        )}
                    />

                    <View style={[styles.footer, { borderTopColor: dColors.tabBorder }]}>
                        <TouchableOpacity
                            onPress={resetFilters}
                            style={[
                                styles.actionButton,
                                styles.resetButton,
                                { backgroundColor: dColors.modalItemBg, borderColor: dColors.modalBorder },
                            ]}
                            activeOpacity={0.75}
                        >
                            <Ionicons name="refresh-outline" size={18} color={dColors.textSecondary} />
                            <Text style={[styles.actionText, { color: dColors.textSecondary }]}>
                                {t("resetFilters")}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onApply(localFilters);
                                onClose();
                            }}
                            style={[
                                styles.actionButton,
                                styles.applyButton,
                                { backgroundColor: colors.common.primary },
                            ]}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" />
                            <Text style={[styles.actionText, styles.applyText]}>
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
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        width: "100%",
        maxHeight: screenHeight * 0.85,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderBottomWidth: 0,
        overflow: "hidden",
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
    headerTitle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerText: {
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
        flexGrow: 1,
    },
    listHeader: {
        gap: 20,
        marginBottom: 16,
    },
    section: {
        gap: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.3,
        textTransform: "uppercase",
    },
    nameInput: {
        minHeight: 46,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 14,
        fontSize: 14,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    tagChip: {
        marginBottom: 8,
    },
    tagRow: {
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 8,
    },
    emptyTags: {
        paddingVertical: 12,
        textAlign: "center",
        fontSize: 14,
    },
    chipText: {
        fontSize: 13,
        fontWeight: "600",
    },
    tagIcon: {
        marginRight: 6,
    },
    footer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        borderTopWidth: 1,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1,
    },
    resetButton: {
        flex: 1,
    },
    applyButton: {
        flex: 2,
        borderColor: "transparent",
    },
    actionText: {
        fontSize: 14,
        fontWeight: "600",
    },
    applyText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
