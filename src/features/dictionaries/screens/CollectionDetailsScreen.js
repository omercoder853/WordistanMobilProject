import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import EmptyDictionary from "../components/EmptyDictionaryState";
import styles from "../styles/CollectionStyles";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTheme } from "@/contextapis/ThemeContext";
import { useState } from "react";
import SaveWordModal from "@/shared/components/SaveWordModal";
import { useDictionary } from "@/contextapis/DictContext";

export default function CollectionDetails() {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();
    const route = useRoute();
    const { title, data, desc } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWord, setSelectedWord] = useState({ word: "", meaning: "" });
    const { dicts, setDictReload } = useDictionary();

    const filteredDicts = (dicts || []).filter((dict) =>
        dict.language === "ENG to TR" || dict.language?.startsWith("ENG")
    );

    const handleAddWord = (targetWord, meaningWord) => {
        setDictReload(true);
        setSelectedWord({ word: targetWord, meaning: meaningWord });
        setModalVisible(true);
    };

    const renderWordItem = ({ item }) => {
        const targetWord = item.en || item.word;
        const meaningWord = item.tr || item.meaning;
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
        <View style={[styles.detailsContainer, { backgroundColor: colors.common.background }]}>
            <LinearGradient 
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.headerCard}>
                
                <Text style={styles.collectionName}>{t(title)}</Text>
                <View style={styles.tagsContainer}>
                    <Text style={styles.tag}>{data?.length || 0} {t("words")}</Text>
                    <Text style={styles.tag}>A1-A2</Text>
                    <Text style={styles.tag}>ENG - TR</Text>
                </View>
                <View style={styles.divider}></View>
                <Text style={styles.collectionDescription}>{t(desc) || t("collectionDescPlaceholder")}</Text>
            </LinearGradient>            
            
            <FlatList
                style={styles.wordList}
                data={data}
                renderItem={renderWordItem}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<EmptyDictionary/>}
            />

            <SaveWordModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                filteredDicts={filteredDicts}
                word={selectedWord.word}
                meaning={selectedWord.meaning}
            />
        </View>
    );
}

const capitalize = (str) => 
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
