import {View,Text,TouchableOpacity} from 'react-native'
import styles from '../HomePageStyles/homeStyles'
import {AntDesign,FontAwesome} from '@expo/vector-icons';

const StatRow = () => {
    return(
        <View style={styles.statRow}>
            <TouchableOpacity style={styles.statItemButton}>
                <View style={styles.statItemRow}>
                    <View style={[styles.statColumn,{marginRight:30}]}>
                        <AntDesign name="fire" size={24} color="#FF8A3D" />
                        <Text style={{fontSize:12,color:'gray'}}>Streak</Text>
                    </View>
                    <View style={styles.statColumn}>
                        <Text style={{fontWeight:'900',fontSize:20}}>7</Text>
                        <Text>Days</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItemButton}>
            <View style={styles.statItemRow}>
                <View style={[styles.statColumn,{marginRight:30}]}>
                    <FontAwesome name="diamond" size={24} color="#4DA3FF" />
                </View>
                <View style={styles.statColumn}>
                    <Text style={{fontWeight:'900',fontSize:20}}>3500</Text>
                    <Text>XP</Text>
                </View>
            </View>
            </TouchableOpacity>
        </View>
    )
}

export default StatRow;