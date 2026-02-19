import { View,Text,Image,TouchableOpacity } from "react-native";
import styles from "../DictionariesStyles/dictStyles";
import { useWindowDimensions } from "react-native";

export default function Collection({title}){
    const {width,height} = useWindowDimensions();
    const usableWidth = width - 60
    return (
        <TouchableOpacity>
            <View style={[styles.collectionContainer,{width:usableWidth*0.5}]} >
                <Image source={require('../../assets/dictionary-cover.jpg')} style={{height:usableWidth*0.4,aspectRatio:1,borderRadius:10}}/>
                <Text style={styles.collectionTitle}>{title}</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',gap:3}}>
                    <Text style={styles.collectionTags}>30 words</Text>
                    <Text style={styles.collectionTags}>A1-A2</Text>
                    <Text style={styles.collectionTags}>TR - ENG</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}