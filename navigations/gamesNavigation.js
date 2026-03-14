import { createStackNavigator } from "@react-navigation/stack";
import GameSetupPage from "../pages/gameSetup";
import WordCompletionPage from "../pages/wcGame";
import MultipleChoiceGamePage from "../pages/mcqGame";
import MatchingPairsPage from "../pages/mpGame";
import { GameProvider } from "../contextapis/GamesContext";
import FinishGame from "../gamesLayout/gameComponents/finishGame";

const Stack = createStackNavigator();

export default function GamesNavigation(){
    return (
    <GameProvider>
        <Stack.Navigator>
            <Stack.Screen name="Game Setup" component={GameSetupPage}/>
            <Stack.Screen name="Word Completion" component={WordCompletionPage} options={{headerShown:false}}/>
            <Stack.Screen name="Multiple Choice Quiz" component={MultipleChoiceGamePage} options={{headerShown:false}}/>
            <Stack.Screen name="Matching Pairs" component={MatchingPairsPage} options={{headerShown:false}}/>
            <Stack.Screen name="Finish Game" component={FinishGame} options={{headerShown:false}}/>
        </Stack.Navigator>
    </GameProvider>
    )
}