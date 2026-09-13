import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";
import wordData from '@/shared/data/words.json';
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function InputArea({ setInput, setDisplay, input, suggestionDisplay, setSuggestionDisplay, from }) {
    const { colors } = useTheme();
    const tColors = colors.translate;
    const data = filterData(input) != null ? filterData(input, from) : null;
    const [height, setHeight] = useState();
    const { t } = useTranslation();

    return (
        <View style={{ alignItems: 'center', zIndex: 2000, width: '100%' }}>
            <TextInput
                value={input}
                onChangeText={(text) => { setInput(text); text.length === 0 && setDisplay('none'); setSuggestionDisplay("flex"); }}
                placeholder={t("enterWordToTranslate")}
                placeholderTextColor={tColors.placeholder}
                style={[
                    styles.wordInput,
                    {
                        backgroundColor: tColors.inputBg,
                        borderColor: tColors.inputBorder,
                        color: tColors.inputText,
                        shadowColor: tColors.shadow,
                    }
                ]}
                multiline={true}
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setHeight(height);
                }}
            />
            <View style={[
                styles.suggestionContainer,
                {
                    top: height,
                    display: suggestionDisplay,
                    backgroundColor: tColors.suggestionBg,
                    shadowColor: tColors.shadow,
                }
            ]}>
                {renderSuggestion(data, input, setSuggestionDisplay, Suggestion, setInput, tColors)}
            </View>
        </View>
    );
}

function Suggestion({ word, setInput, setSuggestionDisplay, tColors }) {
    return (
        <TouchableOpacity style={styles.suggestion} onPress={() => { setInput(word); setSuggestionDisplay("none"); }}>
            <Text style={[styles.suggestionText, { color: tColors?.suggestionText || '#1E293B' }]}>{word}</Text>
        </TouchableOpacity>
    );
}

function filterData(query, from) {
    if (query !== "") {
        let suggestions = new Set();
        if (from == "TR") {
            wordData.forEach(word => {
                if (suggestions.size < 4) {
                    if (word.tr.toLocaleLowerCase().startsWith(query.toLowerCase())) {
                        suggestions.add(word.tr);
                    }
                }
            });
        }
        else {
            wordData.forEach(word => {
                if (suggestions.size < 4) {
                    if (word.en.toLocaleLowerCase().startsWith(query.toLowerCase())) {
                        suggestions.add(word.en);
                    }
                }
            });
        }
        return suggestions;
    }
    return null;
}

function renderSuggestion(data, input, setSuggestionDisplay, SuggestionComponent, setInput, tColors) {
    if (data != null) {
        if (data.size == 1 && [...data][0] == input.toLowerCase()) {
            return null;
        }
        else {
            return [...data].map((word, index) => (
                <SuggestionComponent
                    key={index}
                    word={word}
                    setSuggestionDisplay={setSuggestionDisplay}
                    setInput={setInput}
                    tColors={tColors}
                />
            ));
        }
    }
}
