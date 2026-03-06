import { createStackNavigator } from "@react-navigation/stack";
import PersonalInfoPage from "../registerLayout/registerComponents/personalInfo";
import PreferencesPage from "../registerLayout/registerComponents/preferences";
import EntryInfoPage from "../registerLayout/registerComponents/entryInfo";

const Stack = createStackNavigator();
export default function RegisterPage(){
    return (
        <Stack.Navigator initialRouteName="Personal Info" screenOptions={{headerShown:false}}>
            <Stack.Screen component={PersonalInfoPage} name="Personal Info"/>
            <Stack.Screen component={PreferencesPage} name="Preferences"/>
            <Stack.Screen component={EntryInfoPage} name="Entry Info"/>
        </Stack.Navigator>
    )
}