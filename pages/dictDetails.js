import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useDictionary } from "../contextapis/DictContext";
import Word from "../dictionariesLayout/DictionariesComponents/wordRow";
import styles from "../dictionariesLayout/DictionariesStyles/dictStyles";
import alertStyles from "../commonComponents/customAlert/customAlertStyle";
import EmptyDictionary from "../dictionariesLayout/DictionariesComponents/emptyDictionary";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function DictDetails() {
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchWords = async () => {
            if (!reload) return;

            try {
                const fetchedWords = (await getWords(dictId)) || [];
                if (isMounted) {
                    setWords(fetchedWords);
                }
            } catch (error) {
                console.error('Kelimeler çekilemedi:', error);
            } finally {
                if (isMounted) {
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
            const status = await saveWord({
                dictionary_id: dictId,
                word: wordInput.trim(),
                meaning:meaningInput.trim()
            });
            if (status) {
                setWordInput("");
                setMeaningInput("");
                setModalVisible(false);
                setReload(true);
                setDictReload(true);
            }
            else{
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
        <View style={[styles.wordsTable, { flex: 1 }]}>
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

            <FlatList
                style={styles.wordList}
                data={words}
                renderItem={({ item, index }) => <Word word={item} index={index} setReload={setReload} />}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={(<EmptyDictionary />)}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={localStyles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Add Word Modal */}
            <Modal
                visible={modalVisible}
                statusBarTranslucent={true}
                animationType="fade"
                transparent
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={alertStyles.overlay}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <View style={[alertStyles.alertBox, { alignItems: 'flex-start' }]}>
                                <View style={localStyles.modalHeaderRow}>
                                    <Text style={styles.addDictTitle}>{t('addNewWord')}</Text>
                                </View>

                                <Text style={styles.addDictLabel}>{t('wordLabel')}</Text>
                                <TextInput
                                    style={styles.addDictInput}
                                    placeholder={t('enterWord')}
                                    value={wordInput}
                                    onChangeText={setWordInput}
                                />

                                <Text style={styles.addDictLabel}>{t('meaningLabel')}</Text>
                                <TextInput
                                    style={styles.addDictInput}
                                    placeholder={t('enterMeaning')}
                                    value={meaningInput}
                                    onChangeText={setMeaningInput}
                                />

                                <View style={[alertStyles.buttonContainer, { marginTop: 10 }]}>
                                    <TouchableOpacity
                                        style={alertStyles.cancel}
                                        onPress={handleCloseModal}
                                        disabled={loading}
                                    >
                                        <Text style={{ color: 'white', fontWeight: '600' }}>{t('cancel')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            alertStyles.success,
                                            (!wordInput.trim() || !meaningInput.trim() || loading) && { opacity: 0.6 }
                                        ]}
                                        onPress={handleSaveWord}
                                        disabled={!wordInput.trim() || !meaningInput.trim() || loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <Text style={{ color: 'white', fontWeight: '900' }}>{t('save')}</Text>
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
        backgroundColor: '#8E4A7C',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#8E4A7C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
});