import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather, Entypo } from '@expo/vector-icons';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useDictionary } from '../../contextapis/DictContext';
import useSpeech from '../../hooks/useSpeech';
import SaveWordModal from '../../dictionariesLayout/DictionariesComponents/SaveWordModal';

const DailyWord = () => {
    const { speak, stop, isSpeaking } = useSpeech();
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false)
    const { dailyWord, setDictReload, deleteWord,dicts } = useDictionary();
    const lang = i18n.language

    const heartToggle = async () => {
        if (dailyWord != null && dailyWord.is_saved) {
            await deleteWord(dailyWord["saved_id"]);
        }
        else {
            setDictReload(true);
            setModalVisible(true);
        }
    }

    const handleSpeak = () => {
        if (!isSpeaking) {
            speak(lang == 'tr' ? dailyWord?.word : dailyWord?.meaning);
        }
        else {
            stop();
        }
    }

    const filteredDicts = (dicts || []).filter(dict =>
        (lang === 'tr' && dict.language === 'ENG to TR') ||
        (lang === 'en' && dict.language === 'TR to ENG')
    );

    const word = lang === 'tr' ? dailyWord?.word : dailyWord?.meaning;
    const meaning = lang === 'tr' ? dailyWord?.meaning : dailyWord?.word;


    return (
        <>
            <LinearGradient colors={['#FF928A', '#DA87D6', '#C382FE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dailyWordContainer}>
                <View style={styles.dailyWordRow}>
                    <Text style={[styles.dailyWordTitle, { color: 'white' }]}>{t('wordOfTheDay')}</Text>
                    <View style={styles.dailyWordButtons}>
                        <TouchableOpacity onPress={handleSpeak}
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20, marginRight: 8 }}>
                            <Feather name="volume-2" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={heartToggle} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 }}>
                            <Entypo name={dailyWord?.is_saved ? "heart" : "heart-outlined"} size={20} color={dailyWord?.is_saved ? "red" : "white"} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={[styles.dailyWordLabel, { color: 'rgba(255,255,255,0.8)' }]}>{t('word')}</Text>
                <Text style={[styles.dailyWordContent, { color: 'white', fontSize: 28, marginTop: 5 }]}>{word}</Text>
                <Text style={[styles.dailyWordLabel, { color: 'rgba(255,255,255,0.8)' }]}>{t('meaning')}</Text>
                <Text style={[styles.dailyWordContent, { color: 'white', fontSize: 18 }]}>{meaning}</Text>
                <Text style={[styles.dailyWordLabel, { color: 'rgba(255,255,255,0.8)' }]}>{t('inSentence')}</Text>
                <Text style={[styles.dailyWordContent, { color: 'white' }]}>{lang == 'tr' ? dailyWord?.example_en : dailyWord?.example_tr}</Text>
            </LinearGradient>

            {/* Sözlük Seçim Modalı */}
            <SaveWordModal modalVisible={modalVisible} setModalVisible={setModalVisible} filteredDicts={filteredDicts} word={word} meaning={meaning} isDaily={true} />
        </>
    )
}

export default DailyWord;

const styles = StyleSheet.create({
    dailyWordContainer: {
        padding: 20,
        borderRadius: 25,
        elevation: 8,
        shadowColor: '#8E4A7C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        marginHorizontal: 10,
        marginVertical: 15
    },
    dailyWordRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dailyWordButtons: {
        flexDirection: 'row',
        marginLeft: 'auto'
    },
    dailyWordTitle: {
        color: '#8E4A7C',
        fontSize: 23,
        fontWeight: '900'
    },
    dailyWordLabel: {
        fontSize: 12,
        fontStyle: 'italic',
        color: 'gray',
        marginTop: 10
    },
    dailyWordContent: {
        fontSize: 15,
        fontWeight: '700'
    },
})