import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contextapis/AuthContext";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStatsRow from "./components/ProfileStatsRow";
import ProfileConsole from "./components/ProfileConsole";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import { useTheme } from "@/contextapis/ThemeContext";

const Profile = () => {
    const { user, setUser } = useAuth();
    const { colors } = useTheme();

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
        <View style={{ flex: 1, width: "100%", backgroundColor: colors.common.background }}>
            <SafeAreaView style={{ flex: 1, width: "100%" }} edges={["top", "left", "right"]}>
                {/* Profil Başlığı ve İstatistik Kartı */}
                <View style={{ width: "100%", alignItems: "center", paddingHorizontal: 16 }}>
                    <ProfileHeader />
                    <ProfileStatsRow />
                </View>

                {/* Profil Menü Listesi */}
                <View style={{ flex: 1, width: "100%", paddingHorizontal: 16 }}>
                    <ProfileConsole />
                </View>
            </SafeAreaView>
        </View>
    );
};

export default Profile;