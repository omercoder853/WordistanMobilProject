import {View,Text,TouchableOpacity} from 'react-native'
import {Feather,Entypo} from '@expo/vector-icons';
import styles from '../HomePageStyles/homeStyles';
import { useState } from "react";


const DailyWord = () => {
    const [isFavorite,setFavorite] = useState(false)

    const heartToggle = () => {
        setFavorite(!isFavorite)
}
    return (
        <View style={styles.dailyWordContainer}>
            <View style={styles.dailyWordRow}> 
                <Text style={styles.dailyWordTitle}>Word of the Day</Text>
                <View style={styles.dailyWordButtons}>
                    <TouchableOpacity>
                        <Feather style={{marginRight:9}} name="volume-2" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={heartToggle}>
                        <Entypo name={isFavorite?"heart":"heart-outlined"} size={24} color={isFavorite?"red":"black"} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.dailyWordLabel}>Word</Text>
            <Text style={styles.dailyWordContent}>Paper</Text>
            <Text style={styles.dailyWordLabel}>Meaning</Text>
            <Text style={styles.dailyWordContent}>Kağıt</Text>
            <Text style={styles.dailyWordLabel}>In Sentence</Text>
            <Text style={[styles.dailyWordContent,{color:'#555555'}]}>Do you have any paper ?</Text>
        </View>
    )
}

export default DailyWord;