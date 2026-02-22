import { useState } from "react";
import { View, TextInput, Text,TouchableOpacity } from "react-native";
import styles from "../translateStyles/transStyles";
import wordData from '../../assets/data/words.json'
export default function InputArea({ setInput, setDisplay, input,suggestionDisplay,setSuggestionDisplay }) {
    const data = filterData(input) != null ? filterData(input) : null
    const [height,setHeight] = useState()
    return (
        <View style={{ alignItems: 'center' }}>
            <TextInput value={input} onChangeText={(text) => { setInput(text), text.length === 0 && setDisplay('none') , setSuggestionDisplay("flex") }}
                placeholder="Enter a word to translate"
                style={styles.wordInput}
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
            <Text>{word}</Text>
        </TouchableOpacity>
    )
}

function filterData(query) {
    if (query !== "") {
        let suggestions = new Set()
        wordData.forEach(word => {
            if (suggestions.size < 4) {
                if (word.tr.toLocaleLowerCase().startsWith(query.toLowerCase())) {
                    suggestions.add(word.tr)
                }
            }
        });
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
