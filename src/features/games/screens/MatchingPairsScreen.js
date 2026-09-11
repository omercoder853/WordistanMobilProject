import { View, Text, Pressable, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/MatchingPairsStyles";
import { useGame } from "@/contextapis/GamesContext";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../components/GameHeader";
import QuestionNavigation from "../components/QuestionNavigation";
import { useTranslation } from "react-i18next";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import useTimer from "@/hooks/useTimer";
import { useFeedback } from "@/contextapis/FeedbackContext";

export default function MatchingPairsPage() {
    const [isVibrate, setVibrate] = useState(true)
    useEffect(() => {
        const loadVibration = async () => {
            const val = await storage.get(STORAGE_KEYS.PREFERENCES.VIBRATION_PREF);
            setVibrate(val !== null ? val : true);
        };
        loadVibration();
    }, []);
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { hints, questions, seconds, numberQuestion, perPage, randomIndexCreater,
        userAnswers, setUserAnswers } = useGame();
    const [currentQuestionPage, setCurrentQuestionPage] = useState(0)
    const [currentQuestions, setCurrentQuestions] = useState([])
    const [currentAnswers, setCurrentAnswers] = useState([])
    const [questionCounter, setQuestionCounter] = useState(0)
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [selectedAnswer, setSelectedAnswer] = useState([])
    const [totalTry, setTotalTry] = useState(0);
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();
    const { timer, timeLeft } = useTimer(() => navigation.replace("Finish Game", { remainTime: 0 }));


    useEffect(() => {
        const isExist = currentQuestions.some((questionList) => questionList.id == currentQuestionPage)
        if (!isExist) {
            let tempAnswers = [];
            let tempQuestions = [];
            let usedIndexes = new Set();
            for (let i = currentQuestionPage * perPage; i < (currentQuestionPage + 1) * perPage; i++) {
                if (questions[i]) {
                    tempQuestions.push(questions[i].question)
                    tempAnswers.push(questions[i].answer)
                    setQuestionCounter(questionCounter + 1)
                }
            }
            setCurrentQuestions((prev) => {
                return [...prev, { id: currentQuestionPage, questions: tempQuestions }]
            })
            let randomAnswers = []
            let correctIndexes = []
            for (let i = 0; i < tempAnswers.length; i++) {
                let randomIndex;
                do {
                    randomIndex = randomIndexCreater({ target_words: tempAnswers, length: null })
                } while (usedIndexes.has(randomIndex));
                randomAnswers[randomIndex] = tempAnswers[i]
                correctIndexes.push(randomIndex)
                usedIndexes.add(randomIndex)
            }
            setCurrentAnswers((prev) => {
                return [...prev, { id: currentQuestionPage, answers: randomAnswers, correctIndexes }]
            })
        }
    }, [currentQuestionPage])

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
    }, []);

    const getDynamicQuestionStyle = (ind) => {
        if (selectedQuestion !== null && selectedQuestion !== undefined) {
            if (ind === selectedQuestion) {
                return { backgroundColor: '#4A3B5D', borderColor: "#A38CB8" }
            }
            else {
                return { backgroundColor: '#322B3D', borderColor: "#453D52" }
            }
        }
    }

    const getDynamicAnswerStyle = (ind) => {
        if (selectedQuestion !== null && selectedQuestion !== undefined) {
            if (selectedAnswer !== undefined && selectedAnswer != null) {
                if (selectedAnswer === ind) {
                    if (checkList[selectedQuestion] === ind) {
                        return { backgroundColor: "green" }
                    }
                    else {
                        return { backgroundColor: "red" }
                    }
                }
                else {
                    return {}
                }
            }
            return { backgroundColor: '#2D2438', borderColor: '#5A4E6B' }
        }
    }

    const dynamicDisabledMaker = (ind, trigger, key) => {
        if (isAnswered(ind, key)) {
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

    const selectQuestionHandler = (ind) => {
        isVibrate && Vibration.vibrate(80)
        setSelectedAnswer(null)
        if (selectedQuestion !== undefined && selectedQuestion !== null) {
            setSelectedQuestion(null)
        }
        else {
            setSelectedQuestion(ind)
        }
    }

    const selectAnswerHandler = async (ind) => {
        if (selectedAnswer == null && selectedAnswer == undefined) {
            setTotalTry((prev) => prev + 1)
            setSelectedAnswer(ind)
            if (checkList[selectedQuestion] === ind) {
                setUserAnswers((prev) => {
                    return [...prev, { currentPage: currentQuestionPage, question: selectedQuestion, answer: ind }]
                })
                const interval = setTimeout(() => {
                    setSelectedQuestion(null)
                    setSelectedAnswer(null)
                }, 800)
                isVibrate && Vibration.vibrate(80)
            }
            else {
                if (isVibrate) {
                    Vibration.vibrate(50)
                    await new Promise(resolve => setTimeout(resolve, 120));
                    Vibration.vibrate(50)
                }
                const interval = setTimeout(() => {
                    setSelectedAnswer(null)
                }, 800)
            }
        }
    }

    const isAnswered = (ind, key) => {
        return userAnswers.some((ans) => ans.currentPage === currentQuestionPage && ans[key] === ind)
    }

    const questionList = currentQuestions.find((q) => q.id == currentQuestionPage)?.questions
    const answerList = currentAnswers.find((a) => a.id === currentQuestionPage)?.answers
    const checkList = currentAnswers.find((a) => a.id === currentQuestionPage)?.correctIndexes
    return (
        <SafeAreaView style={styles.mainContainer}>
            <GameHeader hints={hints} remainTime={timeLeft} />
            <View style={styles.gameContainer}>
                <View style={styles.questionArea}>
                    {questionList?.map((question, ind) => (
                        <Pressable disabled={dynamicDisabledMaker(ind, selectedQuestion, "question")}
                            onPress={() => selectQuestionHandler(ind)}
                            style={[styles.question, getDynamicQuestionStyle(ind), isAnswered(ind, "question") && { backgroundColor: 'green' }]} key={ind}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>{question}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.answerArea}>
                    {answerList?.map((answer, ind) => (
                        <Pressable key={ind} style={[styles.answer, getDynamicAnswerStyle(ind), isAnswered(ind, "answer") && { backgroundColor: 'green' }]}
                            onPress={() => selectAnswerHandler(ind)}
                            disabled={dynamicDisabledMaker(ind, selectedAnswer, "answer")} >
                            <Text style={{ textAlign: 'center', color: 'white' }}>{answer}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            <QuestionNavigation currentQuestion={currentQuestionPage} timer={timer} remainTime={timeLeft}
                setCurrentQuestion={setCurrentQuestionPage} setSelectedQuestion={setSelectedQuestion} totalTry={totalTry} />
        </SafeAreaView>
    )
}