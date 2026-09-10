import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useDictionary } from "../../contextapis/DictContext";
import { useTranslation } from "react-i18next";
import { useFeedback } from "../../contextapis/FeedbackContext";

export default function Word({ word, index,setReload}) {
    const { t } = useTranslation();
    const { deleteWord,setDictReload } = useDictionary();

    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible,setAlertLoading,hideAlert } = useFeedback();

    const handleTrashPress = () => {
        setAlertTitle(t("warning"));
        setAlertMessage(t("wordDeleteWarning" , {word:word.word}));
        addAlertButton({text:t("cancel"),style:"cancel",action:()=>{hideAlert()}});
        addAlertButton({text:t("delete"),style:"danger",action:()=>handleDelete() , needLoading:true});
        setAlertVisible(true);
    }


    const handleDelete = async () => {
        setAlertLoading(true);
        const ok = await deleteWord(word.id);
        if (ok) {setDictReload(true),setReload(true)};
        setAlertLoading(false);
        hideAlert();
    }
    return (
            <View style={styles.wordRow}>
                <View style={styles.wordId}>
                    <Text style={styles.wordIdText}>{index + 1}</Text>
                </View>
                <View style={styles.wordContentWrapper}>
                    <Text style={styles.wordTarget}>{word.word}</Text>
                    <Text style={styles.wordMeaning}>{word.meaning}</Text>
                </View>
                <View style={styles.deleteButtonContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleTrashPress}>
                        <Feather name="trash-2" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
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