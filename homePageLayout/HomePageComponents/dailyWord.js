import {View,Text,TouchableOpacity} from 'react-native'
import {Feather,Entypo} from '@expo/vector-icons';
import styles from '../HomePageStyles/homeStyles';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';


const DailyWord = () => {
    const {t} = useTranslation();
    const [isFavorite,setFavorite] = useState(false)

    const heartToggle = () => {
        setFavorite(!isFavorite)
}
    return (
        <LinearGradient colors={['#FF928A', '#DA87D6', '#C382FE']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.dailyWordContainer}>
            <View style={styles.dailyWordRow}> 
                <Text style={[styles.dailyWordTitle, {color: 'white'}]}>{t('wordOfTheDay')}</Text>
                <View style={styles.dailyWordButtons}>
                    <TouchableOpacity style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20, marginRight: 8}}>
                        <Feather name="volume-2" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={heartToggle} style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20}}>
                        <Entypo name={isFavorite?"heart":"heart-outlined"} size={20} color={isFavorite?"red":"white"} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={[styles.dailyWordLabel, {color: 'rgba(255,255,255,0.8)'}]}>{t('word')}</Text>
            <Text style={[styles.dailyWordContent, {color: 'white', fontSize: 28, marginTop: 5}]}>Paper</Text>
            <Text style={[styles.dailyWordLabel, {color: 'rgba(255,255,255,0.8)'}]}>{t('meaning')}</Text>
            <Text style={[styles.dailyWordContent, {color: 'white', fontSize: 18}]}>Kağıt</Text>
            <Text style={[styles.dailyWordLabel, {color: 'rgba(255,255,255,0.8)'}]}>{t('inSentence')}</Text>
            <Text style={[styles.dailyWordContent, {color:'white'}]}>Do you have any paper ?</Text>
        </LinearGradient>
    )
}

export default DailyWord;