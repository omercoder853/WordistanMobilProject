import { TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/styles";
import wordData from '@/shared/data/words.json';
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function ConvertButton({ setDisplay, input, addWord, setResult, setSuggestionDisplay, from }) {
  const { colors } = useTheme();
  const tColors = colors.translate;
  const { t } = useTranslation();

  const showResult = () => {
    if (input != "") {
      setSuggestionDisplay("none");
      setDisplay("flex");
      const foundResult = findWord(input, from);
      if (foundResult) {
        setResult(foundResult);
        addWord(input, foundResult, from);
      }
      else {
        setResult(t('resultNotFound'));
      }
    }
  };
  return (
    <TouchableOpacity onPress={showResult} activeOpacity={0.8}>
      <LinearGradient
        colors={tColors.convertGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.convertButton, { shadowColor: tColors.convertGradient[0] }]}>
        <Text style={[styles.convertButtonText, { color: tColors.convertText }]}>{t('convert')}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function findWord(target, from) {
  if (from == "TR") {
    for (const word of wordData) {
      if (word.tr.toLowerCase() === target.toLowerCase()) {
        return word.en
      }
    }
    return null;
  }
  else {
    for (const word of wordData) {
      if (word.en.toLowerCase() === target.toLowerCase()) {
        return word.tr
      }
    }
    return null;
  }
}


