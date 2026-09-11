import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGame } from "@/contextapis/GamesContext";
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../components/GameHeader";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/WordCompletionStyles";
import QuestionNavigation from "../components/QuestionNavigation";
import { useTranslation } from "react-i18next";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import useTimer from "@/hooks/useTimer";
import { useFeedback } from "@/contextapis/FeedbackContext";

export default function WordCompletionPage() {
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
    const { hints, questions, visibleFirstLetter, userAnswers, setUserAnswers, seconds, numberQuestion } = useGame();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const inputs = useRef([])
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();
    const { timer, timeLeft } = useTimer(() => navigation.replace("Finish Game", { remainTime: 0 }));

    const question = questions[currentQuestionIndex].question
    const answer = questions[currentQuestionIndex].answer
    const isAnswered = userAnswers.find((ans) => ans.question == currentQuestionIndex)
    const [currentLetters, setCurrentLetters] = useState([])

    useEffect(() => {
        let baseList = new Array(answer.length).fill("")
        if (visibleFirstLetter) {
            baseList[0] = answer[0]
        }
        setCurrentLetters(baseList)
        inputs.current = [];
    }, [currentQuestionIndex])

    const handleTextChange = (text, index) => {
        isVibrate && Vibration.vibrate(80)
        if (text.length > 0 && index < answer.length - 1) {
            inputs.current[index + 1].focus();
        }
        const updated = [...currentLetters]
        updated[index] = text;
        const isAllFilled = updated.filter(char => char !== "" && char !== undefined).length === answer.length;
        if (isAllFilled) {
            setUserAnswers((prev) => {
                return [...prev, { question: currentQuestionIndex, answer, userAnswer: updated }]
            })

        }
        setCurrentLetters(updated)
    }

    const handleBackPress = (index) => {
        if (currentLetters[index] == "" && index > 0) {
            inputs.current[index - 1].focus();
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
            else {
                if (inputs.current[0]) {
                    inputs.current[0].focus()
                }
            }
        }, 500);
        return () => clearTimeout(timer)
    }, [currentQuestionIndex]);

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

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.mainContainer}>
                <GameHeader hints={hints} remainTime={timeLeft} />
                <View style={styles.questionArea}>
                    <Text style={styles.question}>{question}</Text>
                </View>
                <View style={styles.lettersArea} key={currentQuestionIndex}>
                    {Array.from(answer).map((char, index) => (
                        <View key={index} style={styles.letterInputContainer}>
                            <TextInput onChangeText={(value) => handleTextChange(value, index)}
                                ref={(el) => inputs.current[index] = el}
                                style={[styles.letterInput, !isAnswered ? {} : isAnswered?.userAnswer[index]?.toLocaleLowerCase('tr-TR') == answer[index]?.toLocaleLowerCase('tr-TR')
                                    ? { backgroundColor: 'green', color: 'white' }
                                    : { backgroundColor: 'red', color: 'white' }]}
                                autoCapitalize="characters" autoCorrect={false} spellCheck={false

                                }
                                onKeyPress={(e) => {
                                    if (e.nativeEvent.key === 'Backspace') {
                                        handleBackPress(index)
                                    }
                                }}
                                maxLength={1} editable={isAnswered ? false : visibleFirstLetter && index === 0 ? false : true}
                                value={isAnswered ? isAnswered.userAnswer[index] : currentLetters[index] || ""} />
                        </View>
                    ))}
                </View>

                <QuestionNavigation currentQuestion={currentQuestionIndex} timer={timer}
                    setCurrentQuestion={setCurrentQuestionIndex} remainTime={timeLeft} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}