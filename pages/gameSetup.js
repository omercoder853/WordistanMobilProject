import {
    View, Text, TouchableOpacity, KeyboardAvoidingView,
 Platform, ScrollView, InteractionManager, Switch
} from "react-native";
import styles from "../gamesLayout/gameStyles/styles";
import { useRoute, useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useDictionary } from "../contextapis/DictContext";
import WcSettings from "../gamesLayout/gameComponents/wcSettings";
import NumericInput from "../gamesLayout/gameComponents/numericInput";
import McqSettings from "../gamesLayout/gameComponents/mcqSettings";
import MpSettings from "../gamesLayout/gameComponents/mpSettings";
import { useGame } from "../contextapis/GamesContext";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

export default function GameSetupPage() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { dicts, setDictReload, getWords } = useDictionary();
    const { source, setSource, value, setValue, numberQuestion, setNumberQuestion, seconds, setSeconds,
        hints, setHints, createQuestion, setGameType, autoCont, setAutoCont } = useGame();
    const router = useRoute();
    const { gameType } = router.params
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        navigation.setOptions({ title: t('gameSettings') })
    }, [t])

    useEffect(() => {
        const loadSaved = async () => {
            const savedAutoCont = await AsyncStorage.getItem("@wordistan:autoCont")
            setAutoCont(savedAutoCont !== null ? JSON.parse(savedAutoCont) : false)
        }
        loadSaved();
    }, [])

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            if (dicts.length == 0) {
                setDictReload(true)
            }
            setGameType(gameType)
            setIsReady(true)
        })
    }, [])

    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([])
    const [maxQuestion, setMaxQuestion] = useState()

    const validGame = source && value

    const startGame = () => {
        switch (gameType) {
            case "wc":
                navigation.replace("Word Completion")
                break;
            case "mcq":
                navigation.replace("Multiple Choice Quiz")
                break;
            case "mp":
                navigation.replace("Matching Pairs")
            default:
                break;
        }
        createQuestion();
    }

    if (!isReady) return <View style={{ flex: 1 }} />


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <LinearGradient colors={['#e9d5ff', '#ffffff']} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ width: '90%', alignSelf: 'center', paddingBottom: 40, paddingTop: 10 }} 
                showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>

                    <View style={[styles.setupCard, styles.setupCardTop]}>
                        <Text style={[styles.setupOptionLabel, { marginTop: 0, textAlign: 'center' }]}>{t('sourceChoice')}</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity style={[styles.sourceButton, source == "personal" && styles.primarySourceButton ]}
                                onPress={() => {
                                    setValue(null)
                                    setSource("personal")
                                    const cleanedDicts = dicts.filter((dict) => dict["words"].length >= 5)
                                    const items = cleanedDicts.map((dict) => ({
                                        label: dict.name,
                                        value: dict.id
                                    }));
                                    setItems(items)
                                }}>
                                <Feather name={source == "personal" ? "check-circle" : "circle"}
                                    size={15} color={source == "personal" ? "white" : "black"} style={{ marginRight: 8 }} />
                                <Text style={source == "personal" ? { color: 'white', fontWeight: 'bold' } : null}>{t('personal')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.sourceButton, source == "collection" && styles.primarySourceButton ]} onPress={() => {
                                setValue(null)
                                setSource("collection")
                                setItems([{ label: "Fruits and Vegetables", value: "fruits" },
                                { label: "Animals", value: "animals" }, { label: "Places and Environment", value: "places" }])
                            }}>
                                <Feather name={source == "collection" ? "check-circle" : "circle"} size={15}
                                    color={source == "collection" ? "white" : "black"} style={{ marginRight: 8 }} />
                                <Text style={source == "collection" ? { color: 'white', fontWeight: 'bold' } : null}>{t('collections')}</Text>
                            </TouchableOpacity>
                        </View>
                        {source &&
                            <DropDownPicker style={{ marginTop: 15, borderColor: '#5B3FD3' }}
                            placeholder={source == "personal" ? t('selectDictionary') : t('selectCollection')}
                                open={open} setOpen={setOpen} value={value} setValue={(callback) => {
                                    const nextValue = callback(value)
                                    if (source == "personal") {
                                        setMaxQuestion(getWords(nextValue).length)
                                        setNumberQuestion(5);
                                    }
                                    else {
                                        switch (nextValue) {
                                            case "fruits":
                                                setMaxQuestion(30)
                                                setNumberQuestion(5);
                                                break;
                                            case "animals":
                                                setMaxQuestion(20);
                                                setNumberQuestion(5);
                                                break;
                                            case "places":
                                                setMaxQuestion(30)
                                                setNumberQuestion(5);
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                    setValue(nextValue)
                                }}
                                dropDownContainerStyle={{ borderColor: '#5B3FD3' }}
                                items={items} zIndex={3000} listMode="SCROLLVIEW"/>}
                    </View>

                    <View style={styles.setupCard}>
                        <Text style={[styles.setupOptionLabel, { marginTop: 0 }]}>{t('numberOfQuestions')}</Text>
                        <NumericInput value={numberQuestion} setValue={setNumberQuestion} maxValue={maxQuestion} 
                        minValue={5} quantity={t('qQuestions')}/>
                        <Text style={styles.setupOptionLabel}>{t('numberOfHints')}</Text>
                        <NumericInput value={hints} setValue={setHints} minValue={0} maxValue={5} quantity={t('qHints')} />
                        <Text style={styles.setupOptionLabel}>{t('secondsPerQuestion')}</Text>
                        <NumericInput value={seconds} setValue={setSeconds} minValue={2} maxValue={15} quantity={t('qSeconds')} />
                    </View>

                    <View style={styles.setupCard}>
                        {gameType == "wc" && <WcSettings />}
                        {gameType == "mcq" && <McqSettings />}
                        {gameType == "mp" && <MpSettings />}

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.setupOptionLabel, { marginTop: 15 }]}>{t("autoCont")}</Text>
                            <Switch trackColor={{ false: "#e0e0e0", true: "#5B3FD3" }} thumbColor="#ffffff"
                                style={{ marginLeft: 'auto', marginTop: 15 }} value={autoCont} onValueChange={setAutoCont} />
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.startGameButton, !validGame && { backgroundColor: 'gray' }, validGame && styles.primaryStartButton]} disabled={!validGame} onPress={startGame}>
                        <Text style={[styles.startGameText, styles.primaryStartText]}>{t('startGame')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}