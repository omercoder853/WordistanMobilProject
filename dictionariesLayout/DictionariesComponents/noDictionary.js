import { View,Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function NoDictionary(){
    return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <MaterialCommunityIcons name="notebook-plus-outline" size={100} color="#BDC3C7" />
        <Text style={{marginTop:25,fontSize:20,color:'#BDC3C7'}}>A library of a thousand words</Text>
        <Text style={{fontSize:20,color:'#BDC3C7'}}>begins with a single dictionary.</Text>
    </View>)
}