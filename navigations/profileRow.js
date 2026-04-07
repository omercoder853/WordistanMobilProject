import { View, Text, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../homePageLayout/HomePageStyles/homeStyles";
import { useAuth } from "../contextapis/AuthContext";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileRow = () => {
    const insets = useSafeAreaInsets();
    const {user,setUser,getDataStorage} = useAuth();
    useEffect(() => {
        if (!user) {
            const loadUser = async () => {
                const userData = await getDataStorage("user");
                if (userData && setUser) {
                    setUser(JSON.parse(userData));
                }
            };
            loadUser();
        }}, [user]);

    return(
    <View style={[styles.profileRowContainer,{marginTop:insets.top}]}>
        <View style={styles.greeting}>
            <Image
                style={styles.logoImage}
                source={require("../assets/logo.png")}/>
            <Text style={styles.textWelcome}>elcome, </Text>
            <Text style={{fontSize:18}}>{user?.first_name.includes(" ") ? user?.first_name.split(" ")[0] : user?.first_name}</Text>
        </View>
        <View style={styles.profileContainer}>
            <Image
                style={styles.profileImage}
                source={require('../assets/avatarBoy.png')}/>
            <Text style={{marginRight:9}}>Level 15</Text>
            <Ionicons  name="notifications" size={24} color="black" />
        </View>
    </View>
)};

export default ProfileRow;
