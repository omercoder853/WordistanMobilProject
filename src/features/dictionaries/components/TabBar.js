import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Collections from "./CollectionsTab";
import Personal from "./PersonalDictionariesTab";
import styles from "../styles/DictionaryStyles";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

const Tab = createMaterialTopTabNavigator();

export default function TabBar({ setCurrentTab }) {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            initialRouteName="Personal"
            screenListeners={{
                state: (e) => {
                    if (setCurrentTab) {
                        const index = e.data.state.index;
                        const routeName = e.data.state.routeNames[index];
                        setCurrentTab(routeName);
                    }
                }
            }}
            screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: dColors.tabActive, height: 3, borderRadius: 3 },
                tabBarActiveTintColor: dColors.tabActive,
                tabBarInactiveTintColor: dColors.tabInactive,
                tabBarStyle: [styles.tabBarStyle, { borderBottomColor: dColors.tabBorder }],
            }}
        >
            <Tab.Screen name="Personal" component={Personal} options={{ tabBarLabel: t('personal') }} />
            <Tab.Screen name="Collections" component={Collections} options={{ tabBarLabel: t('collections') }} />
        </Tab.Navigator>
    );
}