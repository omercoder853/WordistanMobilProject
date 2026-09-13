import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import SaveWordModal from "@/shared/components/SaveWordModal";
import { useDictionary } from "@/contextapis/DictContext";
import { useTheme } from "@/contextapis/ThemeContext";

export default function ResultArea({ display, input, result, from }) {
    const { colors } = useTheme();
    const tColors = colors.translate;
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const { dicts, setDictReload } = useDictionary();
    const isValidResult = result !== "Result not Found" && result !== t('resultNotFound');
    const filteredDicts = (dicts || []).filter((dict) => dict.language.slice(0, 2) == from);

    const handleOpenModal = () => {
        setDictReload(true);
        setVisible(true);
    };

    return (
        <>
            <View style={[
                styles.resultContainer,
                {
                    display: display,
                    backgroundColor: tColors.resultCardBg,
                    borderColor: tColors.resultCardBorder,
                    shadowColor: tColors.shadow,
                }
            ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: tColors.resultText }}>{result}</Text>
                    {isValidResult && (
                        <TouchableOpacity style={{ marginLeft: 'auto', backgroundColor: tColors.audioButtonBg, padding: 8, borderRadius: 20 }}>
                            <Ionicons name="volume-medium" size={24} color={tColors.audioButtonIcon} />
                        </TouchableOpacity>)}
                </View>
                {isValidResult && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ color: tColors.placeholder, fontSize: 16, fontStyle: 'italic', flex: 1 }}>[rezolt]</Text>
                        <TouchableOpacity
                            onPress={handleOpenModal}
                            style={[styles.addMyDictButton, { backgroundColor: tColors.addToDictBg }]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="add-circle" size={20} color={tColors.addToDictText} />
                            <Text style={[styles.addMyDictButtonText, { color: tColors.addToDictText }]}>{t('addToDict')}</Text>
                        </TouchableOpacity>
                    </View>)}
            </View>
            <SaveWordModal setModalVisible={setVisible} modalVisible={visible} filteredDicts={filteredDicts} word={input} meaning={result} />
        </>
    );
}