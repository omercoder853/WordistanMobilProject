import { View, Text, Image, TouchableOpacity, Modal, Pressable } from 'react-native'
import styles from '../DictionariesStyles/dictStyles'
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDictionary } from '../../contextapis/DictContext';
import CustomAlert from '../../commonComponents/customAlert/customAlert';

export default function Dictionary({ title, length, id }) {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [warnVisible,setWarnVisible] = useState(false)
    const [successVisible,setSuccessVisible] = useState(false)
    const [errVisible,setErrVisible] = useState(false)
    const [loading,setLoading] = useState(false)
    const {deleteDictionary,setDictReload} = useDictionary();

    const handleOpenOptions = (e) => {
        e?.stopPropagation?.();
        setVisible(true);
    };

    const handleCloseOptions = (e) => {
        e?.stopPropagation?.();
        setVisible(false);
    };

    const handleOptionPress = (optionType) => {
        // onPress fonksiyonları kullanıcı isteği doğrultusunda şu anlık boş geçiliyor
        setVisible(false);
    };

    const handleDeleteDict = async(dict_id) => {
        const res = await deleteDictionary(dict_id)
        if (res.success){
            setWarnVisible(false)
            setSuccessVisible(true)
        }
        else {
            setWarnVisible(false)
            setErrVisible(true)
        }
    }

    return (
        <>
            <TouchableOpacity onPress={() => navigation.navigate("DictDetails", { dictId: id })} style={styles.dictionaryButton}>
                <View style={styles.dictionaryRow}>
                    <Image source={require('../../assets/dictionary-cover.jpg')} style={styles.dictionaryCover} />
                    <View style={{ flex: 1, paddingHorizontal: 10, gap: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: 'auto', fontWeight: '700', fontSize: 16, color: '#334155' }}>{title}</Text>
                            <TouchableOpacity onPress={handleOpenOptions} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <SimpleLineIcons name="options" size={18} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: '#64748B', fontSize: 13 }}>{length == 0 ? t('empty') : length + ' ' + t('words')}</Text>
                        <Text style={{ color: '#94A3B8', fontSize: 12 }}>{t('lastUpdateStr')}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal statusBarTranslucent={true} visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <Pressable style={styles.overlay} onPress={handleCloseOptions}>
                    <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('dictOptions')}</Text>
                            <TouchableOpacity onPress={handleCloseOptions} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name="close" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalOptionsList}>
                            <TouchableOpacity style={styles.modalOptionItem} activeOpacity={0.7} onPress={() => handleOptionPress('edit')}>
                                <View style={styles.modalOptionIconWrapper}>
                                    <Ionicons name="create-outline" size={20} color="#8E4A7C" />
                                </View>
                                <Text style={styles.modalOptionText}>{t('editDictionary')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalOptionItem} activeOpacity={0.7} onPress={() => handleOptionPress('share')}>
                                <View style={styles.modalOptionIconWrapper}>
                                    <Ionicons name="share-social-outline" size={20} color="#8E4A7C" />
                                </View>
                                <Text style={styles.modalOptionText}>{t('shareDictionary')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalOptionItem} activeOpacity={0.7} onPress={() => handleOptionPress('share')}>
                                <View style={styles.modalOptionIconWrapper}>
                                    <Ionicons name="download-outline" size={20} color="#8E4A7C" />
                                </View>
                                <Text style={styles.modalOptionText}>{t('downloadDictionary')}</Text>
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity style={styles.modalOptionItem} activeOpacity={0.7} onPress={() => setWarnVisible(true)}>
                                <View style={[styles.modalOptionIconWrapper, styles.modalDangerIconWrapper]}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </View>
                                <Text style={[styles.modalOptionText, styles.modalDangerText]}>{t('deleteDictionary')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
            <CustomAlert visible={warnVisible} 
            title={t("warning")} 
            message={t("deleteDictConfirmQuestion",{name:title,count:length})}
            buttons={[{text:t("cancel"),style:"cancel",action:()=>setWarnVisible(false)},
                        {text:t("delete"),style:"danger",action:()=>handleDeleteDict(id)}]}/>
            <CustomAlert visible={successVisible}
            title={t("operationSuccessful")}
            message={t("dictDeletingSuccessfull")}
            buttons={[{text:t("cancel"),action:()=>{setVisible(false),setWarnVisible(false),setDictReload(true)}}]}/>
            <CustomAlert visible={errVisible}
            title={t("ooops")}
            message={t("dictDeletingError")}
            buttons={[{text:t("cancel"),action:()=>{setVisible(false),setWarnVisible(false),setDictReload(true)}}]}/>
        </>
    )
}