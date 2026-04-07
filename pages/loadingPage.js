import { View,Text,Image,ActivityIndicator } from "react-native"
import { useTranslation } from "react-i18next";

export default function LoadingPage(){
    const { t } = useTranslation();
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Image style={{height:180,width:180,borderRadius:7,backgroundColor:'#F8F9FA'}} source={require('../assets/logo.png')}/>
            <Text style={{fontSize:30,fontWeight:'900',marginBottom:10}}>{t('wordistan')}</Text>
            <ActivityIndicator size="large" color="#e86ad0"/>
        </View>
    )
}