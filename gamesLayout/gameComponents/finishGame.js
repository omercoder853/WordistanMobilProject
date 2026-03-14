import { View,Text,TouchableOpacity } from "react-native";
import { useGame } from "../../contextapis/GamesContext";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../gameStyles/mcqStyles";
import alertStyles from "../../commonComponents/customAlert/customAlertStyle";
import { useNavigation,useRoute } from "@react-navigation/native";

export default function FinishGame(){
    const router = useRoute()
    const {remainTime} = router.params
    const navigation = useNavigation();
    const {numberQuestion,userAnswers,gameType} = useGame();
    let true_count;
    switch (gameType) {
        case "mcq":
            true_count = userAnswers.filter(answer=>answer.userAnswer == answer.correctAnswer).length;
            break;
        case "wc":
            true_count = userAnswers.filter(ans=>ans.userAnswer.join('').toLowerCase() == ans.answer.toLowerCase()).length
        default:
            break;
    }

    const empty_count = numberQuestion - userAnswers.length
    const wrong_count = numberQuestion - empty_count - true_count
    return(
        <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center',width:'90%',alignSelf:'center'}}>
            <View style={styles.gameResultRow}>
                <View style={[styles.gameResulItem,{backgroundColor:"blue"}]}>
                    <Text style={styles.resultLabel}>Total</Text>
                    <Text style={styles.result}>{numberQuestion}</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"gray"}]}>
                    <Text style={styles.resultLabel}>Rem. Time</Text>
                    <Text style={styles.result}>{remainTime} sec</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"purple"}]}>
                    <Text style={styles.resultLabel}>Success</Text>
                    <Text style={styles.result}>{Math.ceil(100*true_count/numberQuestion)} %</Text>
                </View>
            </View>
            <View style={styles.gameResultRow}>
                <View style={[styles.gameResulItem,{backgroundColor:"green"}]}>
                    <Text style={styles.resultLabel}>Correct</Text>
                    <Text style={styles.result}>{true_count}</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"red"}]}>
                    <Text style={styles.resultLabel}>Wrong</Text>
                    <Text style={styles.result}>{wrong_count}</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"orange"}]}>
                    <Text style={styles.resultLabel}>Passed</Text>
                    <Text style={styles.result}>{empty_count}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',marginTop:30,gap:15}}>
                <TouchableOpacity style={alertStyles.defaultButton} onPress={()=>navigation.replace("MainTabs",{screen:"Home"})}>
                    <Text style={{textAlign:'center',color:'white',fontWeight:'900'}}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={alertStyles.success}>
                    <Text style={{textAlign:'center',color:'white',fontWeight:'900'}} onPress={()=>navigation.replace("MainTabs",{screen:"Games"})}>New Game</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}