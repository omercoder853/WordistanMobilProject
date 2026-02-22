import { View, TouchableOpacity, Text } from "react-native";
import styles from "../translateStyles/transStyles";
import wordData from '../../assets/data/words.json'

export default function ConvertButton({ setDisplay, input, addWord,setResult,setSuggestionDisplay }) {
  const showResult = () => {
    if (input != "") {
      setSuggestionDisplay("none")
      setDisplay("flex");
      const foundResult = findWord(input,setResult)
      console.log(foundResult)
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
      <Text style={{ fontWeight: "900", color: "white" }}>Convert</Text>
    </TouchableOpacity>
  );
}

function findWord(target){
  for (const word of wordData) {
    if (word.tr.toLowerCase() === target.toLowerCase()) {
      return word.en
    }
  }
  return null;
}


