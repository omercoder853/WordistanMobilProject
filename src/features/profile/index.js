import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contextapis/AuthContext';
import HeaderTopRow from './components/HeaderTopRow';
import ProfileHeader from './components/ProfileHeader';
import ProfileStatsRow from './components/ProfileStatsRow';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from "react";
import ProfileConsole from './components/ProfileConsole';
import { storage } from '@/storage/storage';
import { STORAGE_KEYS } from '@/constants/StorageKeys';

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
                    <ProfileHeader />
                    <ProfileStatsRow />
                </View>
                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                    <ProfileConsole />
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Profile;