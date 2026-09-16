import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1Personal from "../components/Step1Personal";
import Step2Preferences from "../components/Step2Preferences";
import Step3Account from "../components/Step3Account";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/contextapis/ThemeContext";

const Stack = createNativeStackNavigator();
export default function RegisterScreen() {
    const { colors, isDark } = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.auth.background }}>
            <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.auth.background} />
            <Stack.Navigator
                initialRouteName="Personal Info"
                screenOptions={{
                    headerShown: false,
                    // Kayıt adımları sağdan sola ilerler — wizard akışı
                    animation: "slide_from_right",
                }}
            >
                <Stack.Screen component={Step1Personal} name="Personal Info" />
                <Stack.Screen component={Step2Preferences} name="Preferences" />
                <Stack.Screen component={Step3Account} name="Entry Info" />
            </Stack.Navigator>
        </SafeAreaView>
    )
}