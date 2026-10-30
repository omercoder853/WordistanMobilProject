import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../auth/screens/LoginScreen";
import RegisterScreen from "../auth/screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();

export default function AuthStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, animation: "slide_from_right" }}
            initialRouteName="Login"
        >
            <Stack.Screen
                component={LoginScreen}
                name="Login"
            />
            {/* Register: sağdan gelir — ilerleme hissi */}
            <Stack.Screen
                component={RegisterScreen}
                name="Register"
            />

            <Stack.Screen
                component={ForgotPasswordScreen}
                name="Forgot Password"/>
        </Stack.Navigator>
    )
}
