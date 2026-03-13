import { View,Text} from "react-native";
import styles from "../gameStyles/styles";
import NumericInput from "./numericInput";

export default function McqSettings({options,setOptions}){
    return (
        <View>
            <Text style={styles.optionLabel}>Number of Options</Text>
            <NumericInput minValue={3} maxValue={6} value={options} setValue={setOptions} quantity={"options"}/>
        </View>
    )
}