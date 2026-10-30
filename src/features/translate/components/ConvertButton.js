import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/styles";
import wordData from '@/shared/data/words_data.json';
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";
import { useState } from "react";

export default function ConvertButton({ setDisplay, inputRef, input, addWord, setResult, setSuggestionDisplay, from }) {
  const { colors } = useTheme();
  const tColors = colors.translate;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const showResult = async () => {
    if (input != "" && inputRef.current !== input) {
      setLoading(true);
      await new Promise(resolve => requestAnimationFrame(resolve));
      inputRef.current = input
      setSuggestionDisplay("none");
      setDisplay("flex");
      const foundResult = findWord(input, from);
      if (foundResult) {
        setResult(foundResult);
        addWord(foundResult.word, foundResult.meanings[0].meaning, from);
      }
      else {
        setResult(null);
      }
    }
    console.log(loading)
    setLoading(false);
  };
  return (
    <TouchableOpacity disabled={loading || inputRef.current==input} onPress={showResult} activeOpacity={0.8}>
      <LinearGradient
        colors={tColors.convertGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.convertButton, { shadowColor: tColors.convertGradient[0] }]}>
        {loading ? (<ActivityIndicator color="#ffff" />) : (
          <Text style={[styles.convertButtonText, { color: tColors.convertText }]}>{t('convert')}</Text>)}
      </LinearGradient>
    </TouchableOpacity>
  );
}

function findWord(target, from) {
  if (from == "TR") {
    const lowerTarget = target.toLocaleLowerCase('tr-TR');
    let meanings = [];
    for (const obj of wordData) {
      if (obj.meaning1.toLocaleLowerCase('tr-TR') === lowerTarget) {
        meanings.push({ "meaning": obj.word, "type": obj.typemeaning1 })
      }
      else if (obj.meaning2.toLocaleLowerCase('tr-TR') === lowerTarget) {
        meanings.push({ "meaning": obj.word, "type": obj.typemeaning2 })
      }
      else if (obj.meaning3.toLocaleLowerCase('tr-TR') === lowerTarget) {
        meanings.push({ "meaning": obj.word, "type": obj.typemeaning3 })
      }
    }
    if (meanings.length > 0) {
      return {
        "word": target,
        "meanings": meanings
      }
    }
    return null
  }

  else {
    for (const obj of wordData) {
      if (obj.word.toLocaleLowerCase('tr-TR') === target.toLocaleLowerCase('tr-TR')) {
        let meanings = [];
        meanings.push({ "meaning": obj.meaning1, "type": obj.typemeaning1 });
        if (obj.meaning2 !== "") meanings.push({ "meaning": obj.meaning2, "type": obj.typemeaning2 });
        if (obj.meaning3 !== "") meanings.push({ "meaning": obj.meaning3, "type": obj.typemeaning3 });
        return {
          "word": obj.word,
          "meanings": meanings
        }
      }
    }
    return null;
  }
}


