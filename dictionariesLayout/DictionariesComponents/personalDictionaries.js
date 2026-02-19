import { View,Text,FlatList,ScrollView,TouchableOpacity } from "react-native"
import Dictionary from "./dictionary"
import styles from "../DictionariesStyles/dictStyles"

export default function Personal(){
    return (
        <View style={{flex:1,paddingHorizontal:15}}>
            <Text style={{fontWeight:'700',fontSize:20,marginVertical:10}}>Personal Dictionaries</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {Array(10).fill().map((v,i)=>{
                return(<Dictionary key={i} title={`Merhaba ${i+1}`}/>)
            })}
            </ScrollView>
            <TouchableOpacity style={styles.addDictButton}>
                <Text style={{fontWeight:'900',color:'white',fontSize:25,textAlign:'center'}}>+</Text>
            </TouchableOpacity>
        </View>
    )
}