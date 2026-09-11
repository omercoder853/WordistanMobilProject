import { createStackNavigator } from "@react-navigation/stack";
import MainTabs from "./MainTabs";
import DictDetails from "../features/dictionaries/screens/DictionaryDetailsScreen"
import CollectionDetails from "../features/dictionaries/screens/CollectionDetailsScreen";
import { DictionaryProvider } from "../contextapis/DictContext";
import GamesNavigation from "../features/games/GamesNavigator";
import ProfileNavigation from "../features/profile/ProfileNavigation"
import { useTranslation } from "react-i18next";
import { UserStatsProvider } from "../contextapis/UserStatsContext";
import { AchievementsProvider } from "../contextapis/AchievementsContext";
import NewAchievement from "../shared/components/achievementEarningModal/newAchievementModal";
import LevelUpModal from "../shared/components/LevelUpModal";
import { GameProvider } from "../contextapis/GamesContext";
import { NotificationProvider } from "../contextapis/NotificationContext";

const Stack = createStackNavigator();

export default function AppNavigation() {
    const { t } = useTranslation();
    return (
        <NotificationProvider>
            <UserStatsProvider>
                <DictionaryProvider>
                    <AchievementsProvider>
                        <GameProvider>
                            <Stack.Navigator>
                                <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
                                <Stack.Screen name="DictDetails" component={DictDetails} options={{ title: t("dictDetails") }} />
                                <Stack.Screen name="CollectionDetails" component={CollectionDetails} options={({ route }) => ({ title: route.params?.title || t("collectionDetails") })} />
                                <Stack.Screen name="Profile Navigation" component={ProfileNavigation} options={{ headerShown: false }} />
                                <Stack.Screen name="Game Navigation" component={GamesNavigation} options={{ headerShown: false }} />
                            </Stack.Navigator>
                        </GameProvider>
                        <NewAchievement />
                        <LevelUpModal />
                    </AchievementsProvider>
                </DictionaryProvider>
            </UserStatsProvider>
        </NotificationProvider>
    )
}