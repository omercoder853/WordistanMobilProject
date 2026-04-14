import { createStackNavigator } from "@react-navigation/stack";
import BottomNavbar from "./BottomNavbar";
import DictDetails from "../pages/dictDetails";
import CollectionDetails from "../pages/collectionDetails";
import { DictionaryProvider } from "../contextapis/DictContext";
import GamesNavigation from "./gamesNavigation";
import SettingsNavigation from "./settingsNavigation";
import { useTranslation } from "react-i18next";
import { UserStatsProvider } from "../contextapis/UserStatsContext";

const Stack = createStackNavigator();

export default function AppNavigation(){
    const {t} = useTranslation();
    return (
        <UserStatsProvider>
            <DictionaryProvider>
                <Stack.Navigator>
                    <Stack.Screen name="MainTabs" component={BottomNavbar} options={{headerShown:false}}/>
                    <Stack.Screen name="DictDetails" component={DictDetails} options={{title:t("dictDetails")}} />
                    <Stack.Screen name="CollectionDetails" component={CollectionDetails} options={({ route }) => ({ title: route.params?.title || t("collectionDetails") })} />
                    <Stack.Screen name="Settings Navigation" component={SettingsNavigation} options={{headerShown:false}}/>
                    <Stack.Screen name="Game Navigation" component={GamesNavigation} options={{headerShown:false}}/>
                </Stack.Navigator>
            </DictionaryProvider>
        </UserStatsProvider>
    )
}