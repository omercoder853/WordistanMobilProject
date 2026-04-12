import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import InputArea from "../translateLayout/translateComponents/wordInput";
import Direction from "../translateLayout/translateComponents/translateDirection";
import ConvertButton from "../translateLayout/translateComponents/convertButton";
import RecentWords from "../homePageLayout/HomePageComponents/lastWords";
import ResultArea from "../translateLayout/translateComponents/translateResult";
import styles from "../translateLayout/translateStyles/transStyles";
import AddDictPage from "../translateLayout/translateComponents/addToDict";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Translate = ({ recentWords, addWord }) => {
    const { t } = useTranslation();
    const [input, setInput] = useState("");
    const [display, setDisplay] = useState("none");
    const [from,setFrom] = useState("TR")
    const [result,setResult] = useState("");
    const [suggestionDisplay,setSuggestionDisplay] = useState("none")
    const [visible,setVisible] = useState(false)
    return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <TouchableWithoutFeedback style={{flex:1}} onPress={()=>setSuggestionDisplay("none")}>
                <View style={{flex:1}}>
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
                    <ResultArea display={display} result={result} setVisible={setVisible} />
                    <RecentWords recentWords={recentWords}/>
                    <AddDictPage visible={visible} input={input} result={result} setVisible={setVisible} from={from}/>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default Translate;
