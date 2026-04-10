import { createStackNavigator } from "@react-navigation/stack";
import BottomNavbar from "./BottomNavbar";
import DictDetails from "../pages/dictDetails";
import { DictionaryProvider } from "../contextapis/DictContext";
import GamesNavigation from "./gamesNavigation";
import SettingsNavigation from "./settingsNavigation";
import { useTranslation } from "react-i18next";

const Stack = createStackNavigator();

export default function AppNavigation(){
    const {t} = useTranslation();
    return (
        <DictionaryProvider>
            <Stack.Navigator>
                <Stack.Screen name="MainTabs" component={BottomNavbar} options={{headerShown:false}}/>
                <Stack.Screen name="DictDetails" component={DictDetails} options={{title:t("dictDetails")}} />
                <Stack.Screen name="Settings Navigation" component={SettingsNavigation} options={{headerShown:false}}/>
                <Stack.Screen name="Game Navigation" component={GamesNavigation} options={{headerShown:false}}/>
            </Stack.Navigator>
        </DictionaryProvider>
    )
}