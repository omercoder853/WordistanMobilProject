import { View,Text} from "react-native";
import styles from "../gameStyles/styles";
import NumericInput from "./numericInput";
import { useGame } from "../../contextapis/GamesContext";
import { useTranslation } from "react-i18next";

export default function McqSettings(){
    const { t } = useTranslation();
    const {numberOptions,setnumberOptions} = useGame();
    return (
        <View>
            <Text style={styles.optionLabel}>{t('numberOfOptions')}</Text>
            <NumericInput minValue={3} maxValue={6} value={numberOptions} setValue={setnumberOptions} quantity={"options"}/>
        </View>
    )
}