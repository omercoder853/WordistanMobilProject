import {View,Text,TouchableOpacity} from 'react-native'
import styles from '../gameStyles/styles'
import { useGame } from '../../contextapis/GamesContext'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';

export default function QuestionNavigation({currentQuestion,setCurrentQuestion,
    setVisible,setEmptyQuestion,setPause,remainTime,setSelectedQuestion,totalTry}){
    const { t } = useTranslation();
    const {numberQuestion,userAnswers,gameType,autoCont,perPage} = useGame();
    const navigation = useNavigation()
    const isFirst = currentQuestion+1==1
    let isLast;
    let isAnswered;
    if (gameType==="mp") {
        isLast = currentQuestion+1==Math.ceil(numberQuestion/perPage)
        if (isLast) {
            isAnswered = userAnswers.filter((ans)=>ans.currentPage==currentQuestion).length == numberQuestion%perPage
        }
        else {
            isAnswered = userAnswers.filter((ans)=>ans.currentPage==currentQuestion).length == perPage
        }
    }
    else{
        isLast = currentQuestion+1==numberQuestion
        isAnswered = userAnswers.some((answer)=>answer.question==currentQuestion)
    } 
    const nextQuestion = ()=>{
        if (gameType==="mp") {
            setSelectedQuestion(null)
        }
        else{setContAllow(true)}
        setCurrentQuestion(currentQuestion+1)
    }
    
    const [contAllowed,setContAllow] = useState(autoCont)
    useEffect(()=>{
        if (!isAnswered) {
            setContAllow(true)
        }
        else{setContAllow(false)}
    },[currentQuestion])

    useEffect(() => {
    if (autoCont && isAnswered && !isLast && contAllowed) {
        const timer = setTimeout(()=>nextQuestion(),700);
        return ()=>clearTimeout(timer);
    }}, [isAnswered, autoCont, isLast,contAllowed]);

    const pastQuestion = ()=>{
        setContAllow(false)
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