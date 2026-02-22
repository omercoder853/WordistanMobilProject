import { View,ScrollView} from "react-native";
import DailyWord from "../homePageLayout/HomePageComponents/dailyWord";
import StatRow from "../homePageLayout/HomePageComponents/statRow";
import QuickMenu from "../homePageLayout/HomePageComponents/quickMenü";
import RecentWords from "../homePageLayout/HomePageComponents/lastWords";

const HomePage = ({recentWords}) => {
    return(
    <ScrollView showsVerticalScrollIndicator={false}>
        <DailyWord/>
        <StatRow/>
        <QuickMenu/>
        <RecentWords recentWords={recentWords}/>
    </ScrollView>
)}

export default HomePage;