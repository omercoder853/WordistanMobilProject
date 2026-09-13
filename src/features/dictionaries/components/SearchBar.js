import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contextapis/ThemeContext";
import { useDictionary } from "@/contextapis/DictContext";
import { COLLECTION_LIST } from "../data/CollectionList";

const SearchBar = ({ currentTab = "Personal" }) => {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { dicts } = useDictionary();

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        if (currentTab === "Personal") {
            const results = (dicts || [])
                .filter((d) => d.name?.toLowerCase().includes(trimmed))
                .slice(0, 5)
                .map((d) => ({
                    id: d.id,
                    name: d.name,
                    type: "personal",
                    dict: d,
                }));
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
        } else {
            const results = COLLECTION_LIST
                .filter((c) =>
                    t(c.title).toLowerCase().includes(trimmed) ||
                    c.title.toLowerCase().includes(trimmed)
                )
                .slice(0, 5)
                .map((c) => ({
                    id: c.id,
                    name: t(c.title),
                    type: "collection",
                    item: c,
                }));
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
        }
    }, [query, currentTab, dicts]);

    const handleSelect = (item) => {
        setShowSuggestions(false);
        setQuery("");
        if (item.type === "personal") {
            navigation.navigate("DictDetails", { dictId: item.id });
        } else {
            navigation.navigate("CollectionDetails", {
                title: item.item.title,
                data: item.item.data,
                desc: item.item.desc,
            });
        }
    };

    const handleClear = () => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <View style={styles.searchBarWrapper}>
            <View style={styles.searchBarRow}>
                <TextInput
                    style={[
                        styles.searchBarInput,
                        {
                            backgroundColor: dColors.searchBarBg,
                            borderColor: dColors.searchBarBorder,
                            color: dColors.searchBarText,
                        }
                    ]}
                    value={query}
                    onChangeText={setQuery}
                    placeholder={currentTab === "Personal" ? t('searchInPersonal') : t('searchInCollections')}
                    placeholderTextColor={dColors.searchBarPlaceholder}
                />
                {query.length > 0 ? (
                    <TouchableOpacity
                        style={[styles.searchButton, { backgroundColor: dColors.searchBtnBg }]}
                        onPress={handleClear}
                    >
                        <Feather name="x" size={20} color={dColors.searchBtnIcon} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.searchButton, { backgroundColor: dColors.searchBtnBg }]}
                        activeOpacity={0.8}
                    >
                        <Feather name="search" size={20} color={dColors.searchBtnIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Dropdown Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <View
                    style={[
                        styles.suggestionContainer,
                        {
                            backgroundColor: dColors.cardBg,
                            borderColor: dColors.cardBorder,
                            shadowColor: dColors.cardShadow,
                        }
                    ]}
                >
                    {suggestions.map((item, index) => (
                        <TouchableOpacity
                            key={item.id || index}
                            style={[
                                styles.suggestionItem,
                                index < suggestions.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: dColors.cardBorder,
                                }
                            ]}
                            onPress={() => handleSelect(item)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={item.type === 'personal' ? "book-outline" : "library-outline"}
                                size={18}
                                color={dColors.badgeText}
                            />
                            <Text
                                style={[styles.suggestionText, { color: dColors.textPrimary }]}
                                numberOfLines={1}
                            >
                                {item.name}
                            </Text>
                            <Feather name="chevron-right" size={16} color={dColors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    searchBarWrapper: {
        position: 'relative',
        zIndex: 3000,
    },
    searchBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginTop: 16,
        justifyContent: 'center',
    },
    searchBarInput: {
        borderWidth: 1,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flex: 10,
        fontSize: 14,
    },
    searchButton: {
        padding: 10,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionContainer: {
        position: 'absolute',
        top: 60,
        left: 25,
        right: 25,
        borderRadius: 16,
        borderWidth: 1,
        elevation: 12,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        zIndex: 4000,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 16,
        gap: 12,
    },
    suggestionText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
});