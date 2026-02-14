import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../pages/homePage';
import Dictionaries from '../pages/dictionaries';
import ProfileRow from '../homePageLayout/HomePageComponents/profileRow';
import {MaterialIcons,Ionicons,Entypo} from '@expo/vector-icons';
import Translate from '../pages/translate';
import Games from '../pages/games';
import Profile from '../pages/profile';


const Bottom = createBottomTabNavigator();
export default function BottomNavbar(){
    return(
        <Bottom.Navigator initialRouteName='Home' 
        screenOptions={{header:()=><ProfileRow/>, tabBarShowLabel:false}}>
            <Bottom.Screen name='Home' component={HomePage} 
            options={{tabBarIcon:({focused})=>(<Ionicons name={focused?"home":"home-outline"} size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}>
            </Bottom.Screen>
            <Bottom.Screen name='Dictionaries' component={Dictionaries} 
            options={{tabBarIcon:({focused})=>(<MaterialIcons name="library-books" size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}>
            </Bottom.Screen>
            <Bottom.Screen name='Translate' component={Translate} 
            options={{tabBarIcon:({focused})=>(<MaterialIcons name="translate" size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}></Bottom.Screen>
            <Bottom.Screen name='Games' component={Games} 
            options={{tabBarIcon:({focused})=>(<Ionicons name="game-controller" size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}></Bottom.Screen>
            <Bottom.Screen name='Profile' component={Profile} 
            options={{tabBarIcon:({focused})=>(<MaterialIcons name="account-box" size={24} color={focused ? "#5B3FD3":"#A6A1B8"} />)}}></Bottom.Screen>
        </Bottom.Navigator>
    )
} 