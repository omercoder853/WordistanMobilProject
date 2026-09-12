import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../auth/screens/LoginScreen";
import RegisterScreen from "../auth/screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Login"
        >
            {/* Login başlangıç noktası, animasyon yok */}
            <Stack.Screen
                component={LoginScreen}
                name="Login"
                options={{ animation: "none" }}
            />
            {/* Register: sağdan gelir — ilerleme hissi */}
            <Stack.Screen
                component={RegisterScreen}
                name="Register"
                options={{ animation: "slide_from_right" }}
            />
        </Stack.Navigator>
    )
}
