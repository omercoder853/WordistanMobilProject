import { createStackNavigator } from "@react-navigation/stack";
import BottomNavbar from "./BottomNavbar";
import DictDetails from "../pages/dictDetails";
import { DictionaryProvider } from "../contextapis/DictContext";
import PersonalDetails from "../profileLayout/profilPages/personalDetails";
import Statistics from "../profileLayout/profilPages/statistics";
import Achievements from "../profileLayout/profilPages/achievements";
import Preferences from "../profileLayout/profilPages/preferences";
import HelpSupport from "../profileLayout/profilPages/helpSupport";
import About from "../profileLayout/profilPages/about";

const Stack = createStackNavigator();

export default function AppNavigation(){
    return (
        <DictionaryProvider>
            <Stack.Navigator>
                <Stack.Screen name="MainTabs" component={BottomNavbar} options={{headerShown:false}}/>
                <Stack.Screen name="DictDetails" component={DictDetails}/>
                <Stack.Screen name="Personal Details" component={PersonalDetails}/>
                <Stack.Screen name="Statistics" component={Statistics}/>
                <Stack.Screen name="Achievements" component={Achievements}/>
                <Stack.Screen name="Preferences" component={Preferences}/>
                <Stack.Screen name="Help & Support" component={HelpSupport}/>
                <Stack.Screen name="About Wordistan" component={About}/>
            </Stack.Navigator>
        </DictionaryProvider>
    )
}