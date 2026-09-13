import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import PersonalDetails from "./screens/PersonalDetailsScreen";
import Statistics from "./screens/StatisticsScreen";
import Achievements from "./screens/AchievementsScreen";
import Preferences from "./screens/PreferencesScreen";
import HelpSupport from "./screens/HelpSupportScreen";
import About from "./screens/AboutScreen";
import GameSessions from "./screens/GameSessionsScreen";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

const Stack = createNativeStackNavigator();

export default function ProfileNavigation() {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.common.background }}>
            <Stack.Navigator
                screenOptions={{
                    // Profil navigasyonu: tüm ekranlar sağdan kayar
                    animation: "slide_from_right",
                    headerStyle: {
                        backgroundColor: colors.common.background,
                    },
                    headerTitleStyle: {
                        fontWeight: "700",
                        color: colors.profile.textPrimary,
                    },
                    headerTintColor: colors.common.primary,
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: colors.common.background,
                    },
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
        </View>
    )
}
