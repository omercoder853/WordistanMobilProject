import {View,Text,TouchableOpacity,Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../gamesLayout/gameStyles/mpStyles";
import { useGame } from "../contextapis/GamesContext";
import { useState,useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../gamesLayout/gameComponents/gameHeader";
import QuestionNavigation from "../gamesLayout/gameComponents/questionNavigations";
import CustomAlert from "../commonComponents/customAlert/customAlert";


export default function MatchingPairsPage(){
    const navigation = useNavigation();
    const {hints,questions,seconds,numberQuestion,perPage,randomIndexCreater,userAnswers,setUserAnswers} = useGame();
    const [remainTime,setRemainTime] = useState(seconds * numberQuestion)
    const [currentQuestionPage,setCurrentQuestionPage] = useState(0)
    const [exitVisible,setExitVisible] = useState(false)
    const [emptyQuestion,setEmptyQuestion]  = useState(false)
    const [isPause,setPause] = useState(false)
    const [currentQuestions,setCurrentQuestions] = useState([])
    const [currentAnswers,setCurrentAnswers] = useState([])
    const [questionCounter,setQuestionCounter] = useState(0)
    const [selectedQuestion,setSelectedQuestion] = useState();
    const [selectedAnswer,setSelectedAnswer] = useState([])
    const [totalTry,setTotalTry] = useState(0)
    useEffect(()=>{
        const isExist = currentQuestions.some((questionList)=>questionList.id == currentQuestionPage)
        if (!isExist) {
            let tempAnswers = [];
            let tempQuestions = [];
            let usedIndexes = new Set();
            for (let i = currentQuestionPage*perPage; i < (currentQuestionPage+1)*perPage ; i++) {
                if (questions[i]) {
                    tempQuestions.push(questions[i].question)
                    tempAnswers.push(questions[i].answer)
                    setQuestionCounter(questionCounter+1)
                }
            }
            setCurrentQuestions((prev)=>{
                return [...prev,{id:currentQuestionPage,questions:tempQuestions}]
            })
            let randomAnswers = []
            let correctIndexes = []
            for (let i = 0; i < tempAnswers.length; i++) {
                let randomIndex;
                do {
                    randomIndex = randomIndexCreater({target_words:tempAnswers,length:null})
                } while (usedIndexes.has(randomIndex));
                randomAnswers[randomIndex] = tempAnswers[i]
                correctIndexes.push(randomIndex)
                usedIndexes.add(randomIndex)
            }
            setCurrentAnswers((prev)=>{
                return [...prev,{id:currentQuestionPage,answers:randomAnswers,correctIndexes}]
            })
        }
    },[currentQuestionPage])

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
            navigation.replace("Finish Game",{remainTime,totalTry})
            return
        }

        if (isPause) return;

        const timer = setTimeout(()=>{
            setRemainTime(remainTime-1)
        },1000)

        return () => clearTimeout(timer);
    })

    const getDynamicQuestionStyle = (ind)=>{
        if (selectedQuestion !== null && selectedQuestion!==undefined) {
            if (ind === selectedQuestion) {
                return {backgroundColor:'#4A3B5D',borderColor:"#A38CB8"}
            }
            else {
                return {backgroundColor:'#322B3D',borderColor:"#453D52"}
            }
        }
    }
    
    const getDynamicAnswerStyle = (ind)=>{
        if (selectedQuestion !== null && selectedQuestion!==undefined) {
            if (selectedAnswer !== undefined && selectedAnswer != null) {
                if (selectedAnswer === ind) {
                    if (checkList[selectedQuestion] === ind) {
                        return {backgroundColor:"green"}
                    }
                    else {
                        return {backgroundColor:"red"}
                    }
                }
                else {
                    return {}
                }
            }
            return {backgroundColor:'#2D2438',borderColor:'#5A4E6B'}
        }
    }

    const dynamicDisabledMaker = (ind,trigger,key)=>{
        if (isAnswered(ind,key)) {
            return true
        }
        if (trigger !== undefined && trigger !== null) {
            if (trigger == ind) {
                return false
            }
            return true
        }
        return false
    }

    const selectQuestionHandler = (ind)=>{
        setSelectedAnswer(null)
        if (selectedQuestion !== undefined && selectedQuestion !== null) {
            setSelectedQuestion(null)
        }
        else {
            setSelectedQuestion(ind)
        }
    }

    const selectAnswerHandler = (ind) =>{
        if (selectedAnswer == null && selectedAnswer == undefined) {
            setTotalTry((prev)=>prev+1)
            setSelectedAnswer(ind)
            if (checkList[selectedQuestion] === ind) {
                setUserAnswers((prev)=>{
                    return [...prev,{currentPage:currentQuestionPage,question:selectedQuestion,answer:ind}]
                })
                const timer = setTimeout(()=>{
                    setSelectedQuestion(null)
                    setSelectedAnswer(null)
                },800)
            }
            else {
                const timer = setTimeout(()=>{
                    setSelectedAnswer(null)
                },800)
            }
        }
        else{setSelectedAnswer(null)}
    }

    const isAnswered = (ind,key)=>{
        return userAnswers.some((ans)=>ans.currentPage===currentQuestionPage && ans[key] === ind)
    }

    const questionList = currentQuestions.find((q)=>q.id==currentQuestionPage)?.questions
    const answerList = currentAnswers.find((a)=>a.id === currentQuestionPage)?.answers
    const checkList = currentAnswers.find((a)=>a.id === currentQuestionPage)?.correctIndexes
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GameHeader hints={hints} remainTime={remainTime}/>
            <View style={styles.gameContainer}>
                <View style={styles.questionArea}>
                    {questionList?.map((question,ind)=>(
                        <Pressable disabled={dynamicDisabledMaker(ind,selectedQuestion,"question")} 
                        onPress={()=>selectQuestionHandler(ind)} 
                        style={[styles.question,getDynamicQuestionStyle(ind),isAnswered(ind,"question") && {backgroundColor:'green'}]} key={ind}>
                            <Text style={{textAlign:'center',color:'white'}}>{question}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.answerArea}>
                    {answerList?.map((answer,ind)=>(
                        <Pressable key={ind} style={[styles.answer,getDynamicAnswerStyle(ind),isAnswered(ind,"answer") && {backgroundColor:'green'}]} 
                         onPress={()=>selectAnswerHandler(ind)} 
                         disabled={dynamicDisabledMaker(ind,selectedAnswer,"answer")} >
                            <Text style={{textAlign:'center',color:'white'}}>{answer}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            <QuestionNavigation currentQuestion={currentQuestionPage} setPause={setPause} remainTime={remainTime} perPage={perPage}
            setCurrentQuestion={setCurrentQuestionPage} setVisible={setExitVisible} setEmptyQuestion={setEmptyQuestion} 
            setSelectedQuestion = {setSelectedQuestion} totalTry={totalTry}/>
            
            <CustomAlert visible={exitVisible} title="Warning!" buttons={[
                {text:"Exit",style:"danger",action:()=>{setExitVisible(false),
                    navigation.replace("MainTabs",{screen:"Games"})}},
                {text:"Cancel",style:"cancel",action:()=>{setExitVisible(false),setPause(false)}}]} 
            message="Do you really want to exit the game? Your process will not be saved."/>

            <CustomAlert visible={emptyQuestion} title="Warning" message="Finish with unanswered questions?" 
            buttons={[{text:"Cancel",style:"cancel",action:()=>{setEmptyQuestion(false),setPause(false)}},
                {text:"Finish",action:()=>{setEmptyQuestion(false),navigation.replace("Finish Game",{remainTime,totalTry})}}
            ]}/>
        </SafeAreaView>
    )
}