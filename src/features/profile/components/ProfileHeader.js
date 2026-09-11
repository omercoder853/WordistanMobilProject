import { View, Text, Image } from "react-native";
import styles from "../styles/styles";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from "@/contextapis/AuthContext";

export default function ProfileHeader() {
    const { user } = useAuth();
    const imgSource = user?.gender == "male" ? require("@/shared/assets/default_avatar_boy.png") : require("@/shared/assets/default_avatar_girl.png")
    return (
        <View style={{ alignItems: 'center' }}>
            <Image style={styles.profilePhoto} source={imgSource} />
            <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 7 }}>{user?.first_name + " " + user?.last_name}</Text>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <MaterialIcons name="email" size={15} color="black" />
                <Text style={{ fontSize: 12, color: '#64748B' }}>{user?.email}</Text>
            </View>
        </View>
    )
}