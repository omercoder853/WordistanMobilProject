import { View,Text } from "react-native";
import styles from "../DictionariesStyles/dictStyles";

export default function Word(word,index){
    return (
        <View style={styles.wordRow}>
            <View style={styles.wordId}>
                <Text style={{color:'white',fontWeight:'700'}}>{index+1}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
                <Text style={styles.wordTarget}>{capitalize(word.word)}</Text>
                <Text style={styles.wordMeaning}>{capitalize(word.meaning)}</Text>
            </View>
        </View>
        
    )
}

const capitalize = (str) => 
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";