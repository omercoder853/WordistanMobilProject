import { createStackNavigator } from "@react-navigation/stack";
import PersonalDetails from "../profileLayout/profilPages/personalDetails";
import Statistics from "../profileLayout/profilPages/statistics";
import Achievements from "../profileLayout/profilPages/achievements";
import Preferences from "../profileLayout/profilPages/preferences";
import HelpSupport from "../profileLayout/profilPages/helpSupport";
import About from "../profileLayout/profilPages/about";
import { useTranslation } from "react-i18next";


const Stack = createStackNavigator();

export default function SettingsNavigation(){
    const {t} = useTranslation();
    return (
        <Stack.Navigator>
            <Stack.Screen name="Personal Details" component={PersonalDetails} options={{title:t("personalDetails")}}/>
            <Stack.Screen name="Statistics" component={Statistics} options={{title:t("statistics")}}/>
            <Stack.Screen name="Achievements" component={Achievements} options={{title:t("achievements")}}/>
            <Stack.Screen name="Preferences" component={Preferences} options={{title:t("preferences")}}/>
            <Stack.Screen name="Help & Support" component={HelpSupport} options={{title:t("helpSupport")}}/>
            <Stack.Screen name="About Wordistan" component={About} options={{title:t("about")}}/>
        </Stack.Navigator>
    )
}