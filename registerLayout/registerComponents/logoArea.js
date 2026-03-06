import { View,Text,Image } from "react-native";
import styles from "../registerStyles/styles";

export default function LogoArea(){
    return(
        <View style={{flexDirection:'row',marginBottom:25,alignItems:'center'}}>
            <Image style={{width:60,height:60}} source={require("../../assets/logo.png")}/>
            <Text style={{fontSize:20,fontWeight:'700',color:'#6b3fa0'}}>Wordistan</Text>
        </View>
    )
}