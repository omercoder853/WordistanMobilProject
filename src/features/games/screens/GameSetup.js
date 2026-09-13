import {
    View, Text, TouchableOpacity, KeyboardAvoidingView,
    Platform, ScrollView, Switch, Modal, FlatList, StyleSheet, Pressable
} from "react-native";
import styles from "../styles/styles";
import { useRoute, useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useMemo } from "react";
import { useDictionary } from "@/contextapis/DictContext";
import WcSettings from "../components/WordCompletionSettings";
import NumericInput from "../components/NumericInput";
import McqSettings from "../components/MultipleChoiceSettings";
import MpSettings from "../components/MatchingPairsSettings";
import { useGame } from "@/contextapis/GamesContext";
import { useTranslation } from "react-i18next";
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { useTheme } from "@/contextapis/ThemeContext";

export default function GameSetupPage() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();
    const navigation = useNavigation();
    const { dicts, setDictReload, getWords } = useDictionary();
    const { gameSettings, setGameSettings, resetGame, createQuestion } = useGame();
    const router = useRoute();
    const { gameType } = router.params || {};

    const [source, setSource] = useState(null);
    const [value, setValue] = useState(null);
    const [numberQuestion, setNumberQuestion] = useState(gameSettings?.numberQuestion || 5);
    const [seconds, setSeconds] = useState(gameSettings?.seconds || 5);
    const [visibleFirstLetter, setVisibleFirstLetter] = useState(gameSettings?.visibleFirstLetter || false);
    const [numberOptions, setNumberOptions] = useState(gameSettings?.numberOptions || 4);
    const [perPage, setPerPage] = useState(gameSettings?.perPage || 4);
    const [autoCont, setAutoCont] = useState(gameSettings?.autoCont || false);

    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [maxQuestion, setMaxQuestion] = useState(30);

    useEffect(() => {
        navigation.setOptions({ title: t('gameSettings') || 'Oyun Ayarları' });
    }, [t, navigation]);

    useEffect(() => {
        resetGame();
        const loadSaved = async () => {
            const savedAutoCont = await storage.get(STORAGE_KEYS.PREFERENCES.AUTO_CONT);
            if (savedAutoCont !== null) {
                setAutoCont(savedAutoCont);
            }
        };
        loadSaved();
    }, []);

    useEffect(() => {
        const getDicts = async ()=> {
            setDictReload(true);
        }
        getDicts();
    }, []);

    const handleToggleAutoCont = async (val) => {
        setAutoCont(val);
        await storage.set(STORAGE_KEYS.PREFERENCES.AUTO_CONT, val);
    };

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

    const startGame = async () => {
        const finalSettings = {
            gameType,
            source,
            value,
            numberQuestion,
            seconds,
            visibleFirstLetter,
            numberOptions,
            perPage,
            autoCont,
        };
        setGameSettings(finalSettings);
        await createQuestion(finalSettings);

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
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: colors.common.background }}>
                <ScrollView
                    contentContainerStyle={{ width: '92%', alignSelf: 'center', paddingBottom: 40, paddingTop: 16 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Source Selection Card */}
                    <View style={[styles.setupCard, { backgroundColor: colors.games.cardBg, borderColor: colors.games.cardBorder, shadowColor: colors.games.cardShadow }]}>
                        <Text style={[styles.setupOptionLabel, { color: colors.games.textPrimary }]}>{t('sourceChoice') || "Kaynak Seçimi"}</Text>

                        <View style={pageStyles.sourceRow}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    pageStyles.sourceCardButton,
                                    { backgroundColor: colors.games.stepperBg, borderColor: colors.games.stepperBorder },
                                    source === "personal" && { backgroundColor: colors.common.primary, borderColor: colors.common.primary }
                                ]}
                                onPress={() => handleSelectSource("personal")}
                            >
                                <View style={[pageStyles.iconCircle, { backgroundColor: isDark ? colors.common.surface : '#EDE9FE' }, source === "personal" && pageStyles.iconCircleActive]}>
                                    <Feather name="book-open" size={18} color={source === "personal" ? "#FFFFFF" : colors.common.primary} />
                                </View>
                                <Text style={[pageStyles.sourceText, { color: colors.games.textPrimary }, source === "personal" && pageStyles.sourceTextActive]}>
                                    {t('personal') || "Kişisel"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[
                                    pageStyles.sourceCardButton,
                                    { backgroundColor: colors.games.stepperBg, borderColor: colors.games.stepperBorder },
                                    source === "collection" && { backgroundColor: colors.common.primary, borderColor: colors.common.primary }
                                ]}
                                onPress={() => handleSelectSource("collection")}
                            >
                                <View style={[pageStyles.iconCircle, { backgroundColor: isDark ? colors.common.surface : '#EDE9FE' }, source === "collection" && pageStyles.iconCircleActive]}>
                                    <Feather name="grid" size={18} color={source === "collection" ? "#FFFFFF" : colors.common.primary} />
                                </View>
                                <Text style={[pageStyles.sourceText, { color: colors.games.textPrimary }, source === "collection" && pageStyles.sourceTextActive]}>
                                    {t('collections') || "Koleksiyonlar"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* ActionSheet Trigger Button */}
                        {source && (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[pageStyles.actionSheetTrigger, { backgroundColor: colors.games.stepperBg, borderColor: colors.games.stepperBorder }]}
                                onPress={() => setModalVisible(true)}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={[pageStyles.triggerPlaceholder, { color: colors.common.primary }]}>
                                        {source === "personal" ? (t('selectDictionary') || "Sözlük Seçin") : (t('selectCollection') || "Koleksiyon Seçin")}
                                    </Text>
                                    <Text style={[pageStyles.triggerValue, { color: colors.games.textPrimary }]} numberOfLines={1}>
                                        {selectedItemLabel || (t('makeChoice') || "Seçim yapınız...")}
                                    </Text>
                                </View>
                                <Feather name="chevron-down" size={20} color={colors.common.primary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Numeric Options Card */}
                    <View style={[styles.setupCard, { backgroundColor: colors.games.cardBg, borderColor: colors.games.cardBorder, shadowColor: colors.games.cardShadow }]}>
                        <Text style={[styles.setupOptionLabel, { color: colors.games.textPrimary }]}>{t('numberOfQuestions') || "Soru Sayısı"}</Text>
                        <NumericInput
                            value={numberQuestion}
                            setValue={setNumberQuestion}
                            maxValue={maxQuestion}
                            minValue={5}
                            quantity={t('qQuestions') || "soru"}
                        />

                        <Text style={[styles.setupOptionLabel, { color: colors.games.textPrimary }]}>{t('secondsPerQuestion') || "Soru Başı Saniye"}</Text>
                        <NumericInput
                            value={seconds}
                            setValue={setSeconds}
                            minValue={2}
                            maxValue={15}
                            quantity={t('qSeconds') || "sn"}
                        />
                    </View>

                    {/* Game-Specific Settings Card */}
                    <View style={[styles.setupCard, { backgroundColor: colors.games.cardBg, borderColor: colors.games.cardBorder, shadowColor: colors.games.cardShadow }]}>
                        {gameType === "wc" && (
                            <WcSettings
                                visibleFirstLetter={visibleFirstLetter}
                                setVisibleFirstLetter={setVisibleFirstLetter}
                            />
                        )}
                        {gameType === "mcq" && (
                            <McqSettings
                                numberOptions={numberOptions}
                                setnumberOptions={setNumberOptions}
                            />
                        )}
                        {gameType === "mp" && (
                            <MpSettings
                                perPage={perPage}
                                setPerPage={setPerPage}
                            />
                        )}

                        <View style={[pageStyles.switchRow, { borderTopColor: colors.common.borderSubtle }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.setupOptionLabel, { marginBottom: 2, color: colors.games.textPrimary }]}>{t("autoCont") || "Otomatik Devam Et"}</Text>
                                <Text style={[pageStyles.switchSubtext, { color: colors.games.textSecondary }]}>{t("autoContDesc") || "Sonraki soruya otomatik geç"}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: isDark ? "#333544" : "#E2E8F0", true: colors.common.primary }}
                                thumbColor="#FFFFFF"
                                value={autoCont}
                                onValueChange={handleToggleAutoCont}
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
                            colors={validGame ? (isDark ? ['#7C3AED', '#5B3FD3'] : ['#6D28D9', '#5B3FD3']) : (isDark ? ['#2A2B36', '#1E1E24'] : ['#CBD5E1', '#94A3B8'])}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={pageStyles.startGradientBtn}
                        >
                            <Feather name="play" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.startGameText}>{t('startGame') || "OYUNA BAŞLA"}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* ActionSheet Selection Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                statusBarTranslucent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[actionSheetStyles.backdrop, { backgroundColor: colors.games.modalOverlay }]}>
                    <Pressable style={actionSheetStyles.dismissArea} onPress={() => setModalVisible(false)} />

                    <View style={[actionSheetStyles.sheetContainer, { backgroundColor: colors.games.modalBg }]}>
                        <View style={[actionSheetStyles.handleBar, { backgroundColor: colors.common.borderSubtle }]} />

                        <View style={[actionSheetStyles.headerRow, { borderBottomColor: colors.common.borderSubtle }]}>
                            <Text style={[actionSheetStyles.sheetTitle, { color: colors.games.textPrimary }]}>
                                {source === "personal" ? (t('selectDictionary') || "Sözlük Seçin") : (t('selectCollection') || "Koleksiyon Seçin")}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[actionSheetStyles.closeBtn, { backgroundColor: isDark ? colors.common.surface : '#F1F5F9' }]}>
                                <Feather name="x" size={20} color={colors.games.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {items.length === 0 ? (
                            <View style={actionSheetStyles.emptyBox}>
                                <Feather name="alert-circle" size={32} color={colors.games.textMuted} />
                                <Text style={[actionSheetStyles.emptyText, { color: colors.games.textSecondary }]}>
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
                                                { backgroundColor: isDark ? colors.common.surface : '#F8FAFC', borderColor: colors.common.borderSubtle },
                                                isSelected && { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.25)' : '#F3E8FF', borderColor: colors.common.primary }
                                            ]}
                                            onPress={() => handleSelectItem(item.value)}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text style={[
                                                    actionSheetStyles.optionLabel,
                                                    { color: colors.games.textPrimary },
                                                    isSelected && { color: colors.common.primary }
                                                ]}>
                                                    {item.label}
                                                </Text>
                                                {item.subtext ? (
                                                    <Text style={[actionSheetStyles.optionSubtext, { color: colors.games.textSecondary }]}>{item.subtext}</Text>
                                                ) : null}
                                            </View>
                                            {isSelected && (
                                                <View style={[actionSheetStyles.checkIconWrapper, { backgroundColor: colors.common.primary }]}>
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