import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from 'react-native'
import { Feather, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useDictionary } from '../../contextapis/DictContext';
import CustomAlert from '../../commonComponents/customAlert/customAlert';
import modalStyles from '../HomePageStyles/modalStyles';

const DailyWord = () => {
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false)
    const { saveWord, dailyWord, setDailyWord, dicts, setDictReload, deleteWord } = useDictionary();
    const [selectedDictId, setSelectedDictId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const lang = i18n.language

    const heartToggle = async () => {
        if (dailyWord != null && dailyWord.is_saved) {
            await deleteWord(dailyWord["saved_id"]);
        }
        else {
            setDictReload(true);
            setSelectedDictId(null);
            setModalVisible(true);
        }
    }

    const handleSave = async () => {
        if (!selectedDictId || loading) return
        setLoading(true)
        try {
            const result = await saveWord(
                { dictionary_id: selectedDictId, word: dailyWord.word, meaning: dailyWord.meaning },
                null,
                true
            )
            if (result) {
                setSuccess(true);
                setModalVisible(false);
            } else {
                setFail(true)
            }
        } catch (e) {
            setFail(true)
        } finally {
            setLoading(false)
        }
    }

    const handleCloseModal = () => {
        if (!loading) {
            setModalVisible(false)
            setSelectedDictId(null)
        }
    }

    const filteredDicts = (dicts || []).filter(dict =>
        (lang === 'tr' && dict.language === 'ENG to TR') ||
        (lang === 'en' && dict.language === 'TR to ENG')
    );

    return (
        <>
            <LinearGradient colors={['#FF928A', '#DA87D6', '#C382FE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dailyWordContainer}>
                <View style={styles.dailyWordRow}>
                    <Text style={[styles.dailyWordTitle, { color: 'white' }]}>{t('wordOfTheDay')}</Text>
                    <View style={styles.dailyWordButtons}>
                        <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20, marginRight: 8 }}>
                            <Feather name="volume-2" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={heartToggle} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 20 }}>
                            <Entypo name={dailyWord?.is_saved ? "heart" : "heart-outlined"} size={20} color={dailyWord?.is_saved ? "red" : "white"} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={[styles.dailyWordLabel, { color: 'rgba(255,255,255,0.8)' }]}>{t('word')}</Text>
                <Text style={[styles.dailyWordContent, { color: 'white', fontSize: 28, marginTop: 5 }]}>{lang == 'tr' ? dailyWord?.word : dailyWord?.meaning}</Text>
                <Text style={[styles.dailyWordLabel, { color: 'rgba(255,255,255,0.8)' }]}>{t('meaning')}</Text>
                <Text style={[styles.dailyWordContent, { color: 'white', fontSize: 18 }]}>{lang == 'tr' ? dailyWord?.meaning : dailyWord?.word}</Text>
                <Text style={[styles.dailyWordLabel, { color: 'rgba(255,255,255,0.8)' }]}>{t('inSentence')}</Text>
                <Text style={[styles.dailyWordContent, { color: 'white' }]}>{lang == 'tr' ? dailyWord?.example_en : dailyWord?.example_tr}</Text>
            </LinearGradient>

            {/* Sözlük Seçim Modalı */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={handleCloseModal}
            >
                <TouchableOpacity
                    style={modalStyles.overlay}
                    activeOpacity={1}
                    onPress={handleCloseModal}
                >
                    <TouchableOpacity activeOpacity={1} style={modalStyles.container}>
                        {/* Header */}
                        <View style={modalStyles.header}>
                            <View style={modalStyles.headerLeft}>
                                <View style={modalStyles.iconCircle}>
                                    <MaterialCommunityIcons name="book-plus-outline" size={22} color="#8E4A7C" />
                                </View>
                                <Text style={modalStyles.title}>{t('saveToDict')}</Text>
                            </View>
                            <TouchableOpacity onPress={handleCloseModal} style={modalStyles.closeIcon}>
                                <Ionicons name="close" size={22} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View style={modalStyles.divider} />

                        {/* Kelime Kartı */}
                        <View style={modalStyles.wordCard}>
                            <Text style={modalStyles.wordCardLabel}>{t('wordToSave')}</Text>
                            <View style={modalStyles.wordCardRow}>
                                <Text style={modalStyles.wordCardWord}>{lang == 'tr' ? dailyWord?.word : dailyWord?.meaning}</Text>
                                <View style={modalStyles.wordCardDot} />
                                <Text style={modalStyles.wordCardMeaning}>{lang == 'tr' ? dailyWord?.meaning : dailyWord?.word}</Text>
                            </View>
                        </View>

                        {/* Sözlük Listesi */}
                        <Text style={modalStyles.sectionLabel}>{t('selectADictionary')}</Text>

                        {filteredDicts.length > 0 ? (
                            <ScrollView
                                style={modalStyles.dictList}
                                showsVerticalScrollIndicator={false}
                                bounces={false}>

                                {filteredDicts.map((dict) => {
                                    const isMatch = (lang === 'tr' && dict.language === "ENG to TR") ||
                                        (lang === 'en' && dict.language === "TR to ENG");
                                    if (isMatch) {
                                        const isSelected = selectedDictId === dict.id
                                        return (
                                            <TouchableOpacity
                                                key={dict.id}
                                                style={[
                                                    modalStyles.dictItem,
                                                    isSelected && modalStyles.dictItemSelected
                                                ]}
                                                onPress={() => setSelectedDictId(dict.id)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={modalStyles.dictItemLeft}>
                                                    <View style={[
                                                        modalStyles.dictItemIcon,
                                                        isSelected && modalStyles.dictItemIconSelected
                                                    ]}>
                                                        <MaterialCommunityIcons
                                                            name="book-outline"
                                                            size={18}
                                                            color={isSelected ? '#fff' : '#8E4A7C'}
                                                        />
                                                    </View>
                                                    <View style={modalStyles.dictItemInfo}>
                                                        <Text style={[
                                                            modalStyles.dictItemName,
                                                            isSelected && modalStyles.dictItemNameSelected
                                                        ]}>{dict.name}</Text>
                                                        <Text style={modalStyles.dictItemLang}>
                                                            {dict.language?.toUpperCase()} • {dict.words?.length || 0} {t('words')}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={[
                                                    modalStyles.radioOuter,
                                                    isSelected && modalStyles.radioOuterSelected
                                                ]}>
                                                    {isSelected && <View style={modalStyles.radioInner} />}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }

                                })}
                            </ScrollView>
                        ) : (
                            <View style={modalStyles.emptyState}>
                                <MaterialCommunityIcons name="book-off-outline" size={40} color="#D1D5DB" />
                                <Text style={modalStyles.emptyTitle}>{t('noDictYet')}</Text>
                                <Text style={modalStyles.emptyDesc}>{t('createDictFirst')}</Text>
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View style={modalStyles.buttonRow}>
                            <TouchableOpacity
                                style={modalStyles.cancelButton}
                                onPress={handleCloseModal}
                                disabled={loading}
                            >
                                <Text style={modalStyles.cancelButtonText}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    modalStyles.saveButton,
                                    (!selectedDictId || loading) && modalStyles.saveButtonDisabled
                                ]}
                                onPress={handleSave}
                                disabled={!selectedDictId || loading}
                            >
                                {loading
                                    ? <ActivityIndicator color="white" size="small" />
                                    : <Text style={modalStyles.saveButtonText}>{t('save')}</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Başarı & Hata Alertleri */}
            <CustomAlert
                visible={success}
                title={t('dailyWordSaved')}
                message={t('dailyWordSavedMsg')}
                buttons={[{ text: t('ok'), style: 'success', action: () => setSuccess(false) }]}
            />
            <CustomAlert
                visible={fail}
                title={t('ooops')}
                message={t('dailyWordSaveError')}
                buttons={[{ text: t('cancel'), style: 'danger', action: () => setFail(false) }]}
            />
        </>
    )
}

export default DailyWord;

const styles = StyleSheet.create({
    dailyWordContainer:{
        padding:20,
        borderRadius:25,
        elevation:8,
        shadowColor: '#8E4A7C',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
        marginHorizontal:10,
        marginVertical:15
    },
    dailyWordRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    dailyWordButtons:{
        flexDirection:'row',
        marginLeft:'auto'
    },
    dailyWordTitle:{
        color:'#8E4A7C',
        fontSize:23,
        fontWeight:'900'
    },
    dailyWordLabel:{
        fontSize:12,
        fontStyle:'italic',
        color:'gray',
        marginTop:10
    },
    dailyWordContent:{
        fontSize:15,
        fontWeight:'700'
    },
})