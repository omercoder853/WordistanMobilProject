import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from '@/contextapis/GamesContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';
import { useFeedback } from '@/contextapis/FeedbackContext';
import Feather from '@expo/vector-icons/Feather';

export default function QuestionNavigation({
    currentQuestion,
    setCurrentQuestion,
    timer,
    remainTime,
    setSelectedQuestion,
    totalTry,
    onPause,
}) {
    const { t } = useTranslation();
    const { numberQuestion, userAnswers, gameType, autoCont, perPage, gameSettings } = useGame();
    const navigation = useNavigation();
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();

    const isFirst = currentQuestion === 0;
    const totalPages = gameType === "mp" ? Math.ceil(numberQuestion / perPage) : numberQuestion;
    let isLast;
    let isAnswered;

    if (gameType === "mp") {
        isLast = currentQuestion + 1 === totalPages;
        if (isLast) {
            const remainder = numberQuestion % perPage;
            const expectedCount = remainder === 0 ? perPage : remainder;
            isAnswered = userAnswers.filter((ans) => ans.currentPage === currentQuestion).length === expectedCount;
        } else {
            isAnswered = userAnswers.filter((ans) => ans.currentPage === currentQuestion).length === perPage;
        }
    } else {
        isLast = currentQuestion + 1 === numberQuestion;
        isAnswered = userAnswers.some((answer) => answer.question === currentQuestion);
    }

    const isAutoContActive = Boolean(autoCont ?? gameSettings?.autoCont);
    const wasAlreadyAnsweredRef = useRef(isAnswered);
    const prevQuestionRef = useRef(currentQuestion);

    const nextQuestion = () => {
        if (gameType === "mp" && setSelectedQuestion) {
            setSelectedQuestion(null);
        }
        setCurrentQuestion((prev) => prev + 1);
    };

    const pastQuestion = () => {
        if (gameType === "mp" && setSelectedQuestion) {
            setSelectedQuestion(null);
        }
        setCurrentQuestion((prev) => Math.max(0, prev - 1));
    };

    useEffect(() => {
        // If question changed, record whether the newly arrived question was already answered
        if (prevQuestionRef.current !== currentQuestion) {
            prevQuestionRef.current = currentQuestion;
            wasAlreadyAnsweredRef.current = isAnswered;
            return;
        }

        // If this question was already answered upon arrival (e.g. reviewed via Back button), do not auto-advance
        if (wasAlreadyAnsweredRef.current) {
            return;
        }

        // When answered, if autoCont is enabled and it's not the last question, auto advance
        if (isAutoContActive && isAnswered && !isLast) {
            const delay = gameType === "mp" ? 900 : 750;
            const timeout = setTimeout(() => {
                nextQuestion();
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentQuestion, isAnswered, isAutoContActive, isLast, gameType]);

    const finishGame = () => {
        if (userAnswers.length < numberQuestion) {
            timer.pause();
            setAlertTitle(t('warningShort') || 'Uyarı');
            setAlertMessage(t('finishWithUnanswered') || 'Cevaplanmamış sorularla bitirilsin mi?');
            addAlertButton({
                text: t('cancel') || 'İptal',
                style: "cancel",
                action: () => {
                    hideAlert();
                    timer.start();
                }
            });
            addAlertButton({
                text: t('finish') || 'Bitir',
                action: () => {
                    hideAlert();
                    navigation.replace("Finish Game", { remainTime, totalTry });
                }
            });
            setAlertVisible(true);
        } else {
            timer.pause();
            if (gameType === "mp") {
                navigation.replace("Finish Game", { remainTime, totalTry });
            } else {
                navigation.replace("Finish Game", { remainTime });
            }
        }
    };

    const handleFirstQuestion = () => {
        if (onPause) {
            onPause();
        } else {
            timer.pause();
            setAlertTitle(t('warning') || 'Uyarı');
            setAlertMessage(t('exitGameWarning') || 'Oyundan gerçekten çıkmak istiyor musunuz? İlerlemeniz kaydedilmeyecek.');
            addAlertButton({
                text: t('cancel') || 'İptal',
                style: "cancel",
                action: () => {
                    hideAlert();
                    timer.start();
                }
            });
            addAlertButton({
                text: t('exit') || 'Çık',
                style: "danger",
                action: () => {
                    hideAlert();
                    navigation.reset({ index: 0, routes: [{ name: "MainTabs", params: { screen: "Games" } }] });
                }
            });
            setAlertVisible(true);
        }
    };

    return (
        <View style={navStyles.container}>
            {/* Left Action (Exit or Back) */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={[navStyles.navBtn, isFirst ? navStyles.exitBtn : navStyles.backBtn]}
                onPress={isFirst ? handleFirstQuestion : pastQuestion}
            >
                <Feather
                    name={isFirst ? "log-out" : "chevron-left"}
                    size={16}
                    color={isFirst ? "#EF4444" : "#5B3FD3"}
                    style={{ marginRight: 4 }}
                />
                <Text style={[navStyles.btnText, isFirst ? navStyles.exitBtnText : navStyles.backBtnText]}>
                    {isFirst ? (t('exit') || 'Çık') : (t('back') || 'Geri')}
                </Text>
            </TouchableOpacity>

            {/* Question Counter Badge */}
            <View style={navStyles.counterBadge}>
                <Text style={navStyles.counterText}>
                    {currentQuestion + 1}
                    <Text style={navStyles.counterTotal}> / {totalPages}</Text>
                </Text>
            </View>

            {/* Right Action (Next or Finish) */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={[navStyles.navBtn, isLast ? navStyles.finishBtn : navStyles.nextBtn]}
                onPress={isLast ? finishGame : nextQuestion}
            >
                <Text style={[navStyles.btnText, isLast ? navStyles.finishBtnText : navStyles.nextBtnText]}>
                    {isLast ? (t('finish') || 'Bitir') : (t('next') || 'İleri')}
                </Text>
                <Feather
                    name={isLast ? "check" : "chevron-right"}
                    size={16}
                    color="#FFFFFF"
                    style={{ marginLeft: 4 }}
                />
            </TouchableOpacity>
        </View>
    );
}

const navStyles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginTop: 'auto',
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        minWidth: 84,
    },
    backBtn: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E9E3FF',
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    exitBtn: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1.5,
        borderColor: '#FECACA',
    },
    nextBtn: {
        backgroundColor: '#5B3FD3',
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    finishBtn: {
        backgroundColor: '#16A34A',
        shadowColor: '#16A34A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '700',
    },
    backBtnText: {
        color: '#5B3FD3',
    },
    exitBtnText: {
        color: '#EF4444',
    },
    nextBtnText: {
        color: '#FFFFFF',
    },
    finishBtnText: {
        color: '#FFFFFF',
    },
    counterBadge: {
        backgroundColor: '#EDE9FE',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    counterText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#5B3FD3',
    },
    counterTotal: {
        fontSize: 13,
        fontWeight: '600',
        color: '#7C3AED',
    },
});