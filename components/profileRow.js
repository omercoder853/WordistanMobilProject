import { View, Text, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../homePageLayout/HomePageStyles/homeStyles";
import { useAuth } from "../contextapis/AuthContext";

const ProfileRow = () => {
    const {user} = useAuth();
    return(
    <View style={styles.profileRowContainer}>
        <View style={styles.greeting}>
            <Image
                style={styles.logoImage}
                source={require("../assets/logo.png")}/>
            <Text style={styles.textWelcome}>elcome, </Text>
            <Text style={{fontSize:18}}>{user['nick_name']}</Text>
        </View>
        <View style={styles.profileContainer}>
            <Image
                style={styles.profileImage}
                source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Nb6xB0mD3pGRGD6qGgTIzoqLf3MEwtRh5Q&s",
                }}
            />
            <Text style={{marginRight:9}}>Level 15</Text>
            <Ionicons  name="notifications" size={24} color="black" />
        </View>
    </View>
)};

export default ProfileRow;
