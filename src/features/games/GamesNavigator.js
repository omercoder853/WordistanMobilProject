import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameSetupPage from "./screens/GameSetup";
import WordCompletionPage from "./screens/WordCompletionScreen";
import MultipleChoiceGamePage from "./screens/MultipleChoiceScreen";
import MatchingPairsPage from "./screens/MatchingPairsScreen";
import FinishGame from "./screens/GameResultsScreen";

const Stack = createNativeStackNavigator();

export default function GamesNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
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
    )
}