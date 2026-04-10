import { View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Collections from "./collectionsPage";
import Personal from "./personalDictionaries";
import styles from "../DictionariesStyles/dictStyles";
import { useTranslation } from "react-i18next";
const Tab = createMaterialTopTabNavigator();

export default function TabBar({ setCurrentTab }) {
    const { t } = useTranslation();
    return (
        <Tab.Navigator initialRouteName="Personal" 
        screenListeners={{
            state: (e) => {
                if(setCurrentTab) {
                    const index = e.data.state.index;
                    const routeName = e.data.state.routeNames[index];
                    setCurrentTab(routeName);
                }
            }
        }}
        screenOptions={{tabBarIndicatorStyle:{backgroundColor:'transparent'}, 
        tabBarStyle:styles.tabBarStyle}}>
            <Tab.Screen name="Personal" component={Personal} options={{tabBarLabel: t('personal')}}/>
            <Tab.Screen name="Collections" component={Collections} options={{tabBarLabel: t('collections')}}/>
        </Tab.Navigator>
    )
}