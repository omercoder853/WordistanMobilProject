import { View,Text,TouchableOpacity } from "react-native";
import styles from "../gameStyles/mcqStyles";
import { useGame } from "../../contextapis/GamesContext";

export default function QuizOption({option,correctIndex,index,currentQuestion}){
    const {userAnswers,setUserAnswers} = useGame();

    const isAnswered = userAnswers?.find(answer => answer.question == currentQuestion)
    const isCorrect = isAnswered?.userAnswer === isAnswered?.correctAnswer
    const isSelected = isAnswered?.userAnswer === index

    const clickOption = ()=>{
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