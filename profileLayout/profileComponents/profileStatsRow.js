import { View,Text,Image } from "react-native";
import styles from "../profileStyle/styles";
import {FontAwesome,FontAwesome6,Feather} from '@expo/vector-icons';


export default function ProfileStatsRow({user}){
    return (
        <View style={{flexDirection:'row',justifyContent:'space-around',marginVertical:20}}>
            <View style={styles.statColumn}>
                <Feather name="search" size={18} color="black" />
                <Text style={{fontSize:15,fontWeight:'700'}}>{user?.translated_words}</Text>
                <Text style={{fontSize:12,color:'#64748B',marginTop:-5}}>Lookups</Text>
            </View>
            <View style={{borderWidth:0.4,borderColor:'#94A3B8',marginHorizontal:5}}></View>
            <View style={styles.statColumn}>
                <FontAwesome name="bookmark-o" size={18} color="black" />
                <Text style={{fontSize:15,fontWeight:'700'}}>{user?.saved_words}</Text>
                <Text style={{fontSize:12,color:'#64748B',marginTop:-5}}>Saved</Text>
            </View>
            <View style={{borderWidth:0.4,borderColor:'#94A3B8',marginHorizontal:5}}></View>
            <View style={styles.statColumn}>
                <FontAwesome6 name="award" size={18} color="black" />
                <Text style={{fontSize:15,fontWeight:'700'}}>{user?.achievements?.length}</Text>
                <Text style={{fontSize:12,color:'#64748B',marginTop:-5}}>Badges</Text>
            </View>
        </View>
    )
}