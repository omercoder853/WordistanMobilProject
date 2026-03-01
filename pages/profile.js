import {View,Text,TouchableOpacity} from 'react-native';
import { useAuth } from '../contextapis/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
    const {setAccToken,setLogin,setRefToken,SetUser} = useAuth();
    async function logout() {
        await AsyncStorage.removeItem("@wordistan:access-token")
        await AsyncStorage.removeItem("@wordistan:refresh-token")
        setAccToken(null)
        setRefToken(null)
        SetUser(null)
        setLogin(false)
    }
    return (
        <View>
            <Text>Profile</Text>
            <TouchableOpacity style={{backgroundColor:'red'}} onPress={logout}>
                <Text>Log out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Profile;