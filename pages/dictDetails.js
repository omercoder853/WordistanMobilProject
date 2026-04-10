import { View,Text,FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDictionary } from "../contextapis/DictContext";
import Word from "../dictionariesLayout/DictionariesComponents/wordRow";
import styles from "../dictionariesLayout/DictionariesStyles/dictStyles";
import EmptyDictionary from "../dictionariesLayout/DictionariesComponents/emptyDictionary";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

export default function DictDetails(){
    const {t} = useTranslation();
    const {getWords,getDict} = useDictionary();
    const route = useRoute();
    const {dictId} = route.params;
    const words = getWords(dictId) || [];
    const dict = getDict(dictId)

    return (
        <View style={styles.wordsTable}>
            <LinearGradient 
                colors={['#c967e6', '#9c27b0']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.wordsTitle}>
                
                <Text style={styles.dictName}>{dict.name}</Text>
                <View style={styles.dictDirectionContainer}>
                    <Text style={styles.dictDirection}>{dict.language}</Text>
                    <Text style={styles.dictDirection}>{dict.words.length == 0 ? t("empty") : dict.words.length + " " + t("words")}</Text>
                </View>
                <View style={{borderWidth:0.5, borderColor:'rgba(255, 255, 255, 0.4)', marginVertical:15}}></View>
                <Text style={styles.dictDescription}>{dict.description}</Text>
            </LinearGradient>            
            
            <FlatList
                style={styles.wordList}
                data={words}
                renderItem={({item,index}) => Word(item,index)}
                keyExtractor={item=>item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={(<EmptyDictionary/>)}
            />
        </View>
    )
}