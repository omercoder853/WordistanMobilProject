import {View,Text,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../gamesLayout/gameStyles/mcqStyles";
import QuizOption from "../gamesLayout/gameComponents/mcqOptions";
import QuestionNavigation from "../gamesLayout/gameComponents/questionNavigations";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGame } from "../contextapis/GamesContext";
import { useState,useEffect,useRef } from "react";
import CustomAlert from "../commonComponents/customAlert/customAlert"
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../gamesLayout/gameComponents/gameHeader";
import { useTranslation } from "react-i18next";

export default function MultipleChoiceGamePage(){
    const { t } = useTranslation();
    const navigation = useNavigation();
    const {hints,questions,seconds,numberQuestion} = useGame();
    const [remainTime,setRemainTime] = useState(numberQuestion * seconds)
    const [currentQuestion,setCurrentQuestion] = useState(0)
    const [exitVisible,setExitVisible] = useState(false)
    const [emptyQuestion,setEmptyQuestion]  = useState(false)
    const [isPause,setPause] = useState(false)
    
    const options = questions[currentQuestion].options
    const correctOption = questions[currentQuestion].correctAnswerIndex

    useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    if (remainTime>0 && e.data.action.type === "GO_BACK") {
        e.preventDefault();
        setPause(true);
        setExitVisible(true)
    } });
    return unsubscribe;}, [navigation,remainTime]);

    /* ---------- TIMER ---------- */

    const totalMs = seconds * numberQuestion * 1000
    const targetEndTimeRef = useRef(Date.now() + totalMs)
    const remainingMsRef = useRef(totalMs)

    useEffect(()=>{
        if (isPause) {
            remainingMsRef.current = Math.max(0,targetEndTimeRef.current - Date.now());
            return
        }
        targetEndTimeRef.current = Date.now() + remainingMsRef.current;

        const interval = setInterval(() => {
            const diff = targetEndTimeRef.current - Date.now();
            const currentRemainSec = Math.max(0,Math.ceil(diff / 1000));
            setRemainTime(currentRemainSec);
            
            if (diff <= 0 ) {
                clearInterval(interval);
                navigation.replace("Finish Game",{remainTime:0})
            }

        },500);
        return () => clearInterval(interval);
    },[isPause]);


    return (
        <SafeAreaView style={styles.mainContainer}>
            <GameHeader hints={hints} remainTime={remainTime}/>
            <View style={styles.questionArea}>
                <Text style={{fontSize:35,color:'white',fontWeight:'900'}}>{questions[currentQuestion].question}</Text>
            </View>
            <TouchableOpacity style={[styles.gameStatItem,{marginLeft:'auto',marginBottom:10}]}>
                <MaterialIcons name="lightbulb-outline" size={24} color="yellow" />
            </TouchableOpacity>
            <View style={styles.optionArea}>
                {options.map((option,index)=><QuizOption option={option} key={index} 
                index={index} correctIndex={correctOption} currentQuestion={currentQuestion}/>)}
            </View>
            <QuestionNavigation currentQuestion={currentQuestion} 
            setCurrentQuestion={setCurrentQuestion} setVisible={setExitVisible} 
            setEmptyQuestion={setEmptyQuestion} setPause={setPause} remainTime={remainTime}/>

            <CustomAlert visible={exitVisible} title={t('warning')} buttons={[
                {text:t('exit'),style:"danger",action:()=>{setExitVisible(false),
                    navigation.replace("MainTabs",{screen:"Games"})}},
                {text:t('cancel'),style:"cancel",action:()=>{setExitVisible(false),setPause(false)}}]} 
            message={t('exitGameWarning')}/>

            <CustomAlert visible={emptyQuestion} title={t('warningShort')} message={t('finishWithUnanswered')} 
            buttons={[{text:t('cancel'),style:"cancel",action:()=>{setEmptyQuestion(false),setPause(false)}},
                {text:t('finish'),action:()=>{setEmptyQuestion(false),navigation.replace("Finish Game",{remainTime})}}
            ]}/>
        </SafeAreaView>
    )
}