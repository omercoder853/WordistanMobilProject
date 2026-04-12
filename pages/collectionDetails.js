import { View, Text, FlatList, Image,TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import EmptyDictionary from "../dictionariesLayout/DictionariesComponents/emptyDictionary";
import styles from "../dictionariesLayout/DictionariesStyles/collectionStyle";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CollectionDetails() {
    const { t } = useTranslation();
    const route = useRoute();
    const { title, data, desc } = route.params;

    const renderWordItem = ({ item }) => {
        const targetWord = item.en || item.word;
        const meaningWord = item.tr || item.meaning;
        return (
            <View style={styles.collectionWordRow}>
                <Image 
                    source={require('../assets/dictionary-cover.jpg')} 
                    style={styles.wordImage} />
                <View style={styles.wordContentWrapper}>
                    <Text style={styles.wordTarget}>{capitalize(targetWord)}</Text>
                    <Text style={styles.wordMeaning}>{capitalize(meaningWord)}</Text>
                </View>
                <TouchableOpacity>
                    <AntDesign name="plus-circle" size={24} color="green" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.detailsContainer}>
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
        </View>
    );
}

const capitalize = (str) => 
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
