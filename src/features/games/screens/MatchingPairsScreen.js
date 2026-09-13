import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/MatchingPairsStyles";
import { useGame } from "@/contextapis/GamesContext";
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../components/GameHeader";
import PauseModal from "../components/PauseModal";
import QuestionNavigation from "../components/QuestionNavigation";
import { useTranslation } from "react-i18next";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import useTimer from "@/hooks/useTimer";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTheme } from "@/contextapis/ThemeContext";

export default function MatchingPairsPage() {
    const [isVibrate, setVibrate] = useState(true);
    const { colors, isDark } = useTheme();

    useEffect(() => {
        const loadVibration = async () => {
            const val = await storage.get(STORAGE_KEYS.PREFERENCES.VIBRATION_PREF);
            setVibrate(val !== null ? val : true);
        };
        loadVibration();
    }, []);

    const { t } = useTranslation();
    const navigation = useNavigation();
    const { questions, seconds, numberQuestion, perPage, randomIndexCreater, userAnswers, setUserAnswers } = useGame();
    const [currentQuestionPage, setCurrentQuestionPage] = useState(0);
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [currentAnswers, setCurrentAnswers] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [totalTry, setTotalTry] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();
    const { timer, timeLeft } = useTimer(() => navigation.replace("Finish Game", { remainTime: 0 }));

    useEffect(() => {
        const isExist = currentQuestions.some((questionList) => questionList.id === currentQuestionPage);
        if (!isExist) {
            let tempAnswers = [];
            let tempQuestions = [];
            let usedIndexes = new Set();
            for (let i = currentQuestionPage * perPage; i < (currentQuestionPage + 1) * perPage; i++) {
                if (questions[i]) {
                    tempQuestions.push(questions[i].question);
                    tempAnswers.push(questions[i].answer);
                }
            }
            setCurrentQuestions((prev) => [
                ...prev,
                { id: currentQuestionPage, questions: tempQuestions }
            ]);

            let randomAnswers = [];
            let correctIndexes = [];
            for (let i = 0; i < tempAnswers.length; i++) {
                let randomIndex;
                do {
                    randomIndex = randomIndexCreater(tempAnswers.length);
                } while (usedIndexes.has(randomIndex));

                usedIndexes.add(randomIndex);
                randomAnswers.push(tempAnswers[randomIndex]);
                correctIndexes.push(randomIndex);
            }

            setCurrentAnswers((prev) => [
                ...prev,
                { id: currentQuestionPage, answers: randomAnswers, checkList: correctIndexes }
            ]);
        }
    }, [currentQuestionPage, questions]);

    const handlePause = () => {
        timer.pause();
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
        timer.start();
    };

    const handleExitRequest = () => {
        setIsPaused(false);
        timer.pause();
        setAlertTitle(t('warning') || "Uyarı");
        setAlertMessage(t('exitGameWarning') || "Oyundan gerçekten çıkmak istiyor musunuz? İlerlemeniz kaydedilmeyecek.");
        addAlertButton({
            text: t('cancel') || "İptal",
            style: "cancel",
            action: () => {
                hideAlert();
                timer.start();
            }
        });
        addAlertButton({
            text: t('exit') || "Çık",
            style: "danger",
            action: () => {
                hideAlert();
                navigation.reset({
                    index: 0,
                    routes: [{ name: "MainTabs", params: { screen: "Games" } }]
                });
            }
        });
        setAlertVisible(true);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (timeLeft > 0 && e.data.action.type === "GO_BACK") {
                e.preventDefault();
                handleExitRequest();
            }
        });
        return unsubscribe;
    }, [navigation, timeLeft]);

    /* ---------- TIMER ---------- */

    useEffect(() => {
        timer.set(seconds * numberQuestion);
        timer.start();
    }, []);

    /* ---------- GAME LOGIC ---------- */

    const questionList = currentQuestions.find(item => item.id === currentQuestionPage)?.questions;
    const answerData = currentAnswers.find(item => item.id === currentQuestionPage);
    const answerList = answerData?.answers;
    const checkList = answerData?.checkList;

    const isAnswered = (index, type) => {
        return userAnswers.some(ans =>
            ans.currentPage === currentQuestionPage && ans[type] === index
        );
    };

    const selectQuestionHandler = (ind) => {
        if (isAnswered(ind, "question")) return;
        if (selectedAnswer !== null) return;
        setSelectedQuestion(prev => prev === ind ? null : ind);
    };

    const selectAnswerHandler = async (ind) => {
        if (selectedQuestion === null || selectedQuestion === undefined) return;
        if (isAnswered(ind, "answer")) return;
        if (selectedAnswer !== null) return;

        setTotalTry((prev) => prev + 1);
        setSelectedAnswer(ind);

        if (checkList && checkList[selectedQuestion] === ind) {
            setUserAnswers((prev) => [
                ...prev,
                { currentPage: currentQuestionPage, question: selectedQuestion, answer: ind }
            ]);
            setTimeout(() => {
                setSelectedQuestion(null);
                setSelectedAnswer(null);
            }, 800);
            if (isVibrate) Vibration.vibrate(80);
        } else {
            if (isVibrate) {
                Vibration.vibrate(50);
                await new Promise(resolve => setTimeout(resolve, 120));
                Vibration.vibrate(50);
            }
            setTimeout(() => {
                setSelectedAnswer(null);
            }, 800);
        }
    };

    const getQuestionStyle = (ind) => {
        if (isAnswered(ind, "question")) {
            return {
                card: { backgroundColor: colors.games.correctBg, borderColor: colors.games.correctBorder },
                text: { color: colors.games.correctText, fontWeight: '700' }
            };
        }
        if (selectedQuestion === ind) {
            return {
                card: { backgroundColor: colors.games.optionSelectedBg, borderColor: colors.games.optionSelectedBorder, borderWidth: 2 },
                text: { color: colors.common.primary, fontWeight: '800' }
            };
        }
        return {
            card: { backgroundColor: colors.games.optionBg, borderColor: colors.games.optionBorder, shadowColor: colors.games.cardShadow },
            text: { color: colors.games.textPrimary, fontWeight: '600' }
        };
    };

    const getAnswerStyle = (ind) => {
        if (isAnswered(ind, "answer")) {
            return {
                card: { backgroundColor: colors.games.correctBg, borderColor: colors.games.correctBorder },
                text: { color: colors.games.correctText, fontWeight: '700' }
            };
        }
        if (selectedAnswer === ind) {
            const isCorrect = checkList && checkList[selectedQuestion] === ind;
            if (isCorrect) {
                return {
                    card: { backgroundColor: colors.games.correctBg, borderColor: colors.games.correctBorder },
                    text: { color: colors.games.correctText, fontWeight: '700' }
                };
            } else {
                return {
                    card: { backgroundColor: colors.games.wrongBg, borderColor: colors.games.wrongBorder },
                    text: { color: colors.games.wrongText, fontWeight: '700' }
                };
            }
        }
        return {
            card: { backgroundColor: colors.games.optionBg, borderColor: colors.games.optionBorder, shadowColor: colors.games.cardShadow },
            text: { color: colors.games.textPrimary, fontWeight: '600' }
        };
    };

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: colors.common.background }]}>
            <GameHeader onPause={handlePause} remainTime={timeLeft} />

            <View style={styles.gameContainer}>
                {/* Questions Column */}
                <View style={styles.columnArea}>
                    <Text style={[styles.columnTitle, { color: colors.common.primary }]}>{t('english') || "İngilizce"}</Text>
                    {questionList?.map((question, ind) => {
                        const styleConfig = getQuestionStyle(ind);
                        const disabled = isAnswered(ind, "question") || selectedAnswer !== null;
                        return (
                            <Pressable
                                key={ind}
                                disabled={disabled}
                                onPress={() => selectQuestionHandler(ind)}
                                style={[styles.cardBase, styleConfig.card]}
                            >
                                <Text style={[styles.cardTextBase, styleConfig.text]} numberOfLines={2}>
                                    {question}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Answers Column */}
                <View style={styles.columnArea}>
                    <Text style={[styles.columnTitle, { color: colors.common.primary }]}>{t('turkish') || "Türkçe"}</Text>
                    {answerList?.map((answer, ind) => {
                        const styleConfig = getAnswerStyle(ind);
                        const disabled = isAnswered(ind, "answer") || selectedQuestion === null || selectedAnswer !== null;
                        return (
                            <Pressable
                                key={ind}
                                disabled={disabled}
                                onPress={() => selectAnswerHandler(ind)}
                                style={[styles.cardBase, styleConfig.card]}
                            >
                                <Text style={[styles.cardTextBase, styleConfig.text]} numberOfLines={2}>
                                    {answer}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            <QuestionNavigation
                currentQuestion={currentQuestionPage}
                timer={timer}
                remainTime={timeLeft}
                setCurrentQuestion={setCurrentQuestionPage}
                setSelectedQuestion={setSelectedQuestion}
                totalTry={totalTry}
                onPause={handlePause}
            />

            <PauseModal
                visible={isPaused}
                onResume={handleResume}
                onExit={handleExitRequest}
            />
        </SafeAreaView>
    );
}