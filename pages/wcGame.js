import { View,Text,TextInput,Keyboard,TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGame } from "../contextapis/GamesContext";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../commonComponents/customAlert/customAlert";
import GameHeader from "../gamesLayout/gameComponents/gameHeader";
import { useState,useEffect,useRef } from "react";
import styles from "../gamesLayout/gameStyles/wcStyles";
import QuestionNavigation from "../gamesLayout/gameComponents/questionNavigations";

export default function WordCompletionPage(){
    const navigation = useNavigation();
    const {hints,questions,visibleFirstLetter,userAnswers,setUserAnswers,seconds,numberQuestion} = useGame();
    const [remainTime,setremainTime] = useState(numberQuestion * seconds)
    const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0)
    const [exitVisible,setExitVisible] = useState(false)
    const [emptyQuestion,setEmptyQuestion]  = useState(false)
    const [isPause,setPause] = useState(false)
    const inputs = useRef([])

    const question = questions[currentQuestionIndex].question
    const answer = questions[currentQuestionIndex].answer
    const isAnswered = userAnswers.find((ans)=>ans.question == currentQuestionIndex)
    const [currentLetters,setCurrentLetters] = useState([])

    useEffect(()=>{
        let baseList = new Array(answer.length).fill("")
        if (visibleFirstLetter) {
            baseList[0] = answer[0]
        }
        setCurrentLetters(baseList)
        inputs.current = [];
    },[currentQuestionIndex])

    const handleTextChange = (text, index) => {
    if (text.length > 0 && index < answer.length - 1) {
        inputs.current[index + 1].focus();
    }
    const updated = [...currentLetters]
    updated[index] = text;
    const isAllFilled = updated.filter(char => char !== "" && char !== undefined).length === answer.length;
    if (isAllFilled) {
        setUserAnswers((prev)=>{
            return [...prev,{question:currentQuestionIndex,answer,userAnswer:updated}]
        })
    }
    setCurrentLetters(updated)
    }

    const handleBackPress = (index) =>{
        if (currentLetters[index]=="" && index>0) {
            inputs.current[index-1].focus();
        }
        else {
            const tempList = [...currentLetters]
            tempList[index] = "";
            setCurrentLetters(tempList)
        }
    }

    useEffect(() => {
    const timer = setTimeout(() => {
        if (visibleFirstLetter) {
            if (inputs.current[1]) {
                inputs.current[1].focus()
            }
        }
        else{
            if (inputs.current[0]) {
                inputs.current[0].focus()
            }
        }
    }, 500); 
    return () => clearTimeout(timer)}, [currentQuestionIndex]); 

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
            Keyboard.dismiss()
            navigation.replace("Finish Game",{remainTime})
            return
        }

        if (isPause) return;

        const timer = setTimeout(()=>{
            setremainTime(remainTime-1)
        },1000)

        return () => clearTimeout(timer);
    })

    return (
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
        <SafeAreaView style={styles.mainContainer}>
                <GameHeader hints={hints} remainTime={remainTime}/>
                <View style={styles.questionArea}>
                    <Text style={styles.question}>{question}</Text>
                </View>
                <View style={styles.lettersArea} key={currentQuestionIndex}>
                    {Array.from(answer).map((char,index)=>(
                        <View key={index} style={styles.letterInputContainer}>
                            <TextInput onChangeText={(value)=>handleTextChange(value,index)} 
                            ref={(el)=>inputs.current[index] = el} 
                            style={[styles.letterInput,!isAnswered ? {} : isAnswered.userAnswer[index].toLowerCase()==answer[index].toLowerCase() 
                            ? {backgroundColor:'green'}
                            :{backgroundColor:'red'}]}
                            autoCapitalize="characters" autoCorrect={false} spellCheck={false
                                
                            }
                            onKeyPress={(e)=>{
                                if (e.nativeEvent.key === 'Backspace') {
                                    handleBackPress(index)
                                }
                            }} 
                            maxLength={1} editable={isAnswered ? false : visibleFirstLetter && index===0 ? false : true} 
                            value={isAnswered ? isAnswered.userAnswer[index] : currentLetters[index] || ""} />
                        </View>
                    ))}
                </View>

                <QuestionNavigation currentQuestion={currentQuestionIndex} 
                    setCurrentQuestion={setCurrentQuestionIndex} setVisible={setExitVisible} 
                    setEmptyQuestion={setEmptyQuestion} setPause={setPause} remainTime={remainTime}/>
                
                <CustomAlert visible={exitVisible} title="Warning!" buttons={[
                    {text:"Exit",style:"danger",action:()=>{setExitVisible(false),
                        navigation.replace("MainTabs",{screen:"Games"})}},
                    {text:"Cancel",style:"cancel",action:()=>{setExitVisible(false),setPause(false)}}]} 
                message="Do you really want to exit the game? Your process will not be saved."/>
                <CustomAlert visible={emptyQuestion} title="Warning" message="Finish with unanswered questions?" 
                buttons={[{text:"Cancel",style:"cancel",action:()=>setEmptyQuestion(false)},
                    {text:"Finish",action:()=>{setEmptyQuestion(false),navigation.replace("Finish Game",{remainTime})}}
                ]}/>
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}