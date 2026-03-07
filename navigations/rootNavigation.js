import { useAuth } from "../contextapis/AuthContext";
import AppNavigation from "./StackNavigator";
import LoadingPage from "../pages/loadingPage";
import AuthStackNavigator from "./AuthStackNavigator";

export default function RootNavigation() {
    const {isLogin,isLoading} = useAuth();
    if (isLoading) {
        return (<LoadingPage/>)
    }
    else if (isLogin) {
        return (<AppNavigation/>)
    }
    return (<AuthStackNavigator/>)
}