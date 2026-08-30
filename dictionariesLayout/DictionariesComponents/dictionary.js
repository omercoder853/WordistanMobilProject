import { View, Text, Image, TouchableOpacity, Modal, Pressable,StyleSheet } from 'react-native'
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDictionary } from '../../contextapis/DictContext';
import CustomAlert from '../../commonComponents/customAlert/customAlert';

export default function Dictionary({ title, length, id, language }) {
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

    const formattedLang = language === "TR to ENG" ? "TR → ENG" : language === "ENG to TR" ? "ENG → TR" : (language || "TR → ENG");

    return (
        <>
            <TouchableOpacity 
                onPress={() => navigation.navigate("DictDetails", { dictId: id })} 
                style={styles.dictionaryButton}
                activeOpacity={0.8}
            >
                <View style={styles.dictionaryRow}>
                    <Image source={require('../../assets/dictionary-cover.jpg')} style={styles.dictionaryCover} />
                    <View style={{ flex: 1, paddingHorizontal: 12, gap: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ flex: 1, fontWeight: '700', fontSize: 16, color: '#1E1B4B' }}>{title}</Text>
                            <TouchableOpacity onPress={handleOpenOptions} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <SimpleLineIcons name="options" size={18} color="#8E4A7C" />
                            </TouchableOpacity>
                        </View>
                        
                        {/* Dil Yönü Rozeti */}
                        <View style={styles.langBadge}>
                            <Text style={styles.langBadgeText}>{formattedLang}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                            <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '500' }}>
                                {length == 0 ? t('empty') : length + ' ' + t('words')}
                            </Text>
                            <Text style={{ color: '#94A3B8', fontSize: 11 }}>{t('lastUpdateStr')}</Text>
                        </View>
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

const styles = StyleSheet.create({
    dictionaryButton:{
        borderRadius:18,
        marginBottom:14,
        elevation:3,
        shadowColor: '#8E4A7C',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        backgroundColor:'#FAF6F8',
        borderWidth: 1.5,
        borderColor: '#8E4A7C9E',
    },
    dictionaryRow:{
        flexDirection:'row',
        width:'100%',
        padding:14,
        alignItems:'center',
        borderRadius:18,
    },
    dictionaryCover:{
        width:54,
        height:54,
        borderRadius:14,
        borderWidth: 1,
        borderColor: '#EDE9FE',
    },
    langBadge:{
        backgroundColor: '#FDF2F8',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#8E4A7C',
        alignSelf: 'flex-start',
        marginVertical: 3,
    },
    langBadgeText:{
        fontSize: 11,
        fontWeight: '700',
        color: '#8E4A7C',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: '85%',
        maxWidth: 340,
        paddingVertical: 18,
        paddingHorizontal: 16,
        elevation: 10,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    modalOptionsList: {
        paddingTop: 8,
    },
    modalOptionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 14,
        gap: 14,
    },
    modalOptionIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalDangerIconWrapper: {
        backgroundColor: '#FEE2E2',
    },
    modalOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
    },
    modalDangerText: {
        color: '#EF4444',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 4,
    }
})