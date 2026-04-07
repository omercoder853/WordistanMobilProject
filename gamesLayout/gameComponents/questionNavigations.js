import {View,Text,TouchableOpacity} from 'react-native'
import styles from '../gameStyles/styles'
import { useGame } from '../../contextapis/GamesContext'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from "react-i18next";

export default function QuestionNavigation({currentQuestion,setCurrentQuestion,
    setVisible,setEmptyQuestion,setPause,remainTime,perPage,setSelectedQuestion,totalTry}){
    const { t } = useTranslation();
    const {numberQuestion,userAnswers,gameType} = useGame();
    const navigation = useNavigation()
    const isFirst = currentQuestion+1==1
    let isLast;
    if (gameType==="mp") {
        isLast = currentQuestion+1==Math.ceil(numberQuestion/perPage)
    }
    else{
        isLast = currentQuestion+1==numberQuestion
    } 
    const nextQuestion = ()=>{
        if (gameType==="mp") {
            setSelectedQuestion(null)
        }
        setCurrentQuestion(currentQuestion+1)
    }
    const pastQuestion = ()=>{
        setCurrentQuestion(currentQuestion-1)
    }
    const finishGame = ()=>{
        if (userAnswers.length < numberQuestion) {
            setPause(true)
            setEmptyQuestion(true)
        }
        else{
            setPause(true)
            if (gameType=="mp") {
                navigation.replace("Finish Game",{remainTime,totalTry})
            }
            else{
                navigation.replace("Finish Game",{remainTime})
            }
            
        }
    }
    return (
        <View style={styles.questionNavArea}>
            <TouchableOpacity style={[styles.questionNavButton,{backgroundColor:'#E5989B'}]} onPress={isFirst ? ()=>{setVisible(true),setPause(true)}:pastQuestion}>
                <Text>{isFirst ? t('exit'):t('back')}</Text>
            </TouchableOpacity>
            <Text style={{color:'white'}}>{currentQuestion+1}/{gameType=="mp" ? Math.ceil(numberQuestion/perPage) : numberQuestion}</Text>
            <TouchableOpacity style={[styles.questionNavButton,{backgroundColor:'#94C973'}]} onPress={isLast ? finishGame : nextQuestion}>
                <Text>{isLast ? t('finish'):t('next')}</Text>
            </TouchableOpacity>
        </View>
    )
}