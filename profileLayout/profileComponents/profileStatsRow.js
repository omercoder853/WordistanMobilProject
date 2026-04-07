import { View,Text,Image } from "react-native";
import styles from "../profileStyle/styles";
import {FontAwesome,FontAwesome6,Feather} from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

export default function ProfileStatsRow({user}){
    const { t } = useTranslation();
    return (
        <View style={{flexDirection:'row',justifyContent:'space-around',marginVertical:20}}>
            <View style={styles.statColumn}>
                <Feather name="search" size={18} color="black" />
                <Text style={{fontSize:15,fontWeight:'700'}}>{user?.translated_words}</Text>
                <Text style={{fontSize:12,color:'#64748B',marginTop:-5}}>{t('lookups')}</Text>
            </View>
            <View style={{borderWidth:0.4,borderColor:'#94A3B8',marginHorizontal:5}}></View>
            <View style={styles.statColumn}>
                <FontAwesome name="bookmark-o" size={18} color="black" />
                <Text style={{fontSize:15,fontWeight:'700'}}>{user?.saved_words}</Text>
                <Text style={{fontSize:12,color:'#64748B',marginTop:-5}}>{t('saved')}</Text>
            </View>
            <View style={{borderWidth:0.4,borderColor:'#94A3B8',marginHorizontal:5}}></View>
            <View style={styles.statColumn}>
                <FontAwesome6 name="award" size={18} color="black" />
                <Text style={{fontSize:15,fontWeight:'700'}}>{user?.achievements?.length}</Text>
                <Text style={{fontSize:12,color:'#64748B',marginTop:-5}}>{t('badges')}</Text>
            </View>
        </View>
    )
}