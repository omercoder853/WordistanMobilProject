import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import InputArea from "../translateLayout/translateComponents/wordInput";
import Direction from "../translateLayout/translateComponents/translateDirection";
import ConvertButton from "../translateLayout/translateComponents/convertButton";
import RecentWords from "../homePageLayout/HomePageComponents/lastWords";
import ResultArea from "../translateLayout/translateComponents/translateResult";
import styles from "../translateLayout/translateStyles/transStyles";
import { useState } from "react";
const Translate = ({ recentWords, addWord }) => {
    const [input, setInput] = useState("");
    const [display, setDisplay] = useState("none");
    const [result,setResult] = useState("");
    const [suggestionDisplay,setSuggestionDisplay] = useState("none")
    return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View
                style={{
                    flex: 1,
                    width: "90%",
                    alignSelf: "center",
                    gap: 7,
                    marginTop: 20,}}>
                <Text style={styles.translateTitle}>Translate</Text>
                <InputArea 
                    setInput={setInput} 
                    setDisplay={setDisplay} input={input} 
                    suggestionDisplay={suggestionDisplay} 
                    setSuggestionDisplay={setSuggestionDisplay} />
                <Direction setDisplay={setDisplay} />
                <ConvertButton
                    setDisplay={setDisplay}
                    input={input}
                    addWord={addWord} 
                    setResult={setResult}
                    result={result}
                    setSuggestionDisplay={setSuggestionDisplay}/>
            </View>
            <ResultArea display={display} result={result} />
            <RecentWords recentWords={recentWords}/>
        </ScrollView>
    );
};

export default Translate;
