import { View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Collections from "./collections";
import Personal from "./personalDictionaries";
import styles from "../DictionariesStyles/dictStyles";
const Tab = createMaterialTopTabNavigator();

export default function TabBar() {
    return (
        <Tab.Navigator initialRouteName="Personal" 
        screenOptions={{tabBarIndicatorStyle:{backgroundColor:'transparent'}, 
        tabBarStyle:styles.tabBarStyle}}>
            <Tab.Screen name="Personal" component={Personal} options={{}}/>
            <Tab.Screen name="Collections" component={Collections}/>
        </Tab.Navigator>
    )
}