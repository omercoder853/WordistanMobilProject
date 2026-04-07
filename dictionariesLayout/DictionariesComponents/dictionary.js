import {View,Text,Image,TouchableOpacity} from 'react-native'
import styles from '../DictionariesStyles/dictStyles'
import {Feather,AntDesign} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';

export default function Dictionary({title,length,id}){
    const { t } = useTranslation();
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={()=>navigation.navigate("DictDetails",{dictId : id})} style={styles.dictionaryButton}>
            <View style={styles.dictionaryRow}>
                <Image source={require('../../assets/dictionary-cover.jpg')} style={styles.dictionaryCover}/>
                <View style={{flex:1,paddingHorizontal:10,gap:5}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{marginRight:'auto'}}>{title}</Text>
                        <TouchableOpacity><Feather name="share-2" size={18} color="black" /></TouchableOpacity>
                        <TouchableOpacity style={{marginLeft:10}}><AntDesign name="cloud-download" size={20} color="black" /></TouchableOpacity>
                    </View>
                    <Text>{length==0 ? t('empty') : length + ' ' + t('words')}</Text>
                    <Text>{t('lastUpdateStr')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}