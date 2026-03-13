import { createStackNavigator } from "@react-navigation/stack";
import BottomNavbar from "./BottomNavbar";
import DictDetails from "../pages/dictDetails";
import { DictionaryProvider } from "../contextapis/DictContext";
import PersonalDetails from "../profileLayout/profilPages/personalDetails";
import GamesNavigation from "./gamesNavigation";
import SettingsNavigation from "./settingsNavigation";

const Stack = createStackNavigator();

export default function AppNavigation(){
    return (
        <DictionaryProvider>
            <Stack.Navigator>
                <Stack.Screen name="MainTabs" component={BottomNavbar} options={{headerShown:false}}/>
                <Stack.Screen name="DictDetails" component={DictDetails}/>
                <Stack.Screen name="Personal Details" component={PersonalDetails}/>
                <Stack.Screen name="Settings Navigation" component={SettingsNavigation} options={{headerShown:false}}/>
                <Stack.Screen name="Game Navigation" component={GamesNavigation} options={{headerShown:false}}/>
            </Stack.Navigator>
        </DictionaryProvider>
    )
}