import { View, Text, FlatList, TouchableOpacity } from "react-native";
import Collection from "./CollectionCard";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";
import { useCallback, useMemo, useState } from "react";
import { useDictionary } from "@/contextapis/DictContext";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CollectionFilterModal, { DEFAULT_COLLECTION_FILTERS } from "./CollectionFilterModal";

export default function Collections() {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t, i18n } = useTranslation();
    const language = i18n.language.split("-")[0];
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const { collections, fetchCollections } = useDictionary();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_COLLECTION_FILTERS);
    const collectionList = Array.isArray(collections) ? collections : [];

    const availableLevels = useMemo(() => (
        [...new Set(collectionList.map((collection) => String(collection.level ?? "").trim()).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b))
    ), [collectionList]);

    const availableTags = useMemo(() => (
        isFilterModalOpen
            ? [...new Set(collectionList.flatMap((collection) => collection[`tags_${language}`] ?? []))]
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b, language))
            : []
    ), [collectionList, isFilterModalOpen, language]);

    const filteredCollections = useMemo(() => {
        const selectedTags = filters.tags.map((tag) => tag.toLocaleLowerCase(language));

        const result = collectionList.filter((collection) => {
            const title = collection[`title_${language}`] ?? collection.title ?? collection.name ?? "";
            if (filters.level && collection.level?.toLocaleLowerCase(language) !== filters.level.toLocaleLowerCase(language)) {
                return false;
            }
            if (selectedTags.length > 0) {
                const collectionTags = (collection[`tags_${language}`] ?? [])
                    .map((tag) => tag.toLocaleLowerCase(language));
                if (!selectedTags.some((tag) => collectionTags.includes(tag))) {
                    return false;
                }
            }
            return true;
        });

        return result.sort((a, b) => {
            const titleA = a[`title_${language}`] ?? a.title ?? a.name ?? "";
            const titleB = b[`title_${language}`] ?? b.title ?? b.name ?? "";
            const sortDirection = filters.sortBy === "za" ? -1 : 1;
            return sortDirection * titleA.localeCompare(titleB, language, { sensitivity: "base" });
        });
    }, [collectionList, filters, language]);

    const isFilterActive = Boolean(filters.level || filters.tags.length || filters.sortBy === "za");

    useFocusEffect(useCallback(() => {
        if (collections.length > 0) return undefined;

        let isActive = true;
        setLoading(true);
        fetchCollections().then((success) => {
            if (isActive) {
                setLoadFailed(!success);
            }
        }).finally(() => {
            if (isActive) {
                setLoading(false);
            }
        });

        return () => {
            isActive = false;
        };
    }, [collections.length, fetchCollections]));

    const refreshCollections = async () => {
        setRefreshing(true);
        const success = await fetchCollections(true);
        setLoadFailed(!success && collections.length === 0);
        setRefreshing(false);
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: colors.common.background }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                <Text style={{ fontWeight: '700', fontSize: 20, flex: 1, color: dColors.title }}>{t('collections')}</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsFilterModalOpen(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ position: "relative", padding: 4 }}
                    accessibilityRole="button"
                    accessibilityLabel={t("filterCollections")}
                >
                    <Ionicons
                        name={isFilterActive ? "filter" : "filter-sharp"}
                        size={22}
                        color={isFilterActive ? dColors.tabActive : dColors.textPrimary}
                    />
                    {isFilterActive && (
                        <View style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: dColors.tabActive,
                        }} />
                    )}
                </TouchableOpacity>
            </View>
            {loading ? (
                <LottieView speed={3} autoPlay loop source={require("../assets/anim_dictionary_loading.json")} style={{ width: '50%', aspectRatio: 1, alignSelf: 'center', top: '15%' }} />
            ) : (
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={filteredCollections.length === 0 ? { flexGrow: 1 } : { paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    data={filteredCollections}
                    renderItem={({ item }) => <Collection collection={item} />}
                    keyExtractor={(item, index) => String(item.id ?? index)}
                    refreshing={refreshing}
                    onRefresh={refreshCollections}
                    ListEmptyComponent={(
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
                            <Ionicons
                                name={collectionList.length > 0 ? "filter-outline" : "alert-circle-outline"}
                                size={42}
                                color={collectionList.length > 0 ? dColors.textSecondary : colors.common.warning}
                            />
                            <Text style={{ marginTop: 12, textAlign: "center", color: dColors.textSecondary, fontSize: 15, lineHeight: 22 }}>
                                {t(collectionList.length > 0
                                    ? "noFilteredCollections"
                                    : loadFailed ? "collectionsLoadFailed" : "collectionsEmpty")}
                            </Text>
                        </View>
                    )}
                />
            )}
            <CollectionFilterModal
                visible={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={filters}
                levels={availableLevels}
                tags={availableTags}
                onApply={setFilters}
            />
        </View>
    );
}