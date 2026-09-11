import { View, Text, TouchableOpacity } from 'react-native'
import styles from '../styles/styles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function Direction({ setDisplay, from, setFrom }) {
    const toggleDirection = () => {
        setFrom(from === "TR" ? "EN" : "TR");
        setDisplay("none")
    }
    return (
        <View style={styles.directionRow}>
            <Text style={styles.directionItem}>{from === "TR" ? "TR" : "ENG"}</Text>
            <TouchableOpacity onPress={toggleDirection} style={styles.directionButton} activeOpacity={0.7}>
                <MaterialIcons name="compare-arrows" size={24} color="#4F46E5" />
            </TouchableOpacity>
            <Text style={styles.directionItem}>{from === "TR" ? "ENG" : "TR"}</Text>
        </View>
    )
}