import { ScrollView } from "react-native";
import ConsoleButton from "./profileConsoleButton";
import { useTranslation } from "react-i18next";

export default function ProfileConsole({setAlertVisible}){
    const { t } = useTranslation();
    const consoleItems = [
      { name: "Personal Details", label: t('personalDetails'), icon: "person-outline" },
      { name: "Statistics", label: t('statistics'), icon: "stats-chart-outline" },
      { name: "Achievements", label: t('achievements'), icon: "trophy-outline" },
      { name: "Preferences", label: t('preferences'), icon: "options-outline" },
      { name: "Help & Support", label: t('helpSupport'), icon: "help-circle-outline" },
      { name: "About Wordistan", label: t('about'), icon: "information-circle-outline" },
      { name: "Logout", label: t('exit'), icon: "log-out-outline" },
    ];

    return (
        <ScrollView style={{flex:1,width:'90%'}} showsVerticalScrollIndicator={false} 
        contentContainerStyle={{paddingBottom:20}}>
            {consoleItems.map((item,index) => (<ConsoleButton key={index} item={item} setAlertVisible={setAlertVisible}/>))}
        </ScrollView>
    )
}