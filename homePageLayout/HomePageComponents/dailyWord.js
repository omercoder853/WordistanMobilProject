import {View,Text,TouchableOpacity} from 'react-native'
import {Feather,Entypo} from '@expo/vector-icons';
import styles from '../HomePageStyles/homeStyles';
import { useState } from "react";
import { useTranslation } from 'react-i18next';


const DailyWord = () => {
    const {t} = useTranslation();
    const [isFavorite,setFavorite] = useState(false)

    const heartToggle = () => {
        setFavorite(!isFavorite)
}
    return (
        <View style={styles.dailyWordContainer}>
            <View style={styles.dailyWordRow}> 
                <Text style={styles.dailyWordTitle}>{t('wordOfTheDay')}</Text>
                <View style={styles.dailyWordButtons}>
                    <TouchableOpacity>
                        <Feather style={{marginRight:9}} name="volume-2" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={heartToggle}>
                        <Entypo name={isFavorite?"heart":"heart-outlined"} size={24} color={isFavorite?"red":"black"} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.dailyWordLabel}>{t('word')}</Text>
            <Text style={styles.dailyWordContent}>Paper</Text>
            <Text style={styles.dailyWordLabel}>{t('meaning')}</Text>
            <Text style={styles.dailyWordContent}>Kağıt</Text>
            <Text style={styles.dailyWordLabel}>{t('inSentence')}</Text>
            <Text style={[styles.dailyWordContent,{color:'#555555'}]}>Do you have any paper ?</Text>
        </View>
    )
}

export default DailyWord;