import { View, Text, TouchableOpacity } from "react-native";
import styles from "../translateStyles/transStyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";

export default function ResultArea({display,result,setVisible}) {
    const { t } = useTranslation();
    const isValidResult = result !== "Result not Found"  
    return (
    <View style={[styles.resultContainer, { display: display }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#1F2937' }}>{result}</Text>
            {isValidResult && (
            <TouchableOpacity style={{ marginLeft: 'auto', backgroundColor: '#F3F4F6', padding: 8, borderRadius: 20 }}>
                <Ionicons name="volume-medium" size={24} color="#4F46E5" />
            </TouchableOpacity>) }
        </View>
        {isValidResult && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 16, fontStyle: 'italic', flex: 1 }}>[rezolt]</Text>
            <TouchableOpacity onPress={()=>setVisible(true)} style={styles.addMyDictButton} activeOpacity={0.7}>
                <Ionicons name="add-circle" size={20} color="#4F46E5" />
                <Text style={styles.addMyDictButtonText}>{t('addToDict')}</Text>
            </TouchableOpacity>
        </View>)}
    </View>
    )
}