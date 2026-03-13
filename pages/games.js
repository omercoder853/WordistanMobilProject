import {View,Text,ScrollView} from 'react-native';
import Game from '../gamesLayout/gameComponents/game';
import styles from '../gamesLayout/gameStyles/styles';

const gameObjects = [
    {id:"wc",name:"Word Completion",desc:"Complete the word using the given translation.",cover:require("../assets/gamecovers/wc-cover.png")},
    {id:"mcq",name:"Multiple Choice Quiz",desc:"Choose the correct translation before time’s up.",cover:require("../assets/gamecovers/mcq-cover.png")},
    {id:"mp",name:"Matching Pairs",desc:"Match the words with their correct translations.",cover:require("../assets/gamecovers/mp-cover.png")}]

const Games = () => {
    return (
        <View style={{flex:1,width:'90%',alignSelf:'center'}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{paddingVertical:25}}>
                {gameObjects.map((game,index)=> <Game key={index} item={game}/>)}
            </ScrollView>
        </View>
    )
}

export default Games;