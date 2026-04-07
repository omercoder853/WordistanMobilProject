import { View,Text,TouchableOpacity } from "react-native";
import { useGame } from "../../contextapis/GamesContext";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../gameStyles/mcqStyles";
import alertStyles from "../../commonComponents/customAlert/customAlertStyle";
import { useNavigation,useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function FinishGame(){
    const { t } = useTranslation();
    const router = useRoute()
    const {remainTime,totalTry} = router.params
    const navigation = useNavigation();
    const {numberQuestion,userAnswers,gameType} = useGame();
    let true_count;
    let empty_count;
    let success;
    switch (gameType) {
        case "mcq":
            true_count = userAnswers.filter(answer=>answer.userAnswer == answer.correctAnswer).length;
            empty_count = numberQuestion - userAnswers.length
            success = Math.ceil(100*true_count/numberQuestion)
            break;
        case "wc":
            true_count = userAnswers.filter(ans=>ans.userAnswer.join('').toLocaleLowerCase('tr-TR') == ans.answer.toLocaleLowerCase('tr-TR')).length
            empty_count = numberQuestion - userAnswers.length
            success = Math.ceil(100*true_count/numberQuestion)
            break;
        case "mp":
            true_count = userAnswers.length
            empty_count = numberQuestion - true_count
            success = Math.ceil(100*true_count/totalTry)
            break;
        default:
            break;
    }
    const wrong_count = numberQuestion - empty_count - true_count
    return(
        <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center',width:'90%',alignSelf:'center'}}>
            <View style={styles.gameResultRow}>
                <View style={[styles.gameResulItem,{backgroundColor:"blue"}]}>
                    <Text style={styles.resultLabel}>{t('total')}</Text>
                    <Text style={styles.result}>{numberQuestion}</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"gray"}]}>
                    <Text style={styles.resultLabel}>{t('remTime')}</Text>
                    <Text style={styles.result}>{remainTime} sec</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"purple"}]}>
                    <Text style={styles.resultLabel}>{t('success')}</Text>
                    <Text style={styles.result}>{success} %</Text>
                </View>
            </View>
            <View style={styles.gameResultRow}>
                <View style={[styles.gameResulItem,{backgroundColor:"green"}]}>
                    <Text style={styles.resultLabel}>{t('correct')}</Text>
                    <Text style={styles.result}>{true_count}</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"red"}]}>
                    <Text style={styles.resultLabel}>{t('wrong')}</Text>
                    <Text style={styles.result}>{wrong_count}</Text>
                </View>
                <View style={[styles.gameResulItem,{backgroundColor:"orange"}]}>
                    <Text style={styles.resultLabel}>{t('passed')}</Text>
                    <Text style={styles.result}>{empty_count}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',marginTop:30,gap:15}}>
                <TouchableOpacity style={alertStyles.defaultButton} onPress={()=>navigation.replace("MainTabs",{screen:"Home"})}>
                    <Text style={{textAlign:'center',color:'white',fontWeight:'900'}}>{t('home')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={alertStyles.success} onPress={()=>navigation.replace("MainTabs",{screen:"Games"})}>
                    <Text style={{textAlign:'center',color:'white',fontWeight:'900'}}>{t('newGame')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}