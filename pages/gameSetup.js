import {
    View, Text, TouchableOpacity, KeyboardAvoidingView,
    Platform, ScrollView, Switch, Modal, FlatList, StyleSheet, Pressable
} from "react-native";
import styles from "../gamesLayout/gameStyles/styles";
import { useRoute, useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useMemo } from "react";
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
    const { gameType } = router.params || {};

    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [maxQuestion, setMaxQuestion] = useState(30);

    useEffect(() => {
        navigation.setOptions({ title: t('gameSettings') || 'Oyun Ayarları' });
    }, [t, navigation]);

    useEffect(() => {
        const loadSaved = async () => {
            const savedAutoCont = await AsyncStorage.getItem("@wordistan:autoCont");
            setAutoCont(savedAutoCont !== null ? JSON.parse(savedAutoCont) : false);
        };
        loadSaved();
    }, []);

    useEffect(() => {
        if (dicts.length === 0) {
            setDictReload(true);
        }
        if (gameType) {
            setGameType(gameType);
        }
    }, [gameType]);

    // Handle source selection (personal vs collection)
    const handleSelectSource = (selectedSource) => {
        setValue(null);
        setSource(selectedSource);
        if (selectedSource === "personal") {
            const cleanedDicts = dicts.filter((dict) => dict["words"] && dict["words"].length >= 5);
            const formatted = cleanedDicts.map((dict) => ({
                label: dict.name,
                value: dict.id,
                subtext: `${dict.words ? dict.words.length : 0} ${t('words') || 'kelime'}`
            }));
            setItems(formatted);
        } else {
            setItems([
                { label: t('fruitsCollectionTitle') || "Meyveler ve Sebzeler", value: "fruits", subtext: "30 " + (t('words') || "kelime") },
                { label: t('animalsCollectionTitle') || "Hayvanlar", value: "animals", subtext: "20 " + (t('words') || "kelime") },
                { label: t('placesCollectionTitle') || "Mekanlar ve Çevre", value: "places", subtext: "30 " + (t('words') || "kelime") }
            ]);
        }
    };

    // Handle selecting an item from the ActionSheet modal
    const handleSelectItem = async (itemValue) => {
        setValue(itemValue);
        setModalVisible(false);

        if (source === "personal") {
            try {
                const words = await getWords(itemValue);
                if (words && Array.isArray(words)) {
                    setMaxQuestion(words.length);
                } else {
                    setMaxQuestion(30);
                }
            } catch (err) {
                setMaxQuestion(30);
            }
            setNumberQuestion(5);
        } else {
            switch (itemValue) {
                case "fruits":
                    setMaxQuestion(30);
                    break;
                case "animals":
                    setMaxQuestion(20);
                    break;
                case "places":
                    setMaxQuestion(30);
                    break;
                default:
                    setMaxQuestion(20);
                    break;
            }
            setNumberQuestion(5);
        }
    };

    const selectedItemLabel = useMemo(() => {
        if (!value) return null;
        const found = items.find(i => i.value === value);
        return found ? found.label : null;
    }, [value, items]);

    const validGame = Boolean(source && value);

    const startGame = () => {
        switch (gameType) {
            case "wc":
                navigation.replace("Word Completion");
                break;
            case "mcq":
                navigation.replace("Multiple Choice Quiz");
                break;
            case "mp":
                navigation.replace("Matching Pairs");
                break;
            default:
                break;
        }
        createQuestion();
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <LinearGradient colors={['#F5F3FF', '#FFFFFF']} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ width: '92%', alignSelf: 'center', paddingBottom: 40, paddingTop: 16 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Source Selection Card */}
                    <View style={styles.setupCard}>
                        <Text style={styles.setupOptionLabel}>{t('sourceChoice') || "Kaynak Seçimi"}</Text>
                        
                        <View style={pageStyles.sourceRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    pageStyles.sourceCardButton,
                                    source === "personal" && pageStyles.sourceCardButtonActive
                                ]}
                                onPress={() => handleSelectSource("personal")}
                            >
                                <View style={[pageStyles.iconCircle, source === "personal" && pageStyles.iconCircleActive]}>
                                    <Feather name="book-open" size={18} color={source === "personal" ? "#FFFFFF" : "#5B3FD3"} />
                                </View>
                                <Text style={[pageStyles.sourceText, source === "personal" && pageStyles.sourceTextActive]}>
                                    {t('personal') || "Kişisel"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    pageStyles.sourceCardButton,
                                    source === "collection" && pageStyles.sourceCardButtonActive
                                ]}
                                onPress={() => handleSelectSource("collection")}
                            >
                                <View style={[pageStyles.iconCircle, source === "collection" && pageStyles.iconCircleActive]}>
                                    <Feather name="grid" size={18} color={source === "collection" ? "#FFFFFF" : "#5B3FD3"} />
                                </View>
                                <Text style={[pageStyles.sourceText, source === "collection" && pageStyles.sourceTextActive]}>
                                    {t('collections') || "Koleksiyonlar"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* ActionSheet Trigger Button */}
                        {source && (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={pageStyles.actionSheetTrigger}
                                onPress={() => setModalVisible(true)}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={pageStyles.triggerPlaceholder}>
                                        {source === "personal" ? (t('selectDictionary') || "Sözlük Seçin") : (t('selectCollection') || "Koleksiyon Seçin")}
                                    </Text>
                                    <Text style={pageStyles.triggerValue} numberOfLines={1}>
                                        {selectedItemLabel || (t('makeChoice') || "Seçim yapınız...")}
                                    </Text>
                                </View>
                                <Feather name="chevron-down" size={20} color="#5B3FD3" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Numeric Options Card */}
                    <View style={styles.setupCard}>
                        <Text style={styles.setupOptionLabel}>{t('numberOfQuestions') || "Soru Sayısı"}</Text>
                        <NumericInput
                            value={numberQuestion}
                            setValue={setNumberQuestion}
                            maxValue={maxQuestion}
                            minValue={5}
                            quantity={t('qQuestions') || "soru"}
                        />

                        <Text style={styles.setupOptionLabel}>{t('numberOfHints') || "İpucu Sayısı"}</Text>
                        <NumericInput
                            value={hints}
                            setValue={setHints}
                            minValue={0}
                            maxValue={5}
                            quantity={t('qHints') || "ipucu"}
                        />

                        <Text style={styles.setupOptionLabel}>{t('secondsPerQuestion') || "Soru Başı Saniye"}</Text>
                        <NumericInput
                            value={seconds}
                            setValue={setSeconds}
                            minValue={2}
                            maxValue={15}
                            quantity={t('qSeconds') || "sn"}
                        />
                    </View>

                    {/* Game-Specific Settings Card */}
                    <View style={styles.setupCard}>
                        {gameType === "wc" && <WcSettings />}
                        {gameType === "mcq" && <McqSettings />}
                        {gameType === "mp" && <MpSettings />}

                        <View style={pageStyles.switchRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.setupOptionLabel, { marginBottom: 2 }]}>{t("autoCont") || "Otomatik Devam Et"}</Text>
                                <Text style={pageStyles.switchSubtext}>{t("autoContDesc") || "Sonraki soruya otomatik geç"}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#E2E8F0", true: "#5B3FD3" }}
                                thumbColor="#FFFFFF"
                                value={autoCont}
                                onValueChange={setAutoCont}
                            />
                        </View>
                    </View>

                    {/* Start Game Button */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        disabled={!validGame}
                        onPress={startGame}
                        style={{ marginTop: 8 }}
                    >
                        <LinearGradient
                            colors={validGame ? ['#6D28D9', '#5B3FD3'] : ['#CBD5E1', '#94A3B8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={pageStyles.startGradientBtn}
                        >
                            <Feather name="play" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.startGameText}>{t('startGame') || "OYUNA BAŞLA"}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>

            {/* ActionSheet Selection Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={actionSheetStyles.backdrop}>
                    <Pressable style={actionSheetStyles.dismissArea} onPress={() => setModalVisible(false)} />
                    
                    <View style={actionSheetStyles.sheetContainer}>
                        <View style={actionSheetStyles.handleBar} />
                        
                        <View style={actionSheetStyles.headerRow}>
                            <Text style={actionSheetStyles.sheetTitle}>
                                {source === "personal" ? (t('selectDictionary') || "Sözlük Seçin") : (t('selectCollection') || "Koleksiyon Seçin")}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={actionSheetStyles.closeBtn}>
                                <Feather name="x" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {items.length === 0 ? (
                            <View style={actionSheetStyles.emptyBox}>
                                <Feather name="alert-circle" size={32} color="#94A3B8" />
                                <Text style={actionSheetStyles.emptyText}>
                                    {source === "personal" 
                                        ? (t('noDictionaryFound') || "En az 5 kelimeli sözlük bulunamadı.") 
                                        : (t('noItemFound') || "Öğe bulunamadı.")}
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={items}
                                keyExtractor={(item) => item.value.toString()}
                                contentContainerStyle={{ paddingBottom: 24 }}
                                renderItem={({ item }) => {
                                    const isSelected = item.value === value;
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[
                                                actionSheetStyles.optionRow,
                                                isSelected && actionSheetStyles.optionRowSelected
                                            ]}
                                            onPress={() => handleSelectItem(item.value)}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text style={[
                                                    actionSheetStyles.optionLabel,
                                                    isSelected && actionSheetStyles.optionLabelSelected
                                                ]}>
                                                    {item.label}
                                                </Text>
                                                {item.subtext ? (
                                                    <Text style={actionSheetStyles.optionSubtext}>{item.subtext}</Text>
                                                ) : null}
                                            </View>
                                            {isSelected && (
                                                <View style={actionSheetStyles.checkIconWrapper}>
                                                    <Feather name="check" size={16} color="#FFFFFF" />
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const pageStyles = StyleSheet.create({
    sourceRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    sourceCardButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F7FC',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E9E3FF',
    },
    sourceCardButtonActive: {
        backgroundColor: '#5B3FD3',
        borderColor: '#5B3FD3',
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#EDE9FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    iconCircleActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    sourceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4B5563',
    },
    sourceTextActive: {
        color: '#FFFFFF',
    },
    actionSheetTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F7FC',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E9E3FF',
    },
    triggerPlaceholder: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B5CF6',
        marginBottom: 2,
    },
    triggerValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    switchSubtext: {
        fontSize: 12,
        color: '#64748B',
    },
    startGradientBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 20,
    }
});

const actionSheetStyles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    sheetContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        maxHeight: '65%',
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    sheetTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B',
    },
    closeBtn: {
        padding: 6,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    emptyBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'center',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    optionRowSelected: {
        backgroundColor: '#F3E8FF',
        borderColor: '#C084FC',
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },
    optionLabelSelected: {
        color: '#6B21A8',
    },
    optionSubtext: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    checkIconWrapper: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#5B3FD3',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    }
});