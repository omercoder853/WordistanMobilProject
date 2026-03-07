import { View,ScrollView } from "react-native";
import ConsoleButton from "./profileConsoleButton";

const consoleItems = [
  { name: "Personal Details", icon: "person-outline" },
  { name: "Statistics", icon: "stats-chart-outline" },
  { name: "Achievements", icon: "trophy-outline" },
  { name: "Preferences", icon: "options-outline" },
  { name: "Help & Support", icon: "help-circle-outline" },
  { name: "About Wordistan", icon: "information-circle-outline" },
  { name: "Logout", icon: "log-out-outline" },
];

export default function ProfileConsole({setAlertVisible}){
    return (
        <ScrollView style={{flex:1,width:'90%'}} showsVerticalScrollIndicator={false} 
        contentContainerStyle={{paddingBottom:20}}>
            {consoleItems.map((item,index) => (<ConsoleButton key={index} item={item} setAlertVisible={setAlertVisible}/>))}
        </ScrollView>
    )
}