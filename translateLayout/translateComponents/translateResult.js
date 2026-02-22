import { View, Text, TouchableOpacity } from "react-native";
import styles from "../translateStyles/transStyles";
import Ionicons from '@expo/vector-icons/Ionicons';
export default function ResultArea({display,result}) {
    const isValidResult = result !== "Result not Found"  
    return (
    <View style={[styles.resultContainer, { display: display }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 25, fontWeight: '900' }}>{result}</Text>
            {isValidResult && (
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
                <Ionicons name="volume-medium" size={25} color="black" />
            </TouchableOpacity>) }
        </View>
        {isValidResult && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>[rezolt]</Text>
            <TouchableOpacity style={styles.addMyDictButton}>
                <Text style={{ color: '#6D28D9', fontWeight: "bold" }}>Add To Dict</Text>
            </TouchableOpacity>
        </View>)}
    </View>
    )
}