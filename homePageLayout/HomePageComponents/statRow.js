import {View,Text,TouchableOpacity} from 'react-native'
import styles from '../HomePageStyles/homeStyles'
import {AntDesign,FontAwesome} from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useUserStats } from '../../contextapis/UserStatsContext';
const StatRow = () => {
    const { t } = useTranslation();
    const {userStats} = useUserStats();
    return(
        <View style={styles.statRow}>
            <TouchableOpacity style={styles.statItemButton}>
                <View style={styles.statItemRow}>
                    <View style={[styles.statColumn,{marginRight:30}]}>
                        <AntDesign name="fire" size={24} color="#FF8A3D" />
                        <Text style={{fontSize:12,color:'gray'}}>{t('streak')}</Text>
                    </View>
                    <View style={styles.statColumn}>
                        <Text style={{fontWeight:'900',fontSize:20}}>{userStats?.current_streak}</Text>
                        <Text>{t('days')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItemButton}>
            <View style={styles.statItemRow}>
                <View style={[styles.statColumn,{marginRight:30}]}>
                    <FontAwesome name="diamond" size={24} color="#4DA3FF" />
                </View>
                <View style={styles.statColumn}>
                    <Text style={{fontWeight:'900',fontSize:20}}>{userStats?.total_xp}</Text>
                    <Text>{t('xp')}</Text>
                </View>
            </View>
            </TouchableOpacity>
        </View>
    )
}

export default StatRow;