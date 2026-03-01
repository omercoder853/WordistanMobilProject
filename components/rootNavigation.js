import { useAuth } from "../contextapis/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./StackNavigator";
import { Text } from "react-native";
import LoginPage from "../loginPageLayout/login";


export default function RootNavigation() {
    const {isLogin,isLoading} = useAuth();
    console.log("Is loading at navigation : " , isLoading)
    if (isLoading) {
        return (<Text>Wordistan is loading ...</Text>)
    }
    else if (isLogin) {
        return (
        <NavigationContainer>
            <AppNavigation/>
        </NavigationContainer>)
    }
    return (<LoginPage/>)
}