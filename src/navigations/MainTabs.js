import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../features/home/index';
import Dictionaries from '../features/dictionaries/index';
import AppHeader from "../shared/components/header/AppHeader";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Translate from '../features/translate/index';
import Games from '../features/games/index';
import Profile from '../features/profile/index';
import useRecentWords from '../hooks/recentWordsHook';
import { useEffect, useState } from 'react';
import { View } from "react-native";
import { useTheme } from '@/contextapis/ThemeContext';
import NotificationPanel from '../shared/components/header/NotificationPanel';
import { storage } from '../storage/storage';
import { STORAGE_KEYS } from '../constants/StorageKeys';

const Bottom = createBottomTabNavigator();

export default function MainTabs() {
    const { colors } = useTheme();
    const { recentWords, addWord } = useRecentWords();
    const [initialPage, setInitialPage] = useState(null);

    useEffect(() => {
        const loadInitialPage = async () => {
            const saved = await storage.get(STORAGE_KEYS.PREFERENCES.INITIAL_PAGE);
            setInitialPage(saved || "Home");
        };
        loadInitialPage();
    }, []);

    if (initialPage === null) {
        return null;
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.common.background }}>
            <Bottom.Navigator
                initialRouteName={initialPage}
                sceneContainerStyle={{ backgroundColor: colors.common.background }}
                screenOptions={{
                    header: () => <AppHeader />,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: colors.navigation.tabBackground,
                        borderTopWidth: 1,
                        borderTopColor: colors.navigation.tabBorder,
                        height: 58,
                        elevation: 4,
                        shadowColor: colors.navigation.shadow,
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.03,
                        shadowRadius: 8,
                    },
                }}
            >
                <Bottom.Screen
                    name='Home'
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={24}
                                color={focused ? colors.navigation.tabActive : colors.navigation.tabInactive}
                            />
                        )
                    }}
                >
                    {(props) => <HomePage {...props} recentWords={recentWords} />}
                </Bottom.Screen>
                <Bottom.Screen
                    name='Dictionaries'
                    component={Dictionaries}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons
                                name="library-books"
                                size={24}
                                color={focused ? colors.navigation.tabActive : colors.navigation.tabInactive}
                            />
                        )
                    }}
                />
                <Bottom.Screen
                    name='Translate'
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons
                                name="translate"
                                size={24}
                                color={focused ? colors.navigation.tabActive : colors.navigation.tabInactive}
                            />
                        )
                    }}
                >
                    {(props) => <Translate {...props} recentWords={recentWords} addWord={addWord} />}
                </Bottom.Screen>
                <Bottom.Screen
                    name='Games'
                    component={Games}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name="game-controller"
                                size={24}
                                color={focused ? colors.navigation.tabActive : colors.navigation.tabInactive}
                            />
                        )
                    }}
                />
                <Bottom.Screen
                    name='Profile'
                    component={Profile}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <MaterialIcons
                                name="account-box"
                                size={24}
                                color={focused ? colors.navigation.tabActive : colors.navigation.tabInactive}
                            />
                        )
                    }}
                />
            </Bottom.Navigator>
            <NotificationPanel />
        </View>
    );
} 