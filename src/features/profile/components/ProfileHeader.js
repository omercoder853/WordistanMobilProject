import { View, Text, Image } from "react-native";
import styles from "../styles/styles";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from "@/contextapis/AuthContext";
import { useTheme } from "@/contextapis/ThemeContext";

export default function ProfileHeader() {
    const { user } = useAuth();
    const { colors } = useTheme();
    const imgSource = user?.gender == "male" ? require("@/shared/assets/default_avatar_boy.png") : require("@/shared/assets/default_avatar_girl.png");

    return (
        <View style={{ alignItems: 'center' , width:'100%' , borderBottomWidth:0.5 , paddingBottom:10 , 
        borderBottomLeftRadius:10 , borderLeftWidth:1 , borderRightWidth:1,
        borderBottomRightRadius:10,borderColor:"transparent" , borderBottomColor:colors.common.border }}>
            <Image style={styles.profilePhoto} source={imgSource} />
            <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 7, color: colors.profile.textPrimary }}>{user?.first_name + " " + user?.last_name}</Text>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <MaterialIcons name="email" size={15} color={colors.profile.textSecondary} />
                <Text style={{ fontSize: 12, color: colors.profile.textSecondary }}>{user?.email}</Text>
            </View>
        </View>
    );
}