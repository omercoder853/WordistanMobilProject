import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import InputArea from "./components/wordInput";
import Direction from "./components/translateDirection";
import ConvertButton from "./components/ConvertButton";
import RecentWords from "../home/components/RecentWords";
import ResultArea from "./components/translateResult";
import styles from "./styles/styles";
import { useState,useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

const Translate = ({ recentWords, addWord }) => {
    const { colors } = useTheme();
    const tColors = colors.translate;
    const { t } = useTranslation();
    const [input, setInput] = useState("");
    const [display, setDisplay] = useState("none");
    const [from, setFrom] = useState("TR");
    const [result, setResult] = useState("");
    const [suggestionDisplay, setSuggestionDisplay] = useState("none");
    const inputRef = useRef("");

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.common.background }}
            contentContainerStyle={{ paddingBottom: 36 }}
            showsVerticalScrollIndicator={false}
        >
            <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => setSuggestionDisplay("none")}>
                <View style={{ flex: 1 }}>
                    <View style={styles.translateAreaContainer}>
                        <Text style={[styles.translateTitle, { color: tColors.title }]}>{t('translate')}</Text>
                        <InputArea
                            setInput={setInput}
                            setDisplay={setDisplay}
                            input={input}
                            suggestionDisplay={suggestionDisplay}
                            setSuggestionDisplay={setSuggestionDisplay}
                            from={from}
                        />
                        <Direction setDisplay={setDisplay} from={from} setFrom={setFrom} inputRef={inputRef} />
                        <ConvertButton
                            setDisplay={setDisplay}
                            inputRef={inputRef}
                            input={input}
                            addWord={addWord}
                            setResult={setResult}
                            result={result}
                            setSuggestionDisplay={setSuggestionDisplay}
                            from={from}
                        />
                    </View>
                    <ResultArea display={display} result={result} from={from}/>
                    <RecentWords recentWords={recentWords} />
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default Translate;
