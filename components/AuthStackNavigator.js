import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";

const Stack = createStackNavigator();

export default function AuthStackNavigator(){
    return (
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
            <Stack.Screen component={LoginPage} name="Login"/>
            <Stack.Screen component={RegisterPage} name="Register"/>
        </Stack.Navigator>
    )
}
