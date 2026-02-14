import {} from 'react'
import {View,Text} from 'react-native';
import styles from '../HomePageStyles/homeStyles';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const words = [{id:1,word:"apple",meaning:"elma"},
    {id:2,word:"orange",meaning:"portakal"},
    {id:3,word:"watermelon",meaning:"karpuz"},
    {id:4,word:"pineapple",meaning:"ananas"},
    {id:5,word:"cat",meaning:"kedi"}
]



const RecentWord = ({item}) => {
    return (
        <View style={styles.recentWord}>
            <Text style={{flex:1}}>{item.word}</Text>
            <View style={{ flex: 1, alignItems: "center" }}>
                <FontAwesome name="arrows-h" size={24} color="black" />
            </View>
            <Text style={{flex:1,textAlign:'right'}}>{item.meaning}</Text>
        </View>
    )
}


const RecentWords = () => {
    return (
        <View style={styles.quickMenu}>
            <Text style={{fontWeight:'900',marginBottom:10,fontSize:20}}>Recent Words</Text>
            <View style={{borderColor:'#E8E4F2',borderWidth:1,marginBottom:10}}></View>
            <View>
                {words.map((word) => (<RecentWord key={word.id} item={word} />))}
            </View>
        </View>
    )
}

export default RecentWords