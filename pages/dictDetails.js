import { View,Text,FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDictionary } from "../contextapis/DictContext";
import Word from "../dictionariesLayout/DictionariesComponents/wordRow";
import styles from "../dictionariesLayout/DictionariesStyles/dictStyles";
import EmptyDictionary from "../dictionariesLayout/DictionariesComponents/emptyDictionary";
import { useTranslation } from "react-i18next";

export default function DictDetails(){
    const {t} = useTranslation();
    const {getWords,getDict} = useDictionary();
    const route = useRoute();
    const {dictId} = route.params;
    const words = getWords(dictId) || [];
    const dict = getDict(dictId)

    return (
        <View style={styles.wordsTable}>
            <View style={styles.wordsTitle}>
                <Text style={styles.dictName}>{dict.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                    <Text style={styles.dictDirection}>{dict.language}</Text>
                    <Text style={styles.dictDirection}>{dict.words.length == 0 ? t("empty") : dict.words.length + " " + t("words")}</Text>
                </View>
                <View style={{borderWidth:0.5,borderColor:'#efdffd',marginVertical:10}}></View>
                <Text style={{color:'#555555',fontSize:14}}>{dict.description}</Text>
            </View>            
            <FlatList
                style={styles.wordList}
                data={words}
                renderItem={({item,index}) => Word(item,index)}
                key={item=>item.id}
                ListEmptyComponent={(<EmptyDictionary/>)}/>
        </View>
    )
}