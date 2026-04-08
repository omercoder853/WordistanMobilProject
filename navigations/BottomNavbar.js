import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../pages/homePage';
import Dictionaries from '../pages/dictionaries';
import ProfileRow from './profileRow';
import {MaterialIcons,Ionicons,Entypo} from '@expo/vector-icons';
import Translate from '../pages/translate';
import Games from '../pages/games';
import Profile from '../pages/profile';
import useRecentWords from '../hooks/recentWordsHook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect,useState } from 'react';

const Bottom = createBottomTabNavigator();
export default function BottomNavbar(){
    const {recentWords,addWord} = useRecentWords()
    const [initialPage,setInitialPage] = useState(null)
    useEffect(()=>{
        const loadInitialPage = async () =>{
            const saved = await AsyncStorage.getItem("@wordistan:initialPage")
            setInitialPage(saved || "Home")
        }
        loadInitialPage();
    },[])
    if (initialPage === null) {
        return null;
    }
    return(
        <Bottom.Navigator initialRouteName={initialPage} 
        screenOptions={{header:()=><ProfileRow/>, tabBarShowLabel:false}}>
            <Bottom.Screen name='Home' 
            options={{tabBarIcon:({focused})=>(<Ionicons name={focused?"home":"home-outline"} size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}>
            {(props) => <HomePage {...props} recentWords={recentWords} />}
            </Bottom.Screen>
            <Bottom.Screen name='Dictionaries' component={Dictionaries} 
            options={{tabBarIcon:({focused})=>(<MaterialIcons name="library-books" size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}>
            </Bottom.Screen>
            <Bottom.Screen name='Translate' 
            options={{tabBarIcon: ({ focused }) => (<MaterialIcons name="translate" size={24} color={focused ? "#5B3FD3" : "#A6A1B8"} />)}}>
            {(props) => <Translate {...props} recentWords={recentWords} addWord={addWord} />}</Bottom.Screen>
            <Bottom.Screen name='Games' component={Games} 
            options={{tabBarIcon:({focused})=>(<Ionicons name="game-controller" size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}></Bottom.Screen>
            <Bottom.Screen name='Profile' component={Profile} 
            options={{headerShown:false, tabBarIcon:({focused})=>(<MaterialIcons name="account-box" size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}></Bottom.Screen>
        </Bottom.Navigator>
    )
} 