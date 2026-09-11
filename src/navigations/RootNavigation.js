import { useAuth } from "../contextapis/AuthContext";
import AppNavigation from "./AppNavigator";
import LoadingPage from "../shared/components/LoadingScreen";
import AuthStackNavigator from "../features/auth/AuthStackNavigator";

export default function RootNavigation() {
    const { isLogin, isLoading } = useAuth();
    if (isLoading) {
        return (<LoadingPage />)
    }
    else if (isLogin) {
        return (<AppNavigation />)
    }
    return (<AuthStackNavigator />)
}