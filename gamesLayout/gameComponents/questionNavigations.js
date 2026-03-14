import {View,Text,TouchableOpacity} from 'react-native'
import mcqStyles from '../gameStyles/mcqStyles'
import styles from '../gameStyles/styles'
import { useState } from 'react'
import { useGame } from '../../contextapis/GamesContext'
import { useNavigation } from '@react-navigation/native'


export default function QuestionNavigation({currentQuestion,setCurrentQuestion,setVisible,setEmptyQuestion,setPause,remainTime}){
    const {numberQuestion,userAnswers} = useGame();
    const navigation = useNavigation()
    const isFirst = currentQuestion+1==1
    const isLast = currentQuestion+1==numberQuestion
    const nextQuestion = ()=>{
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
            navigation.replace("Finish Game",{remainTime})
        }
    }
    return (
        <View style={styles.questionNavArea}>
            <TouchableOpacity style={[styles.questionNavButton,{backgroundColor:'#E5989B'}]} onPress={isFirst ? ()=>{setVisible(true),setPause(true)}:pastQuestion}>
                <Text>{isFirst ? "Exit":"Back"}</Text>
            </TouchableOpacity>
            <Text style={{color:'white'}}>{currentQuestion+1}/{numberQuestion}</Text>
            <TouchableOpacity style={[styles.questionNavButton,{backgroundColor:'#94C973'}]} onPress={isLast ? finishGame : nextQuestion}>
                <Text>{isLast ? "Finish":"Next"}</Text>
            </TouchableOpacity>
        </View>
    )
}