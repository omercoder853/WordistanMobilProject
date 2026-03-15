import {View,Text,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../gamesLayout/gameStyles/mcqStyles";
import QuizOption from "../gamesLayout/gameComponents/mcqOptions";
import QuestionNavigation from "../gamesLayout/gameComponents/questionNavigations";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGame } from "../contextapis/GamesContext";
import { useState,useEffect } from "react";
import CustomAlert from "../commonComponents/customAlert/customAlert"
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../gamesLayout/gameComponents/gameHeader";

export default function MultipleChoiceGamePage(){
    const navigation = useNavigation();
    const {hints,questions,seconds,numberQuestion} = useGame();
    const [remainTime,setRemainTime] = useState(seconds * numberQuestion)
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
    
    useEffect(()=>{
        if (remainTime==0) {
            navigation.replace("Finish Game",{remainTime})
            return
        }

        if (isPause) return;

        const timer = setTimeout(()=>{
            setRemainTime(remainTime-1)
        },1000)

        return () => clearTimeout(timer);
    })

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

            <CustomAlert visible={exitVisible} title="Warning!" buttons={[
                {text:"Exit",style:"danger",action:()=>{setExitVisible(false),
                    navigation.replace("MainTabs",{screen:"Games"})}},
                {text:"Cancel",style:"cancel",action:()=>{setExitVisible(false),setPause(false)}}]} 
            message="Do you really want to exit the game? Your process will not be saved."/>

            <CustomAlert visible={emptyQuestion} title="Warning" message="Finish with unanswered questions?" 
            buttons={[{text:"Cancel",style:"cancel",action:()=>{setEmptyQuestion(false),setPause(false)}},
                {text:"Finish",action:()=>{setEmptyQuestion(false),navigation.replace("Finish Game",{remainTime})}}
            ]}/>
        </SafeAreaView>
    )
}