import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import SaveWordModal from "@/shared/components/SaveWordModal";
import { useDictionary } from "@/contextapis/DictContext";
import { useTheme } from "@/contextapis/ThemeContext";
import useSpeech from "@/hooks/useSpeech";

const KNOWN_WORD_TYPES = ['i', 'f', 's', 'zf', 'zm', 'ed', 'bağ', 'ünl'];

export default function ResultArea({ display, result, from }) {
    const { colors } = useTheme();
    const tColors = colors.translate;
    const [visible, setVisible] = useState(false);
    const [selectedMeaning, setSelectedMeaning] = useState("");
    const [activeSpeechText, setActiveSpeechText] = useState(null);
    const { speak, stop, isSpeaking } = useSpeech();
    const { t } = useTranslation();
    const { dicts, setDictReload } = useDictionary();
    const isValidResult = result !== null && result !== undefined && result !== "";
    const filteredDicts = (dicts || []).filter((dict) => dict.language?.slice(0, 2) === from);

    const handleSaveMeaning = (meaningText) => {
        setSelectedMeaning(meaningText);
        setDictReload(true);
        setVisible(true);
    };

    const handleSpeak = (text) => {
        if (!text) return;
        if (isSpeaking && activeSpeechText === text) {
            stop();
            setActiveSpeechText(null);
        } else {
            setActiveSpeechText(text);
            speak(text, from === 'TR' ? 'en' : 'tr');
        }
    };

    const getWordTypeLabel = (type) => {
        if (!type || typeof type !== 'string') return null;
        const cleanType = type.trim().toLowerCase();
        if (KNOWN_WORD_TYPES.includes(cleanType)) {
            return t(cleanType);
        }
        return cleanType.length <= 15 ? cleanType : null;
    };

    function renderResults() {
        const meanings = result?.meanings || [];
        const hasMultiple = meanings.length > 1;

        return (
            <View style={styles.resultsList}>
                {meanings.map((res, index) => {
                    const isLast = index === meanings.length - 1;
                    const typeLabel = getWordTypeLabel(res?.type);
                    const isCurrentSpeaking = isSpeaking && activeSpeechText === res?.meaning;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.meaningItem,
                                !isLast && [
                                    styles.meaningItemBorder,
                                    { borderBottomColor: tColors.resultItemBorder || '#F1F5F9' }
                                ]
                            ]}>
                            {hasMultiple && (
                                <View
                                    style={[
                                        styles.indexBadge,
                                        { backgroundColor: tColors.indexBadgeBg || '#F1F5F9' }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.indexBadgeText,
                                            { color: tColors.indexBadgeText || '#64748B' }
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.meaningContent}>
                                <View style={styles.meaningRow}>
                                    <Text
                                        style={[
                                            styles.meaningText,
                                            { color: tColors.resultText }
                                        ]}
                                    >
                                        {res?.meaning}
                                    </Text>
                                    {typeLabel && (
                                        <View
                                            style={[
                                                styles.typeBadge,
                                                {
                                                    backgroundColor: tColors.badgeBg,
                                                    borderColor: tColors.badgeBorder
                                                }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.typeBadgeText,
                                                    { color: tColors.badgeText }
                                                ]}
                                            >
                                                {typeLabel}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.actionsRow}>
                                <TouchableOpacity
                                    onPress={() => handleSpeak(res?.meaning)}
                                    style={[
                                        styles.actionButton,
                                        { backgroundColor: tColors.audioButtonBg }
                                    ]}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Ionicons
                                        name={isCurrentSpeaking ? "volume-high" : "volume-medium"}
                                        size={20}
                                        color={tColors.audioButtonIcon}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleSaveMeaning(res?.meaning)}
                                    style={[
                                        styles.actionButton,
                                        { backgroundColor: tColors.addToDictBg }
                                    ]}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <MaterialCommunityIcons
                                        name="book-plus-outline"
                                        size={20}
                                        color={tColors.addToDictText}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    }

    return (
        <>
            <View
                style={[
                    styles.resultContainer,
                    {
                        display: display,
                        backgroundColor: tColors.resultCardBg,
                        borderColor: tColors.resultCardBorder,
                        shadowColor: tColors.shadow,
                    }
                ]}
            >
                {isValidResult ? (
                    renderResults()
                ) : (
                    <View style={styles.notFoundContainer}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={28}
                            color={tColors.placeholder || "#94A3B8"}
                            style={{ marginBottom: 6 }}
                        />
                        <Text style={[styles.notFoundText, { color: tColors.resultText }]}>
                            {t('resultNotFound')}
                        </Text>
                    </View>
                )}
            </View>

            <SaveWordModal
                setModalVisible={setVisible}
                modalVisible={visible}
                filteredDicts={filteredDicts}
                word={result?.word}
                meaning={selectedMeaning || result?.meanings?.[0]?.meaning}
            />
        </>
    );
}