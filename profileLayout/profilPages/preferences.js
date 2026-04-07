import { View,Text,TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

export default function Preferences(){
    const {i18n} = useTranslation();
    const changeLangugae = ()=>{
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    }
    return (
        <View>
            <TouchableOpacity style={{padding:20,backgroundColor:'lightblue'}} onPress={changeLangugae}><Text>Change Language</Text></TouchableOpacity>
        </View>
    )
}