import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../gamesLayout/gameStyles/mcqStyles";
import QuizOption from "../gamesLayout/gameComponents/mcqOptions";
import QuestionNavigation from "../gamesLayout/gameComponents/questionNavigations";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGame } from "../contextapis/GamesContext";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../gamesLayout/gameComponents/gameHeader";
import { useTranslation } from "react-i18next";
import { useFeedback } from "../contextapis/FeedbackContext";
import useTimer from "../hooks/useTimer";

export default function MultipleChoiceGamePage() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { hints, questions, seconds, numberQuestion } = useGame();
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const { timer, timeLeft } = useTimer(() => navigation.replace("Finish Game", { remainTime: 0 }));
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();

    const options = questions[currentQuestion].options
    const correctOption = questions[currentQuestion].correctAnswerIndex

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (timeLeft > 0 && e.data.action.type === "GO_BACK") {
                e.preventDefault();
                timer.pause();
                setAlertTitle(t('warning'));
                setAlertMessage(t('exitGameWarning'));
                addAlertButton({ text: t('cancel'), style: "cancel", action: () => { hideAlert(), timer.start() } });
                addAlertButton({ text: t('exit'), style: "danger", action: () => { hideAlert(), navigation.replace("MainTabs", { screen: "Games" }) } });
                setAlertVisible(true);
            }
        });
        return unsubscribe;
    }, [navigation, timeLeft]);

    /* ---------- TIMER ---------- */

    useEffect(() => {
        timer.set(seconds * numberQuestion);
        timer.start();
    }, [])


    return (
        <SafeAreaView style={styles.mainContainer}>
            <GameHeader hints={hints} remainTime={timeLeft} />
            <View style={styles.questionArea}>
                <Text style={{ fontSize: 35, color: 'white', fontWeight: '900' }}>{questions[currentQuestion].question}</Text>
            </View>
            <TouchableOpacity style={[styles.gameStatItem, { marginLeft: 'auto', marginBottom: 10 }]}>
                <MaterialIcons name="lightbulb-outline" size={24} color="yellow" />
            </TouchableOpacity>
            <View style={styles.optionArea}>
                {options.map((option, index) => <QuizOption option={option} key={index}
                    index={index} correctIndex={correctOption} currentQuestion={currentQuestion} />)}
            </View>
            <QuestionNavigation currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion} timer={timer} remainTime={timeLeft} />
        </SafeAreaView>
    )
}