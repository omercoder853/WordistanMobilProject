import { createStackNavigator } from "@react-navigation/stack";
import Step1Personal from "../components/Step1Personal";
import Step2Preferences from "../components/Step2Preferences";
import Step3Account from "../components/Step3Account";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator();
export default function RegisterScreen(){
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
            <Stack.Navigator initialRouteName="Personal Info" screenOptions={{headerShown:false}}>
                <Stack.Screen component={Step1Personal} name="Personal Info"/>
                <Stack.Screen component={Step2Preferences} name="Preferences"/>
                <Stack.Screen component={Step3Account} name="Entry Info"/>
            </Stack.Navigator>
        </SafeAreaView>
    )
}