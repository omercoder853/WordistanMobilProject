import { View,Text } from "react-native";
import styles from "../gameStyles/styles";

export default function GameHeader({hints,remainTime}){
    return (
        <View style={styles.gameHeaderRow}>
            <View style={styles.gameHeaderItem}>
                <Text style={{fontSize:18,color:'white',fontWeight:'900'}}>{hints} 💡</Text>
            </View>
            <View style={styles.gameHeaderItem}>
                <Text style={{fontSize:18,color:'white',fontWeight:'900'}}>{remainTime}</Text>
            </View>
        </View>
    )
}