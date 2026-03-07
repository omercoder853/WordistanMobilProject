import { View,Text,Image } from "react-native";
import styles from "../profileStyle/styles";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProfileInfo({user}){
    return (
        <View style={{alignItems:'center'}}>
            <Image style={styles.profilePhoto} source={require('../../assets/avatarBoy.png')}/>
            <Text style={{fontSize:20,fontWeight:'900',marginBottom:7}}>{user?.first_name +" "+user?.last_name}</Text>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
                <MaterialIcons name="email" size={15} color="black" />
                <Text style={{fontSize:12,color:'#64748B'}}>{user?.email}</Text>
            </View>
        </View>
    )
}