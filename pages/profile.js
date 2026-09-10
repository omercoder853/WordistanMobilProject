import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contextapis/AuthContext';
import HeaderTopRow from '../profileLayout/profileComponents/headerTopRow';
import ProfileInfo from '../profileLayout/profileComponents/profileInfo';
import ProfileStatsRow from '../profileLayout/profileComponents/profileStatsRow';
import InviteFriend from '../profileLayout/profileComponents/inviteFriend';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from "react";
import ProfileConsole from '../profileLayout/profileComponents/profileConsole';
import { storage } from '../src/storage/storage';
import { STORAGE_KEYS } from '../src/constants/StorageKeys';

const Profile = () => {
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (!user) {
            const loadUser = async () => {
                const userData = await storage.get(STORAGE_KEYS.SESSION.USER);
                if (userData) {
                    setUser(userData);
                }
            };
            loadUser();
        }
    }, [user]);

    return (
            <LinearGradient colors={['#e9d5ff', '#ffffff']} start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.5 }} style={{ flex: 1, alignItems: 'center' }}>
                <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                    <View style={{ width: '90%', alignItems: 'center' }}>
                        <HeaderTopRow />
                        <ProfileInfo />
                        <ProfileStatsRow />
                        <InviteFriend />
                    </View>
                    <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                        <ProfileConsole/>
                    </View>
                </SafeAreaView>
            </LinearGradient>
    )
}

export default Profile;