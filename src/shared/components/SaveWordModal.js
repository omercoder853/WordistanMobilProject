import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native'
import { useState } from 'react';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import modalStyles from '../styles/modalStyles'
import { useDictionary } from '@/contextapis/DictContext';
import { useTranslation } from 'react-i18next';


export default function SaveWordModal({ modalVisible, setModalVisible, word, meaning, filteredDicts = [], isDaily = false }) {

    const [loading, setLoading] = useState(false);
    const [selectedDictId, setSelectedDictId] = useState(null);
    const { saveWord } = useDictionary();
    const { t } = useTranslation();

    const handleCloseModal = () => {
        if (!loading) {
            setModalVisible(false)
            setSelectedDictId(null)
        }
    }

    const handleSave = async () => {
        if (!selectedDictId || loading) return
        setLoading(true)
        try {
            const result = await saveWord(
                { dictionary_id: selectedDictId, word: word, meaning: meaning },
                isDaily
            )

        } catch (e) {
            console.log("Error saving daily word:", e);
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
    }

    return (
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={handleCloseModal}>
            <TouchableOpacity
                style={modalStyles.overlay}
                activeOpacity={1}
                onPress={handleCloseModal}>

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
                        <View style={{ marginTop: 6 }}>
                            <Text style={modalStyles.wordCardWord}>{word}</Text>
                            <Text style={[modalStyles.wordCardMeaning, { marginTop: 4 }]}>{meaning}</Text>
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
    )
}
