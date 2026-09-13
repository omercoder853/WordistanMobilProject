import { ScrollView } from "react-native";
import DailyWord from "./components/DailyWordWidget";
import UserStatsBar from "./components/UserStatsBar";
import QuickMenu from "./components/QuickMenu";
import RecentWords from "./components/RecentWords";
import { useTheme } from "@/contextapis/ThemeContext";

const HomePage = ({ recentWords }) => {
    const { colors } = useTheme();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: colors.common.background }}
            contentContainerStyle={{ paddingBottom: 36 }}
        >
            <DailyWord />
            <UserStatsBar />
            <QuickMenu />
            <RecentWords recentWords={recentWords} />
        </ScrollView>
    );
};

export default HomePage;