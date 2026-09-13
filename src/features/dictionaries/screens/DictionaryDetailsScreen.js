import {
    View, Text, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator,
    KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, StyleSheet
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDictionary } from "@/contextapis/DictContext";
import Word from "../components/WordListItem";
import styles from "../styles/DictionaryStyles";
import alertStyles from "@/shared/components/customAlert/customAlertStyle";
import EmptyDictionary from "../components/EmptyDictionaryState";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contextapis/ThemeContext";

export default function DictDetails() {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();
    const { getWords, getDict, saveWord, setDictReload } = useDictionary();
    const route = useRoute();
    const { dictId } = route.params;
    const [words, setWords] = useState([]);
    const [reload, setReload] = useState(true);

    // Modal & Add word state
    const [modalVisible, setModalVisible] = useState(false);
    const [wordInput, setWordInput] = useState("");
    const [meaningInput, setMeaningInput] = useState("");
    const [pageLoading, setPageLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!reload) return;
        let isMounted = true;
        setPageLoading(true);

        const fetchWords = async () => {
            try {
                const fetchedWords = (await getWords(dictId)) || [];
                if (isMounted) {
                    setWords(fetchedWords);
                }
            } catch (error) {
                console.error('Kelimeler çekilemedi:', error);
            } finally {
                if (isMounted) {
                    setPageLoading(false);
                    setReload(false);
                }
            }
        };
        fetchWords();
        return () => {
            isMounted = false;
        };
    }, [reload, dictId]);

    const dict = getDict(dictId);

    const handleSaveWord = async () => {
        if (!wordInput.trim() || !meaningInput.trim() || loading) return;
        setLoading(true);
        try {
            const ok = await saveWord({
                dictionary_id: dictId,
                word: wordInput.trim(),
                meaning: meaningInput.trim()
            });
            if (ok) {
                setWordInput("");
                setMeaningInput("");
                setModalVisible(false);
                setReload(true);
                setDictReload(true);
            }
            else {
                setWordInput("");
                setMeaningInput("");
                setModalVisible(false);
            }
        } catch (error) {
            console.log("Error saving word:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (!loading) {
            setModalVisible(false);
            setWordInput("");
            setMeaningInput("");
        }
    };

    return (
        <View style={[styles.wordsTable, { flex: 1, backgroundColor: colors.common.background }]}>
            <LinearGradient
                colors={['#c967e6', '#9c27b0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.wordsTitle}>

                <Text style={styles.dictName}>{dict?.name}</Text>
                <View style={styles.dictDirectionContainer}>
                    <Text style={styles.dictDirection}>{dict?.language}</Text>
                    <Text style={styles.dictDirection}>{words.length == 0 ? t("empty") : words.length + " " + t("words")}</Text>
                </View>
                <View style={{ borderWidth: 0.5, borderColor: 'rgba(255, 255, 255, 0.4)', marginVertical: 15 }}></View>
                <Text style={styles.dictDescription}>{dict?.description}</Text>
            </LinearGradient>
            {!pageLoading ?
                (<FlatList
                    style={styles.wordList}
                    data={words}
                    renderItem={({ item, index }) => <Word word={item} index={index} setReload={setReload} />}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ListEmptyComponent={(<EmptyDictionary />)} />) :
                (<View style={{ flex: 1, alignItems: 'center', marginTop: 150 }}>
                    <ActivityIndicator size="large" style={{ alignSelf: "center", transform: [{ scale: 2.5 }] }} color={dColors.tabActive} />
                </View>)}

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[localStyles.fab, { backgroundColor: dColors.addBtnBg }]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}>
                <MaterialCommunityIcons name="plus" size={30} color={dColors.addBtnIcon} />
            </TouchableOpacity>

            {/* Add Word Modal */}
            <Modal
                visible={modalVisible}
                statusBarTranslucent={true}
                animationType="fade"
                transparent
                onRequestClose={handleCloseModal}>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[localStyles.modalOverlay, { backgroundColor: dColors.modalOverlay }]}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={localStyles.keyboardAvoid}
                        >
                            <View style={[localStyles.modalCard, { backgroundColor: dColors.modalBg, shadowColor: dColors.cardShadow }]}>
                                {/* Header */}
                                <View style={[localStyles.modalHeaderRow, { borderBottomColor: dColors.cardBorder }]}>
                                    <Text style={[localStyles.modalTitle, { color: dColors.modalTitle }]}>{t('addNewWord')}</Text>
                                    <TouchableOpacity onPress={handleCloseModal} disabled={loading} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <MaterialCommunityIcons name="close" size={22} color={dColors.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                {/* Word Input */}
                                <Text style={[localStyles.fieldLabel, { color: dColors.textSecondary }]}>{t('wordLabel')}</Text>
                                <TextInput
                                    style={[
                                        localStyles.textInput,
                                        {
                                            backgroundColor: dColors.searchBarBg,
                                            borderColor: dColors.searchBarBorder,
                                            color: dColors.textPrimary,
                                        }
                                    ]}
                                    placeholder={t('enterWord')}
                                    placeholderTextColor={dColors.searchBarPlaceholder}
                                    value={wordInput}
                                    editable={!loading}
                                    onChangeText={setWordInput}
                                />

                                {/* Meaning Input */}
                                <Text style={[localStyles.fieldLabel, { color: dColors.textSecondary }]}>{t('meaningLabel')}</Text>
                                <TextInput
                                    style={[
                                        localStyles.textInput,
                                        {
                                            backgroundColor: dColors.searchBarBg,
                                            borderColor: dColors.searchBarBorder,
                                            color: dColors.textPrimary,
                                        }
                                    ]}
                                    placeholder={t('enterMeaning')}
                                    placeholderTextColor={dColors.searchBarPlaceholder}
                                    value={meaningInput}
                                    editable={!loading}
                                    onChangeText={setMeaningInput}
                                />

                                {/* Action Buttons */}
                                <View style={localStyles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[localStyles.cancelButton, { backgroundColor: dColors.modalItemBg, borderColor: dColors.cardBorder }]}
                                        onPress={handleCloseModal}
                                        disabled={loading}
                                    >
                                        <Text style={[localStyles.cancelButtonText, { color: dColors.textSecondary }]}>{t('cancel')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            localStyles.submitButton,
                                            { backgroundColor: dColors.addBtnBg },
                                            (!wordInput.trim() || !meaningInput.trim() || loading) && { opacity: 0.5 }
                                        ]}
                                        onPress={handleSaveWord}
                                        disabled={!wordInput.trim() || !meaningInput.trim() || loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFFFFF" size="small" />
                                        ) : (
                                            <Text style={localStyles.submitButtonText}>{t('save')}</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const localStyles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    keyboardAvoid: {
        width: '100%',
        alignItems: 'center',
    },
    modalCard: {
        width: '100%',
        maxWidth: 360,
        borderRadius: 24,
        padding: 22,
        elevation: 12,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    modalHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 14,
        marginBottom: 16,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 6,
    },
    textInput: {
        borderRadius: 14,
        borderWidth: 1.5,
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 14,
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});