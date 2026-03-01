import { View,Text,FlatList,TouchableOpacity } from "react-native"
import Dictionary from "./dictionary"
import styles from "../DictionariesStyles/dictStyles"
import { useDictionary } from "../../contextapis/DictContext";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import NoDictionary from "./noDictionary";

export default function Personal(){
    const isFocused = useIsFocused();
    const {setFocus,dicts} = useDictionary()
    useEffect(()=>{
        setFocus(isFocused)
    },[isFocused])
    
    return (
        <View style={{flex:1,paddingHorizontal:15}}>
            <Text style={{fontWeight:'700',fontSize:20,marginVertical:10}}>Personal Dictionaries</Text>
            <FlatList
                style={{flex:1}}
                showsVerticalScrollIndicator={false} 
                data={dicts} 
                renderItem={({item}) => (<Dictionary title={item.name} length={item.words.length} id={item.id}/>)} 
                keyExtractor={item => item.id} 
                ListEmptyComponent={(<NoDictionary/>)}/>
            <TouchableOpacity style={styles.addDictButton}>
                <Text style={{fontWeight:'900',color:'white',fontSize:25,textAlign:'center'}}>+</Text>
            </TouchableOpacity>
        </View>
    )
}