import {View,Text,TouchableOpacity,StyleSheet} from 'react-native'
import {AntDesign,FontAwesome} from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useUserStats } from '../../contextapis/UserStatsContext';
const StatRow = () => {
    const { t } = useTranslation();
    const {userStats,pendingEarnedXP} = useUserStats();
    return(
        <View style={styles.statRow}>
            <TouchableOpacity style={styles.statItemButton}>
                <View style={styles.statItemRow}>
                    <View style={[styles.statColumn,{marginRight:30}]}>
                        <AntDesign name="fire" size={24} color="#FF8A3D" />
                        <Text style={{fontSize:12,color:'gray'}}>{t('streak')}</Text>
                    </View>
                    <View style={styles.statColumn}>
                        <Text style={{fontWeight:'900',fontSize:20}}>{userStats?.current_streak || 0}</Text>
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
                    <Text style={{fontWeight:'900',fontSize:20}}>{(userStats?.total_xp || 0) + (pendingEarnedXP || 0)}</Text>
                    <Text>{t('xp')}</Text>
                </View>
            </View>
            </TouchableOpacity>
        </View>
    )
}

export default StatRow;

const styles = StyleSheet.create({
    statRow:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        paddingHorizontal:15,
        gap:10,
        marginTop:5
    },
    statItemButton:{
        borderRadius:25,
        borderWidth:1,
        borderColor:'#E6E1F0',
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor:'white',
        flex:1,
        height:70,
        elevation:5
    },
    statItemRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    statColumn:{
        alignItems:'center'
    },
})