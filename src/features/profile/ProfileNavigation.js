import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PersonalDetails from "./screens/PersonalDetailsScreen";
import Statistics from "./screens/StatisticsScreen";
import Achievements from "./screens/AchievementsScreen";
import Preferences from "./screens/PreferencesScreen";
import HelpSupport from "./screens/HelpSupportScreen";
import About from "./screens/AboutScreen";
import GameSessions from "./screens/GameSessionsScreen";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();

export default function ProfileNavigation() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator
            screenOptions={{
                // Profil navigasyonu: tüm ekranlar sağdan kayar
                animation: "slide_from_right",
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
                name="Personal Details"
                component={PersonalDetails}
                options={{ title: t("personalDetails") }}
            />
            <Stack.Screen
                name="Statistics"
                component={Statistics}
                options={{ title: t("statistics") }}
            />
            <Stack.Screen
                name="Game Sessions"
                component={GameSessions}
                options={{ title: t("gameSessions") }}
            />
            <Stack.Screen
                name="Achievements"
                component={Achievements}
                options={{ title: t("achievements") }}
            />
            <Stack.Screen
                name="Preferences"
                component={Preferences}
                options={{ title: t("preferences") }}
            />
            <Stack.Screen
                name="Help & Support"
                component={HelpSupport}
                options={{ title: t("helpSupport") }}
            />
            <Stack.Screen
                name="About Wordistan"
                component={About}
                options={{ title: t("about") }}
            />
        </Stack.Navigator>
    )
}
