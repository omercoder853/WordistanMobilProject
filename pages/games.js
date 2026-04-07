import {View,Text,ScrollView} from 'react-native';
import Game from '../gamesLayout/gameComponents/game';
import styles from '../gamesLayout/gameStyles/styles';
import { useTranslation } from 'react-i18next';

const Games = () => {
    const { t } = useTranslation();
    const gameObjects = [
        {id:"wc",name:t('wcName'),desc:t('wcDesc'),cover:require("../assets/gamecovers/wc-cover.png")},
        {id:"mcq",name:t('mcqName'),desc:t('mcqDesc'),cover:require("../assets/gamecovers/mcq-cover.png")},
        {id:"mp",name:t('mpName'),desc:t('mpDesc'),cover:require("../assets/gamecovers/mp-cover.png")}]

    return (
        <View style={{flex:1,width:'90%',alignSelf:'center'}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{paddingVertical:25}}>
                {gameObjects.map((game,index)=> <Game key={index} item={game}/>)}
            </ScrollView>
        </View>
    )
}

export default Games;