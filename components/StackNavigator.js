import { createStackNavigator } from "@react-navigation/stack";
import BottomNavbar from "./BottomNavbar";
const Stack = createStackNavigator();
import DictDetails from "../pages/dictDetails";
import { DictionaryProvider } from "../contextapis/DictContext";

export default function AppNavigation(){
    return (
        <DictionaryProvider>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="MainTabs" component={BottomNavbar}/>
                <Stack.Screen name="DictDetails" component={DictDetails}/>
            </Stack.Navigator>
        </DictionaryProvider>
    )
}