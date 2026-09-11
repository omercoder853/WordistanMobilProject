import { View,ScrollView} from "react-native";
import DailyWord from "./components/DailyWordWidget";
import UserStatsBar from "./components/UserStatsBar"
import QuickMenu from "./components/QuickMenu";
import RecentWords from "./components/RecentWords";

const HomePage = ({recentWords}) => {
    return(
    <ScrollView showsVerticalScrollIndicator={false}>
        <DailyWord/>
        <UserStatsBar/>
        <QuickMenu/>
        <RecentWords recentWords={recentWords}/>
    </ScrollView>
)}

export default HomePage;