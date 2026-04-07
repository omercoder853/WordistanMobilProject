import { View, TouchableOpacity, Text } from "react-native";
import styles from "../translateStyles/transStyles";
import wordData from '../../assets/data/words.json'
import { useTranslation } from "react-i18next";

export default function ConvertButton({ setDisplay, input, addWord,setResult,setSuggestionDisplay,from }) {
  const { t } = useTranslation();
  const showResult = () => {
    if (input != "") {
      setSuggestionDisplay("none")
      setDisplay("flex");
      const foundResult = findWord(input,from)
      if (foundResult) {
        setResult(foundResult)
        addWord(input, foundResult);
      }
      else{
        setResult("Result not Found")
      }
    }
  };
  return (
    <TouchableOpacity style={styles.convertButton} onPress={showResult}>
      <Text style={{ fontWeight: "900", color: "white" }}>{t('convert')}</Text>
    </TouchableOpacity>
  );
}

function findWord(target,from){
  if (from=="TR") {
    for (const word of wordData) {
      if (word.tr.toLowerCase() === target.toLowerCase()) {
        return word.en
      }}
    return null;
  }
  else {
    for (const word of wordData) {
      if (word.en.toLowerCase() === target.toLowerCase()) {
        return word.tr
      }}
    return null;
  }
}


