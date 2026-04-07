import { View,Text,FlatList,TouchableOpacity,ActivityIndicator } from "react-native"
import Dictionary from "./dictionary"
import styles from "../DictionariesStyles/dictStyles"
import { useDictionary } from "../../contextapis/DictContext";
import { useEffect,useState } from "react";
import NoDictionary from "./noDictionary";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CreateDictionary from "./createDict";
import { useTranslation } from "react-i18next";

export default function Personal(){
    const { t } = useTranslation();
    const [visible,setVisible] = useState(false);

    const {setDictReload,dicts,dictReload} = useDictionary()
    useEffect(()=>{
        setDictReload(true)
    },[])

    
    return (
        <View style={{flex:1,paddingHorizontal:15}}>
            <Text style={{fontWeight:'700',fontSize:20,marginVertical:10}}>{t('personalDictionaries')}</Text>
            {dictReload 
            ? <ActivityIndicator size="large" style={{alignSelf:'center',flex:1}}/>
            :<FlatList
                style={{flex:1}}
                showsVerticalScrollIndicator={false} 
                data={dicts} 
                renderItem={({item}) => (<Dictionary title={item.name} length={item.words.length} id={item.id}/>)} 
                keyExtractor={item => item.id} 
                ListEmptyComponent={(<NoDictionary/>)} refreshing={dictReload} onRefresh={()=>setDictReload(true)} />}
            <TouchableOpacity style={styles.addDictButton} onPress={()=>setVisible(true)}>
                <MaterialCommunityIcons style={{fontWeight:'900'}} name="book-plus-outline" size={24} color="white" />
            </TouchableOpacity>
            <CreateDictionary visible={visible} setVisible={setVisible}/>
        </View>
    )
}