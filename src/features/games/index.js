import {View,ScrollView} from 'react-native';
import Game from './components/GameListItem';
import { useTranslation } from 'react-i18next';

const Games = () => {
    const { t } = useTranslation();
    const gameObjects = [
        {id:"wc",name:t('wcName'),desc:t('wcDesc'),cover:require("./assets/word_completion_cover.png")},
        {id:"mcq",name:t('mcqName'),desc:t('mcqDesc'),cover:require("./assets/multiple_choice_cover.png")},
        {id:"mp",name:t('mpName'),desc:t('mpDesc'),cover:require("./assets/matching_pairs_cover.png")}]

    return (
        <View style={{flex:1,width:'90%',alignSelf:'center'}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{paddingVertical:25}}>
                {gameObjects.map((game,index)=> <Game key={index} item={game}/>)}
            </ScrollView>
        </View>
    )
}

export default Games;