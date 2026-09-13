import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import DictDetails from "../features/dictionaries/screens/DictionaryDetailsScreen";
import CollectionDetails from "../features/dictionaries/screens/CollectionDetailsScreen";
import { DictionaryProvider } from "../contextapis/DictContext";
import GamesNavigation from "../features/games/GamesNavigator";
import ProfileNavigation from "../features/profile/ProfileNavigation";
import { useTranslation } from "react-i18next";
import { UserStatsProvider } from "../contextapis/UserStatsContext";
import { AchievementsProvider } from "../contextapis/AchievementsContext";
import NewAchievement from "../shared/components/achievementEarningModal/newAchievementModal";
import LevelUpModal from "../shared/components/LevelUpModal";
import { GameProvider } from "../contextapis/GamesContext";
import { NotificationProvider } from "../contextapis/NotificationContext";
import { useTheme } from "@/contextapis/ThemeContext";

import { View } from "react-native";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <NotificationProvider>
            <UserStatsProvider>
                <DictionaryProvider>
                    <AchievementsProvider>
                        <GameProvider>
                            <View style={{ flex: 1, backgroundColor: colors.common.background }}>
                                <Stack.Navigator
                                    screenOptions={{
                                        animation: "slide_from_right",
                                        contentStyle: {
                                            backgroundColor: colors.common.background,
                                        },
                                        headerStyle: {
                                            backgroundColor: colors.common.background,
                                        },
                                        headerTitleStyle: {
                                            fontWeight: "700",
                                            color: colors.common.textPrimary,
                                        },
                                        headerTintColor: colors.navigation.tabActive,
                                        headerShadowVisible: false,
                                    }}>
                                    <Stack.Screen
                                        name="MainTabs"
                                        component={MainTabs}
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="DictDetails"
                                        component={DictDetails}
                                        options={{ title: t("dictDetails") }}
                                    />
                                    <Stack.Screen
                                        name="CollectionDetails"
                                        component={CollectionDetails}
                                        options={{ title: t("collectionDetails") }}
                                    />
                                    <Stack.Screen
                                        name="Profile Navigation"
                                        component={ProfileNavigation}
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="Game Navigation"
                                        component={GamesNavigation}
                                        options={{ headerShown: false, animation: "slide_from_bottom" }}
                                    />
                                </Stack.Navigator>
                            </View>
                        </GameProvider>
                        <NewAchievement />
                        <LevelUpModal />
                    </AchievementsProvider>
                </DictionaryProvider>
            </UserStatsProvider>
        </NotificationProvider>
    )
}