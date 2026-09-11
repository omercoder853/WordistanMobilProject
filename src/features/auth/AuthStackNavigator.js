import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../auth/screens/LoginScreen";
import RegisterScreen from "../auth/screens/RegisterScreen";

const Stack = createStackNavigator();

export default function AuthStackNavigator(){
    return (
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
            <Stack.Screen component={LoginScreen} name="Login"/>
            <Stack.Screen component={RegisterScreen} name="Register"/>
        </Stack.Navigator>
    )
}
