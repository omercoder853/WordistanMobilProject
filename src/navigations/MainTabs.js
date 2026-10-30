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
import { useTheme } from '@/contextapis/ThemeContext';
import NotificationPanel from '../shared/components/header/NotificationPanel';
import { storage } from '../storage/storage';
import { STORAGE_KEYS } from '../constants/StorageKeys';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from 'react-native-safe-area-context';


const Bottom = createBottomTabNavigator();

export default function MainTabs() {
    const { colors } = useTheme();
    const { recentWords, addWord } = useRecentWords();
    const [initialPage, setInitialPage] = useState(null);
    const insets = useSafeAreaInsets();
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
        <SafeAreaView edges={["top","left","right"]} style={{ flex: 1, backgroundColor: colors.common.background }}>
            <Bottom.Navigator
                initialRouteName={initialPage}
                screenOptions={{
                    header: () => <AppHeader />,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: colors.navigation.tabBackground,
                        borderTopWidth: 1,
                        borderTopColor: colors.navigation.tabBorder,
                        elevation: 4,
                        shadowColor: colors.navigation.shadow,
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.03,
                        shadowRadius: 8,
                        paddingHorizontal:10,
                        paddingTop:10,
                        height:65 + insets.bottom
                    },
                }}
            >
                <Bottom.Screen
                    name='Home'
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={focused ? 28 : 24}
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
                                size={focused ? 28 : 24}
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
                                size={focused ? 28 : 24}
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
                                size={focused ? 28 : 24}
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
                                size={focused ? 28 : 24}
                                color={focused ? colors.navigation.tabActive : colors.navigation.tabInactive}
                            />
                        )
                    }}
                />
            </Bottom.Navigator>
            <NotificationPanel />
        </SafeAreaView>
    );
} 