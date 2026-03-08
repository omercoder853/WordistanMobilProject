import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import InputArea from "../translateLayout/translateComponents/wordInput";
import Direction from "../translateLayout/translateComponents/translateDirection";
import ConvertButton from "../translateLayout/translateComponents/convertButton";
import RecentWords from "../homePageLayout/HomePageComponents/lastWords";
import ResultArea from "../translateLayout/translateComponents/translateResult";
import styles from "../translateLayout/translateStyles/transStyles";
import AddDictPage from "../translateLayout/translateComponents/addToDict";
import { useState } from "react";
const Translate = ({ recentWords, addWord }) => {
    const [input, setInput] = useState("");
    const [display, setDisplay] = useState("none");
    const [from,setFrom] = useState("TR")
    const [result,setResult] = useState("");
    const [suggestionDisplay,setSuggestionDisplay] = useState("none")
    const [visible,setVisible] = useState(false)
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
                    setSuggestionDisplay={setSuggestionDisplay} 
                    from={from} />
                <Direction setDisplay={setDisplay} from={from} setFrom={setFrom} />
                <ConvertButton
                    setDisplay={setDisplay}
                    input={input}
                    addWord={addWord} 
                    setResult={setResult}
                    result={result}
                    setSuggestionDisplay={setSuggestionDisplay}
                    from={from} />
            </View>
            <ResultArea display={display} result={result} setVisible={setVisible} />
            <RecentWords recentWords={recentWords}/>
            <AddDictPage visible={visible} input={input} result={result} setVisible={setVisible} from={from}/>
        </ScrollView>
    );
};

export default Translate;
