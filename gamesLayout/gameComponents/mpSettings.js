import { View,Text} from "react-native";
import styles from "../gameStyles/styles";
import NumericInput from "./numericInput";

export default function MpSettings({perPage,setPerPage}){
    return (
        <View>
            <Text style={styles.optionLabel}>Questions per Page</Text>
            <NumericInput minValue={3} maxValue={5} value={perPage} setValue={setPerPage} quantity={"questions per page"}/>
        </View>
    )
}