import { View, Text, TouchableOpacity } from 'react-native'
import styles from '../styles/styles'
import { useGame } from '@/contextapis/GamesContext'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { useFeedback } from '@/contextapis/FeedbackContext';

export default function QuestionNavigation({ currentQuestion, setCurrentQuestion, timer, remainTime, setSelectedQuestion, totalTry }) {
    const { t } = useTranslation();
    const { numberQuestion, userAnswers, gameType, autoCont, perPage } = useGame();
    const navigation = useNavigation()
    const { alertLoading, setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, setAlertLoading, hideAlert } = useFeedback();
    const isFirst = currentQuestion + 1 == 1
    let isLast;
    let isAnswered;
    if (gameType === "mp") {
        isLast = currentQuestion + 1 == Math.ceil(numberQuestion / perPage)
        if (isLast) {
            isAnswered = userAnswers.filter((ans) => ans.currentPage == currentQuestion).length == numberQuestion % perPage
        }
        else {
            isAnswered = userAnswers.filter((ans) => ans.currentPage == currentQuestion).length == perPage
        }
    }
    else {
        isLast = currentQuestion + 1 == numberQuestion
        isAnswered = userAnswers.some((answer) => answer.question == currentQuestion)
    }
    const nextQuestion = () => {
        if (gameType === "mp") {
            setSelectedQuestion(null)
        }
        else { setContAllow(true) }
        setCurrentQuestion(currentQuestion + 1)
    }

    const [contAllowed, setContAllow] = useState(autoCont)
    useEffect(() => {
        if (!isAnswered) {
            setContAllow(true)
        }
        else { setContAllow(false) }
    }, [currentQuestion])

    useEffect(() => {
        if (autoCont && isAnswered && !isLast && contAllowed) {
            const timer = setTimeout(() => nextQuestion(), 700);
            return () => clearTimeout(timer);
        }
    }, [isAnswered, autoCont, isLast, contAllowed]);

    const pastQuestion = () => {
        setContAllow(false)
        setCurrentQuestion(currentQuestion - 1)
    }
    const finishGame = () => {
        if (userAnswers.length < numberQuestion) {
            timer.pause();
            setAlertTitle(t('warningShort'));
            setAlertMessage(t('finishWithUnanswered'));
            addAlertButton({ text: t('cancel'), style: "cancel", action: () => { hideAlert(), timer.start() } });
            addAlertButton({ text: t('finish'), action: () => { hideAlert(), navigation.replace("Finish Game", { remainTime }) } });
            setAlertVisible(true);
        }
        else {
            timer.pause();
            if (gameType == "mp") {
                navigation.replace("Finish Game", { remainTime, totalTry })
            }
            else {
                navigation.replace("Finish Game", { remainTime })
            }
        }
    }

    const handleFirstQuestion = () => {
        timer.pause();
        setAlertTitle(t('warning'));
        setAlertMessage(t('exitGameWarning'));
        addAlertButton({ text: t('cancel'), style: "cancel", action: () => { hideAlert(), timer.start() } });
        addAlertButton({ text: t('exit'), style: "danger", action: () => { hideAlert(), navigation.replace("MainTabs", { screen: "Games" }) } });
        setAlertVisible(true);
    }

    return (
        <View style={styles.questionNavArea}>
            <TouchableOpacity style={[styles.questionNavButton, { backgroundColor: '#E5989B' }]} onPress={isFirst ? handleFirstQuestion : pastQuestion}>
                <Text>{isFirst ? t('exit') : t('back')}</Text>
            </TouchableOpacity>
            <Text style={{ color: 'white' }}>{currentQuestion + 1}/{gameType == "mp" ? Math.ceil(numberQuestion / perPage) : numberQuestion}</Text>
            <TouchableOpacity style={[styles.questionNavButton, { backgroundColor: '#94C973' }]} onPress={isLast ? finishGame : nextQuestion}>
                <Text>{isLast ? t('finish') : t('next')}</Text>
            </TouchableOpacity>
        </View>
    )
}