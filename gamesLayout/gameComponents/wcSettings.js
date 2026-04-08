import { View,Text,Switch } from "react-native";
import styles from "../gameStyles/styles";
import { useGame } from "../../contextapis/GamesContext";
import { useTranslation } from "react-i18next";

export default function WcSettings(){
    const { t } = useTranslation();
    const {visibleFirstLetter,setVisibleFirstLetter} = useGame();
    return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={styles.optionLabel}>{t('visibleFirstLetter')}</Text>
            <Switch trackColor={{ false: "#e0e0e0", true: "#dc9f9f" }} thumbColor="#ffffff" 
            style={{marginLeft:'auto',marginTop:15}} 
            onValueChange={()=>setVisibleFirstLetter(!visibleFirstLetter)} 
            value={visibleFirstLetter}/>
        </View>
    )
}