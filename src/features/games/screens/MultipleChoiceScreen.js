import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/MultipleChoiceStyles";
import QuizOption from "../components/MultipleChoiceOptions";
import QuestionNavigation from "../components/QuestionNavigation";
import { useGame } from "@/contextapis/GamesContext";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import GameHeader from "../components/GameHeader";
import PauseModal from "../components/PauseModal";
import { useTranslation } from "react-i18next";
import { useFeedback } from "@/contextapis/FeedbackContext";
import useTimer from "@/hooks/useTimer";

export default function MultipleChoiceGamePage() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { questions, seconds, numberQuestion } = useGame();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const { timer, timeLeft } = useTimer(() => navigation.replace("Finish Game", { remainTime: 0 }));
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();

    const currentItem = questions[currentQuestion] || {};
    const options = currentItem.options || [];
    const correctOption = currentItem.correctAnswerIndex;

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

    return (
        <SafeAreaView style={styles.mainContainer}>
            <GameHeader onPause={handlePause} remainTime={timeLeft} />

            <View style={styles.questionCard}>
                <Text style={styles.questionPrompt}>{t('makeChoice') || "Bir seçim yapınız"}</Text>
                <Text style={styles.questionText}>{currentItem.question}</Text>
            </View>

            <View style={styles.optionArea}>
                {options.map((option, index) => (
                    <QuizOption
                        option={option}
                        key={index}
                        index={index}
                        correctIndex={correctOption}
                        currentQuestion={currentQuestion}
                    />
                ))}
            </View>

            <QuestionNavigation
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                timer={timer}
                remainTime={timeLeft}
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