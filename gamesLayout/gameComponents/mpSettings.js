import { View,Text} from "react-native";
import styles from "../gameStyles/styles";
import NumericInput from "./numericInput";
import { useGame } from "../../contextapis/GamesContext";
import { useTranslation } from "react-i18next";

export default function MpSettings(){
    const { t } = useTranslation();
    const {perPage,setPerPage} = useGame();
    return (
        <View>
            <Text style={styles.optionLabel}>{t('questionsPerPage')}</Text>
            <NumericInput minValue={3} maxValue={5} value={perPage} setValue={setPerPage} quantity={"questions per page"}/>
        </View>
    )
}