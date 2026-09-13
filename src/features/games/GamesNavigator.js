import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import GameSetupPage from "./screens/GameSetup";
import WordCompletionPage from "./screens/WordCompletionScreen";
import MultipleChoiceGamePage from "./screens/MultipleChoiceScreen";
import MatchingPairsPage from "./screens/MatchingPairsScreen";
import FinishGame from "./screens/GameResultsScreen";
import { useTheme } from "@/contextapis/ThemeContext";

const Stack = createNativeStackNavigator();

export default function GamesNavigation() {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.common.background }}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.common.background,
                    },
                    headerTitleStyle: {
                        fontWeight: "700",
                        color: colors.common.textPrimary,
                    },
                    headerTintColor: colors.common.primary,
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: colors.common.background,
                    },
                }}
            >
                {/* Oyun kurulum: sağdan gelir (standart ilerleme) */}
                <Stack.Screen
                    name="Game Setup"
                    component={GameSetupPage}
                    options={{ animation: "slide_from_right" }}
                />
                {/* Oyun ekranları: alttan açılır — tam ekran immersive his */}
                <Stack.Screen
                    name="Word Completion"
                    component={WordCompletionPage}
                    options={{ headerShown: false, animation: "slide_from_bottom" }}
                />
                <Stack.Screen
                    name="Multiple Choice Quiz"
                    component={MultipleChoiceGamePage}
                    options={{ headerShown: false, animation: "slide_from_bottom" }}
                />
                <Stack.Screen
                    name="Matching Pairs"
                    component={MatchingPairsPage}
                    options={{ headerShown: false, animation: "slide_from_bottom" }}
                />
                {/* Sonuç ekranı: fade — oyun bitti hissi */}
                <Stack.Screen
                    name="Finish Game"
                    component={FinishGame}
                    options={{ headerShown: false, animation: "fade" }}
                />
            </Stack.Navigator>
        </View>
    )
}