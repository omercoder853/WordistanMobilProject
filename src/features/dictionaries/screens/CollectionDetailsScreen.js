import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/CollectionStyles";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/contextapis/ThemeContext";
import { useCallback, useEffect, useState } from "react";
import SaveWordModal from "@/shared/components/SaveWordModal";
import { useDictionary } from "@/contextapis/DictContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiClient } from "@/services/ApiClient";
import { ENDPOINTS } from "@/constants/ApiConfig";

export default function CollectionDetails() {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t, i18n } = useTranslation();
    const route = useRoute();
    const { id, title, desc, count, level, owner } = route.params ?? {};

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWord, setSelectedWord] = useState({ word: "", meaning: "" });
    const { dicts, setDictReload } = useDictionary();
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const filteredDicts = (dicts || []).filter((dict) =>
        dict.language === "ENG to TR" || dict.language?.startsWith("ENG")
    );

    const handleAddWord = (targetWord, meaningWord) => {
        setDictReload(true);
        setSelectedWord({ word: targetWord, meaning: meaningWord });
        setModalVisible(true);
    };

    const fetchWords = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
            setLoadFailed(false);
        }

        try {
            const { ok, data, status } = await apiClient.get(ENDPOINTS.collectionWords(id));
            if (ok && Array.isArray(data)) {
                setWords(data);
                setLoadFailed(false);
            } else {
                console.error("Collection words could not be fetched.", status);
                setLoadFailed(true);
                if (!isRefresh) {
                    setWords([]);
                }
            }
        } catch (error) {
            console.error("Collection words could not be fetched:", error);
            setLoadFailed(true);
            if (!isRefresh) {
                setWords([]);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);


    const renderWordItem = ({ item }) => {
        const targetWord = item.word;
        const meaningWord = item.meaning;
        return (
            <View style={[styles.collectionWordRow, { backgroundColor: dColors.wordItemBg, borderColor: dColors.wordItemBorder, shadowColor: dColors.cardShadow }]}>
                <Image 
                    source={require('../assets/dictionary_default_cover.jpg')} 
                    style={styles.wordImage} />
                <View style={styles.wordContentWrapper}>
                    <Text style={[styles.wordTarget, { color: dColors.textPrimary }]}>{capitalize(targetWord)}</Text>
                    <Text style={[styles.wordMeaning, { color: dColors.textSecondary }]}>{capitalize(meaningWord)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleAddWord(targetWord, meaningWord)}
                    activeOpacity={0.7}
                    style={{ padding: 4 }}
                >
                    <AntDesign name="plus-circle" size={24} color={dColors.tabActive} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView edges={["bottom"]} style={[styles.detailsContainer, { backgroundColor: colors.common.background }]}>
            <LinearGradient 
                colors={[dColors.tabActive, colors.common.accent]}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.headerCard}>
                
                <Text style={styles.collectionName}>{t(title || "")}</Text>
                <View style={[styles.tagsContainer, { flexWrap: "wrap" }]}>
                    <Text style={styles.tag}>{count ?? words.length} {t("words")}</Text>
                    {level ? <Text style={styles.tag}>{level}</Text> : null}
                    <Text style={styles.tag}>ENG - TR</Text>
                    {owner ? (
                        <Text style={styles.tag}>{t("collectionOwner", { owner: owner })}</Text>
                    ) : null}
                </View>
                <View style={styles.divider}></View>
                {desc ? <Text style={styles.collectionDescription}>{t(desc)}</Text> : null}
            </LinearGradient>            
            
            {loading ? (
                <ActivityIndicator size="large" color={dColors.tabActive} style={{ flex: 1 }} />
            ) : (
                <FlatList
                    style={styles.wordList}
                    data={words}
                    renderItem={renderWordItem}
                    keyExtractor={(item, index) => String(item.id ?? index)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={words.length === 0 ? { flexGrow: 1, paddingBottom: 20 } : { paddingBottom: 20 }}
                    refreshing={refreshing}
                    onRefresh={() => fetchWords(true)}
                    ListEmptyComponent={(
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
                            <Ionicons name="alert-circle-outline" size={42} color={colors.common.warning} />
                            <Text style={{ marginTop: 12, textAlign: "center", color: dColors.textSecondary, fontSize: 15, lineHeight: 22 }}>
                                {t(loadFailed ? "collectionWordsLoadFailed" : "collectionWordsEmpty")}
                            </Text>
                        </View>
                    )}
                />
            )}

            <SaveWordModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                filteredDicts={filteredDicts}
                word={selectedWord.word}
                meaning={selectedWord.meaning}
            />
        </SafeAreaView>
    );
}

const capitalize = (str) => 
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
