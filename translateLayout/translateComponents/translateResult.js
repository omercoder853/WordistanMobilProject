import { View, Text, TouchableOpacity } from "react-native";
import styles from "../translateStyles/transStyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import SaveWordModal from "../../dictionariesLayout/DictionariesComponents/SaveWordModal";
import { useDictionary } from "../../contextapis/DictContext";

export default function ResultArea({ display, input, result, from }) {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const { dicts, setDictReload } = useDictionary();
    const isValidResult = result !== "Result not Found";
    const filteredDicts = (dicts || []).filter((dict) => dict.language.slice(0, 2) == from);

    const handleOpenModal = () => {
        setDictReload(true);
        setVisible(true);
    };

    return (
        <>
        <View style={[styles.resultContainer, { display: display }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '900', color: '#1F2937' }}>{result}</Text>
                {isValidResult && (
                    <TouchableOpacity style={{ marginLeft: 'auto', backgroundColor: '#F3F4F6', padding: 8, borderRadius: 20 }}>
                        <Ionicons name="volume-medium" size={24} color="#4F46E5" />
                    </TouchableOpacity>)}
            </View>
            {isValidResult && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 16, fontStyle: 'italic', flex: 1 }}>[rezolt]</Text>
                    <TouchableOpacity onPress={handleOpenModal} style={styles.addMyDictButton} activeOpacity={0.7}>
                        <Ionicons name="add-circle" size={20} color="#4F46E5" />
                        <Text style={styles.addMyDictButtonText}>{t('addToDict')}</Text>
                    </TouchableOpacity>
                </View>)}
        </View>
        <SaveWordModal setModalVisible={setVisible} modalVisible={visible} filteredDicts={filteredDicts} word={input} meaning={result} />
        </>
    )
}