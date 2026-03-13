import { View,Text,TouchableOpacity,Image } from "react-native";
import styles from "../gameStyles/styles"
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";

export default function Game({item}){
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.gameButton} onPress={()=>navigation.navigate("Game Navigation",{screen:"Game Setup",params:{gameType:item.id}})}>
            <View style={styles.gameRow}>
                <View style={{flex:2}}>
                    <Image style={styles.gameCover} source={item.cover}/>
                </View>
                <View style={{flex:6}}>
                    <Text style={styles.gameName}>{item.name}</Text>
                    <Text style={{color:'#757575'}}>{item.desc}</Text>
                </View>
                <AntDesign name="play-circle" size={24} color="#dc9f9f" style={{flex:1,marginLeft:'auto'}}/>
            </View>
        </TouchableOpacity>
    )
}
