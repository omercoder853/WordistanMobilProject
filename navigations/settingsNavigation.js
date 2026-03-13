import { createStackNavigator } from "@react-navigation/stack";
import PersonalDetails from "../profileLayout/profilPages/personalDetails";
import Statistics from "../profileLayout/profilPages/statistics";
import Achievements from "../profileLayout/profilPages/achievements";
import Preferences from "../profileLayout/profilPages/preferences";
import HelpSupport from "../profileLayout/profilPages/helpSupport";
import About from "../profileLayout/profilPages/about";


const Stack = createStackNavigator();

export default function SettingsNavigation(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="Statistics" component={Statistics}/>
            <Stack.Screen name="Achievements" component={Achievements}/>
            <Stack.Screen name="Preferences" component={Preferences}/>
            <Stack.Screen name="Help & Support" component={HelpSupport}/>
            <Stack.Screen name="About Wordistan" component={About}/>
        </Stack.Navigator>
    )
}