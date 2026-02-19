import {View,Text,Image,TouchableOpacity} from 'react-native'
import styles from '../DictionariesStyles/dictStyles'
import {Feather,AntDesign} from '@expo/vector-icons';

export default function Dictionary({title}){
    return (
        <View style={styles.dictionaryRow}>
            <Image source={require('../../assets/dictionary-cover.jpg')} style={styles.dictionaryCover}/>
            <View style={{flex:1,paddingHorizontal:10,gap:5}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{marginRight:'auto'}}>{title}</Text>
                    <TouchableOpacity><Feather name="share-2" size={18} color="black" /></TouchableOpacity>
                    <TouchableOpacity style={{marginLeft:10}}><AntDesign name="cloud-download" size={20} color="black" /></TouchableOpacity>
                </View>
                <Text>245 words</Text>
                <Text>Last Update: 10 sec ago</Text>
            </View>
        </View>
    )
}