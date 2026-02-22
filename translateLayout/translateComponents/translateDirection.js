import {View,Text,TouchableOpacity} from 'react-native'
import { useState } from 'react';
import styles from '../translateStyles/transStyles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function Direction({setDisplay}) {
    const [from,setFrom] = useState("TR")
    const toggleDirection = () => {
        setFrom(from === "TR" ? "ENG" : "TR");
        setDisplay("none")
    }
    return (
        <View style={{flexDirection:'row',gap:5}}>
            <Text style={styles.directionItem}>{from}</Text>
            <TouchableOpacity onPress={toggleDirection} style={styles.directionItem}>
                <MaterialIcons name="compare-arrows" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.directionItem}>{from === "TR" ? "ENG" : "TR"}</Text>
        </View>
    )
}