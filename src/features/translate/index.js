import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import InputArea from "./components/wordInput";
import Direction from "./components/translateDirection";
import ConvertButton from "./components/ConvertButton";
import RecentWords from "../home/components/RecentWords";
import ResultArea from "./components/translateResult";
import styles from "./styles/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const Translate = ({ recentWords, addWord }) => {
    const { t } = useTranslation();
    const [input, setInput] = useState("");
    const [display, setDisplay] = useState("none");
    const [from, setFrom] = useState("TR")
    const [result, setResult] = useState("");
    const [suggestionDisplay, setSuggestionDisplay] = useState("none")

    return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => setSuggestionDisplay("none")}>
                <View style={{ flex: 1 }}>
                    <View style={styles.translateAreaContainer}>
                        <Text style={styles.translateTitle}>{t('translate')}</Text>
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
                    <ResultArea display={display} result={result} from={from} input={input} />
                    <RecentWords recentWords={recentWords} />
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default Translate;
