import { View, Text, Image, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native'
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDictionary } from '../../contextapis/DictContext';
import {useFeedback} from '../../contextapis/FeedbackContext';

export default function Dictionary({ title, length, id, language }) {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState('.pdf');
    const [fileTypeOpen, setFileTypeOpen] = useState(false);
    const { deleteDictionary, setDictReload, ShareDictionary } = useDictionary();

    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible,setAlertLoading,hideAlert } = useFeedback();

    const formatColors = {
        '.pdf': { color: '#EF4444', bg: '#FEE2E2', name: 'PDF' },
        '.json': { color: '#0284C7', bg: '#E0F2FE', name: 'JSON' },
        '.csv': { color: '#D97706', bg: '#FEF3C7', name: 'CSV' },
        '.txt': { color: '#64748B', bg: '#F1F5F9', name: 'TXT' },
    };

    const fileTypeItems = [
        {
            label: 'PDF',
            value: '.pdf',
            icon: () => (
                <View style={[styles.formatIconBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="document-text" size={15} color="#EF4444" />
                </View>
            ),
        },
        {
            label: 'JSON',
            value: '.json',
            icon: () => (
                <View style={[styles.formatIconBadge, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="code-slash" size={15} color="#0284C7" />
                </View>
            ),
        },
        {
            label: 'CSV',
            value: '.csv',
            icon: () => (
                <View style={[styles.formatIconBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="grid-outline" size={15} color="#D97706" />
                </View>
            ),
        },
        {
            label: 'TXT',
            value: '.txt',
            icon: () => (
                <View style={[styles.formatIconBadge, { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name="reader-outline" size={15} color="#64748B" />
                </View>
            ),
        },
    ];

    const handleOpenOptions = (e) => {
        e?.stopPropagation?.();
        setVisible(true);
    };

    const handleCloseOptions = (e) => {
        e?.stopPropagation?.();
        setVisible(false);
    };

    const handleOptionPress = () => {
        setVisible(false);
    };

    const handleOptionShare = () => {
        setVisible(false);
        setShareVisible(true);
    };

    const handleCloseShare = () => {
        setShareVisible(false);
        setFileTypeOpen(false);
        setVisible(true);
    };

    const handleShareSubmit = async () => {
        if (ShareDictionary) {
            await ShareDictionary({ fileType: selectedFileType, dictID: id });
        }
        setShareVisible(false);
        setFileTypeOpen(false);
    };

    const handleDeleteButton = () => {
        setVisible(false);
        setAlertTitle(t("warning"));
        setAlertMessage(t("deleteDictConfirmQuestion",{name:title,count:length}));
        addAlertButton({text:t("cancel"),style:"cancel",action:()=>{hideAlert() , setVisible(true)}});
        addAlertButton({text:t("delete"),style:"danger",action:()=>handleDeleteDict(id) , needLoading:true});
        setAlertVisible(true);
    }

    const handleDeleteDict = async (dict_id) => {
        setAlertLoading(true);
        const res = await deleteDictionary(dict_id);
        if (res) {
            setDictReload(true);
        }
        hideAlert();
        setVisible(false);
        setAlertLoading(false);
    };

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

                            <TouchableOpacity style={styles.modalOptionItem} activeOpacity={0.7} onPress={handleOptionShare}>
                                <View style={styles.modalOptionIconWrapper}>
                                    <Ionicons name="share-social-outline" size={20} color="#8E4A7C" />
                                </View>
                                <Text style={styles.modalOptionText}>{t('shareDictionary')}</Text>
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity style={styles.modalOptionItem} activeOpacity={0.7} onPress={() => handleDeleteButton()}>
                                <View style={[styles.modalOptionIconWrapper, styles.modalDangerIconWrapper]}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </View>
                                <Text style={[styles.modalOptionText, styles.modalDangerText]}>{t('deleteDictionary')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* Export Document Modal */}
            <Modal
                statusBarTranslucent={true}
                visible={shareVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCloseShare}
            >
                <Pressable style={styles.overlay} onPress={handleCloseShare}>
                    <Pressable style={styles.shareModalContainer} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.shareModalHeader}>
                            <View style={styles.shareHeaderLeft}>
                                <View style={styles.shareHeaderIconWrapper}>
                                    <Ionicons name="share-social-outline" size={20} color="#8E4A7C" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.shareModalTitle}>{t('exportDictionaryModalTitle')}</Text>
                                    <Text style={styles.shareModalSubtitle} numberOfLines={1}>{title}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleCloseShare} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name="close" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.shareModalBody}>
                            <View style={styles.shareLabelRow}>
                                <Ionicons name="document-text-outline" size={15} color="#8E4A7C" />
                                <Text style={styles.shareInputLabel}>{t('exportDocumentAs')}</Text>
                            </View>

                            <View style={{ zIndex: 5000, elevation: 5 }}>
                                <DropDownPicker
                                    open={fileTypeOpen}
                                    value={selectedFileType}
                                    items={fileTypeItems}
                                    setOpen={setFileTypeOpen}
                                    setValue={setSelectedFileType}
                                    listMode="SCROLLVIEW"
                                    scrollViewProps={{ nestedScrollEnabled: true }}
                                    style={styles.dropdownPicker}
                                    dropDownContainerStyle={styles.dropdownContainer}
                                    textStyle={styles.dropdownText}
                                    labelStyle={styles.dropdownLabel}
                                    placeholder={t('selectFileType')}
                                    zIndex={5000}
                                    zIndexInverse={1000}
                                />
                            </View>

                            <View style={[styles.selectedFormatPreview, { backgroundColor: formatColors[selectedFileType]?.bg || '#F8FAFC' }]}>
                                <View style={[styles.formatDot, { backgroundColor: formatColors[selectedFileType]?.color || '#8E4A7C' }]} />
                                <Text style={[styles.selectedFormatText, { color: formatColors[selectedFileType]?.color || '#1E293B' }]} numberOfLines={1}>
                                    {formatColors[selectedFileType]?.name || 'FILE'} • {title}{selectedFileType}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.shareModalButtons}>
                            <TouchableOpacity
                                style={styles.shareCloseButton}
                                onPress={handleCloseShare}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.shareCloseButtonText}>{t('close')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.shareSubmitButton}
                                onPress={handleShareSubmit}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="share-social" size={16} color="#FFFFFF" />
                                <Text style={styles.shareSubmitButtonText}>{t('export')}</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
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
    },
    shareModalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: '88%',
        maxWidth: 350,
        paddingVertical: 20,
        paddingHorizontal: 18,
        elevation: 12,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 24,
    },
    shareModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    shareHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    shareHeaderIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareModalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    shareModalSubtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
        fontWeight: '500',
    },
    shareModalBody: {
        paddingVertical: 16,
    },
    shareLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    shareInputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    dropdownPicker: {
        borderColor: '#E2E8F0',
        borderRadius: 14,
        backgroundColor: '#FAF6F8',
        minHeight: 46,
        paddingHorizontal: 12,
    },
    dropdownContainer: {
        borderColor: '#E2E8F0',
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        elevation: 8,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    dropdownText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    dropdownLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    formatIconBadge: {
        width: 26,
        height: 26,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    selectedFormatPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    formatDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    selectedFormatText: {
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
    },
    shareModalButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        zIndex: 1,
    },
    shareCloseButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    shareCloseButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    shareSubmitButton: {
        flex: 1.2,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: '#8E4A7C',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
        elevation: 4,
        shadowColor: '#8E4A7C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    shareSubmitButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
})