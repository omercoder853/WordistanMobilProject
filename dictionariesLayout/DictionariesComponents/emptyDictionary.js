import { View,Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from "react-i18next";

export default function EmptyDictionary(){
    const { t } = useTranslation();
    return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <MaterialCommunityIcons name="book-cancel-outline" size={120} color="#BDC3C7" />
        <Text style={{marginTop:25,fontSize:20,color:'#BDC3C7'}}>{t('startYourJourney')}</Text>
        <Text style={{fontSize:20,color:'#BDC3C7'}}>{t('byAddingYourFirstWord')}</Text>
    </View>)
}