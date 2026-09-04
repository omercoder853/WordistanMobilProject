import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useDictionary } from "../../contextapis/DictContext";
import CustomAlert from "../../commonComponents/customAlert/customAlert";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Word({ word, index,setReload}) {
    const { t } = useTranslation();
    const [alertVisible, setAlertVisible] = useState(false)
    const [successVisible,setSuccessVisible] = useState(false)
    const [errVisible , setErrVisible] = useState(false)
    const { deleteWord,setDictReload } = useDictionary();

    const handleDelete = async () => {
        const res = await deleteWord(word.id)
        if (res.success) {
            setAlertVisible(false)
            setSuccessVisible(true)
        }
        else {
            setAlertVisible(false)
            setErrVisible(true)
        }
    }
    return (
        <>
            <View style={styles.wordRow}>
                <View style={styles.wordId}>
                    <Text style={styles.wordIdText}>{index + 1}</Text>
                </View>
                <View style={styles.wordContentWrapper}>
                    <Text style={styles.wordTarget}>{word.word}</Text>
                    <Text style={styles.wordMeaning}>{word.meaning}</Text>
                </View>
                <View style={styles.deleteButtonContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={()=>setAlertVisible(true)}>
                        <Feather name="trash-2" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
            <CustomAlert visible={alertVisible}
                title={t('warning')}
                message={t('wordDeleteWarning' , {word:word.word})}
                buttons={[{ text: t('cancel'), style: "cancel", action: () => setAlertVisible(false) },
                { text: t('delete'), style: "danger", action: () => handleDelete() }]} />
            <CustomAlert visible={successVisible}
            title={t('operationSuccessful')} 
            message={t('wordDeletedSuccessfully')}
            buttons={[{text:t('cancel') , style:"success" , action:()=>{setSuccessVisible(false),setReload(true),setDictReload(true)}}]}/>
            <CustomAlert visible={errVisible}
            title={t('ooops')}
            message={t('wordDeletingError')}
            buttons={[{text:t('cancel') , style:"cancel" , action:()=>setErrVisible(false)}]}/>
        </>

    )
}

const styles = StyleSheet.create({
    wordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#c566e9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f5e4fb',
    },
    wordTarget: {
        fontWeight: '800',
        fontSize: 16,
        color: '#4B2A63',
        marginBottom: 4,
    },
    wordMeaning: {
        fontWeight: '500',
        fontSize: 14,
        color: '#8e4a7c',
    },
    wordId: {
        minWidth: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#F7EEFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        paddingHorizontal: 5,
    },
    wordIdText: {
        color: '#A020F0',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    wordContentWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    deleteButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
})

const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";