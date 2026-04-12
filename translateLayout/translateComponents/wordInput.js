import { useState } from "react";
import { View, TextInput, Text,TouchableOpacity } from "react-native";
import styles from "../translateStyles/transStyles";
import wordData from '../../assets/data/words.json'
import { useTranslation } from "react-i18next";

export default function InputArea({ setInput, setDisplay, input,suggestionDisplay,setSuggestionDisplay,from }) {
    const data = filterData(input) != null ? filterData(input,from) : null
    const [height,setHeight] = useState()
    const {t} = useTranslation();
    return (
        <View style={{ alignItems: 'center', zIndex: 2000 }}>
            <TextInput value={input} onChangeText={(text) => { setInput(text), text.length === 0 && setDisplay('none') , setSuggestionDisplay("flex") }}
                placeholder={t("enterWordToTranslate")}
                placeholderTextColor="#9CA3AF"
                style={styles.wordInput}
                multiline={true}
                onLayout={(event) => {const {height} = event.nativeEvent.layout;
                setHeight(height)} } />
            <View style={[styles.suggestionContainer,{top:height,display:suggestionDisplay}]}>
                {renderSuggestion(data,input,setSuggestionDisplay,Suggestion,setInput)}
            </View>
        </View>
    )
}
function Suggestion({word,setInput,setSuggestionDisplay}){
    return(
        <TouchableOpacity style={styles.suggestion} onPress={() => {setInput(word),setSuggestionDisplay("none")}}>
            <Text style={styles.suggestionText}>{word}</Text>
        </TouchableOpacity>
    )
}

function filterData(query,from) {
    if (query !== "") {
        let suggestions = new Set()
        if (from == "TR") {
            wordData.forEach(word => {
            if (suggestions.size < 4) {
                if (word.tr.toLocaleLowerCase().startsWith(query.toLowerCase())) {
                    suggestions.add(word.tr)
                }
            }
            });
        }
        else{
            wordData.forEach(word => {
            if (suggestions.size < 4) {
                if (word.en.toLocaleLowerCase().startsWith(query.toLowerCase())) {
                    suggestions.add(word.en)
                }
            }
            });
        }
        return suggestions
    }
    return null

}

function renderSuggestion(data,input,setSuggestionDisplay,Suggestion,setInput){
    if (data!=null) {
        if (data.size == 1 && [...data][0] == input.toLowerCase() ) {
            return null
        }
        else {
            return [...data].map((word,index) => (<Suggestion key={index} word={word} setSuggestionDisplay={setSuggestionDisplay} setInput={setInput}/>))
        }
    }
}
