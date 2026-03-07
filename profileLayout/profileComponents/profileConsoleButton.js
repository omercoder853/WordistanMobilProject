import { View,Text,TouchableOpacity } from "react-native";
import {Ionicons,Entypo} from '@expo/vector-icons';
import styles from "../profileStyle/styles";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../../contextapis/AuthContext";

export default function ConsoleButton({item,setAlertVisible}){
    const navigation = useNavigation();
    const {} = useAuth();

    function handleLogout() {
        setAlertVisible(true)
    }

    return(
        <TouchableOpacity onPress={item.name === "Logout" ? handleLogout : () => navigation.navigate(item.name) }>
            <View style={[styles.consoleButton,item.name === "Logout" && {borderColor:'red',borderWidth:1}]}>
                <View style={{backgroundColor:'white',padding:6,borderRadius:16,marginHorizontal:10}}>
                    <Ionicons name={item.icon} size={25} color={item.name === "Logout" ? "red" : "black"} />
                </View>
                <Text style={item.name === "Logout" && {color:'red'}}>{item.name}</Text>
                <Entypo style={{marginLeft:'auto',marginRight:10}} name="chevron-small-right" size={30} color={item.name === "Logout" ? "red" : "black"} />
            </View>
        </TouchableOpacity>
    )
}