import { View,Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function EmptyDictionary(){
    return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <MaterialCommunityIcons name="book-cancel-outline" size={120} color="#BDC3C7" />
        <Text style={{marginTop:25,fontSize:20,color:'#BDC3C7'}}>Start your journey</Text>
        <Text style={{fontSize:20,color:'#BDC3C7'}}>by adding your first word.</Text>
    </View>)
}