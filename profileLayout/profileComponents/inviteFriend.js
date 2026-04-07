import { View,Text,TouchableOpacity } from "react-native";
import styles from "../profileStyle/styles";
import {Octicons,Entypo} from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
export default function InviteFriend(){
    const { t } = useTranslation();
    return (
        <TouchableOpacity>
            <View style={styles.inviteButton}>
                <View style={{backgroundColor:'white',padding:6,borderRadius:16,marginHorizontal:10}}>
                    <Octicons name="people" size={25} color="#8DB580" />
                </View>
                <View>
                    <Text style={{fontSize:15,fontWeight:'900',marginBottom:3}}>{t('inviteFriend')}</Text>
                    <Text style={{fontSize:12,color:'#64748B'}}>{t('get100XP')}</Text>
                </View>
                <Entypo style={{marginLeft:'auto',marginRight:10}} name="chevron-small-right" size={30} color="black" />
            </View>
        </TouchableOpacity>
    )
}