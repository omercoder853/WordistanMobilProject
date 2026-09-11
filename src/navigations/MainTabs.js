import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../features/home/index';
import Dictionaries from '../features/dictionaries/index';
import AppHeader from "../shared/components/header/AppHeader"
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Translate from '../features/translate/index'
import Games from '../features/games/index';
import Profile from '../features/profile/index';
import useRecentWords from '../hooks/recentWordsHook';
import { useEffect, useState } from 'react';

import NotificationPanel from '../shared/components/header/NotificationPanel';
import { storage } from '../storage/storage';
import { STORAGE_KEYS } from '../constants/StorageKeys';

const Bottom = createBottomTabNavigator();
export default function MainTabs() {
    const { recentWords, addWord } = useRecentWords()
    const [initialPage, setInitialPage] = useState(null)
    useEffect(() => {
        const loadInitialPage = async () => {
            const saved = await storage.get(STORAGE_KEYS.PREFERENCES.INITIAL_PAGE);
            setInitialPage(saved || "Home")
        }
        loadInitialPage();
    }, [])
    if (initialPage === null) {
        return null;
    }
    return (
        <LinearGradient colors={['#F5EDFF', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
            <Bottom.Navigator initialRouteName={initialPage}
                sceneContainerStyle={{ backgroundColor: 'transparent' }}
                screenOptions={{ header: () => <AppHeader />, tabBarShowLabel: false }}>
                <Bottom.Screen name='Home'
                    options={{ tabBarIcon: ({ focused }) => (<Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? "#5B3FD3" : "#A6A1B8"} />) }}>
                    {(props) => <HomePage {...props} recentWords={recentWords} />}
                </Bottom.Screen>
                <Bottom.Screen name='Dictionaries' component={Dictionaries}
                    options={{ tabBarIcon: ({ focused }) => (<MaterialIcons name="library-books" size={24} color={focused ? "#5B3FD3" : "#A6A1B8"} />) }}>
                </Bottom.Screen>
                <Bottom.Screen name='Translate'
                    options={{ tabBarIcon: ({ focused }) => (<MaterialIcons name="translate" size={24} color={focused ? "#5B3FD3" : "#A6A1B8"} />) }}>
                    {(props) => <Translate {...props} recentWords={recentWords} addWord={addWord} />}</Bottom.Screen>
                <Bottom.Screen name='Games' component={Games}
                    options={{ tabBarIcon: ({ focused }) => (<Ionicons name="game-controller" size={24} color={focused ? "#5B3FD3" : "#A6A1B8"} />) }}></Bottom.Screen>
                <Bottom.Screen name='Profile' component={Profile}
                    options={{ headerShown: false, tabBarIcon: ({ focused }) => (<MaterialIcons name="account-box" size={24} color={focused ? "#5B3FD3" : "#A6A1B8"} />) }}></Bottom.Screen>
            </Bottom.Navigator>
            <NotificationPanel />
        </LinearGradient>
    )
} 