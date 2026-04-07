import { View,Text,TouchableOpacity } from "react-native";
import {FontAwesome5,MaterialCommunityIcons,Ionicons,Feather} from '@expo/vector-icons';
import styles from "../profileStyle/styles";
import { useTranslation } from "react-i18next";

export default function HeaderTopRow(){
    const { t } = useTranslation();
    return (
        <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerRowButtons}>
                <Feather name="share-2" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.subscriptionArea}>
                <MaterialCommunityIcons name="star-four-points" size={12} color="#8B5CF6" />
                <Text style={{color:'#8B5CF6',fontWeight:'500'}}>{t('premium')}</Text>
            </View>
            <TouchableOpacity style={styles.headerRowButtons}>
                <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}
