import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const { t } = useTranslation();
    return (
        <NotificationProvider>
            <UserStatsProvider>
                <DictionaryProvider>
                    <AchievementsProvider>
                        <GameProvider>
                            <Stack.Navigator
                                screenOptions={{
                                    // Kök navigator: modali andıran yukarı kayma
                                    animation: "slide_from_bottom",
                                    headerStyle: {
                                        backgroundColor: "#F5F3FF",
                                    },
                                    headerTitleStyle: {
                                        fontWeight: "700",
                                        color: "#1F2937",
                                    },
                                    headerTintColor: "#5B3FD3",
                                    headerShadowVisible: false,
                                }}
                            >
                                <Stack.Screen
                                    name="MainTabs"
                                    component={MainTabs}
                                    options={{ headerShown: false, animation: "none" }}
                                />
                                <Stack.Screen
                                    name="DictDetails"
                                    component={DictDetails}
                                    options={{ title: t("dictDetails"), animation: "slide_from_right" }}
                                />
                                <Stack.Screen
                                    name="CollectionDetails"
                                    component={CollectionDetails}
                                    options={({ route }) => ({
                                        title: route.params?.title || t("collectionDetails"),
                                        animation: "slide_from_right",
                                    })}
                                />
                                <Stack.Screen
                                    name="Profile Navigation"
                                    component={ProfileNavigation}
                                    options={{ headerShown: false, animation: "slide_from_right" }}
                                />
                                <Stack.Screen
                                    name="Game Navigation"
                                    component={GamesNavigation}
                                    options={{ headerShown: false, animation: "slide_from_bottom" }}
                                />
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