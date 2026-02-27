import { useAuth } from "../contextapis/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavbar from './BottomNavbar'
import { Text } from "react-native";
import LoginPage from "../loginPageLayout/login";


export default function RootNavigation() {
    const {isLogin} = useAuth();
    if (isLogin) {
        return (
        <NavigationContainer>
            <BottomNavbar />  
        </NavigationContainer>)
    }
    return (<LoginPage/>)
}