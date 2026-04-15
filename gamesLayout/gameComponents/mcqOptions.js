import { View,Text,TouchableOpacity,Vibration } from "react-native";
import styles from "../gameStyles/mcqStyles";
import { useGame } from "../../contextapis/GamesContext";
import { useAuth } from "../../contextapis/AuthContext";
import { useState,useEffect } from "react";

export default function QuizOption({option,correctIndex,index,currentQuestion}){
    const {userAnswers,setUserAnswers} = useGame();
    const {getDataStorage} = useAuth();
    const [isVibrate,setVibrate] = useState(true)
        useEffect(() => {
        const loadVibration = async () => {
            const val = await getDataStorage("vibration");
            setVibrate(val !== null ? JSON.parse(val) : true);
        };
        loadVibration();}, []);
    const isAnswered = userAnswers?.find(answer => answer.question == currentQuestion)
    const isCorrect = isAnswered?.userAnswer === isAnswered?.correctAnswer
    const isSelected = isAnswered?.userAnswer === index

    const clickOption = ()=>{
        isVibrate && Vibration.vibrate(80)
        setUserAnswers((prev)=>{
            return [...prev,{"question":currentQuestion,"userAnswer":index,"correctAnswer":correctIndex}]
        })
    }

    const getDynamicStyle = () =>{
        if (isAnswered) {
            if (isCorrect) {
                return {borderColor:"green",backgroundColor:"#92B4A7"}
            }
            else{return {borderColor:"red",backgroundColor:"#C49292"}}
        }
        return
    }

    return (
        <TouchableOpacity 
        style={[styles.quizOption,isSelected ? getDynamicStyle() : isAnswered && index===isAnswered.correctAnswer && {borderColor:"green",backgroundColor:"#92B4A7"}]}
        onPress={clickOption} disabled={isAnswered ? true:false}>
            <Text style={{fontSize:16,color:'white',marginLeft:25,fontWeight:'900'}}>{option}</Text>
        </TouchableOpacity>
    )
}