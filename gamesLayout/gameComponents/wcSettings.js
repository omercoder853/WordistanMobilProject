import { View,Text,Switch } from "react-native";
import styles from "../gameStyles/styles";

export default function WcSettings({visibleFirstLetter,setVisibleFirstLetter}){
    return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={styles.optionLabel}>Visible First Letter</Text>
            <Switch trackColor={{ false: "#e0e0e0", true: "#dc9f9f" }} thumbColor="#ffffff" 
            style={{marginLeft:20,marginBottom:8,marginTop:15}} 
            onValueChange={()=>setVisibleFirstLetter(!visibleFirstLetter)} 
            value={visibleFirstLetter}/>
        </View>
    )
}