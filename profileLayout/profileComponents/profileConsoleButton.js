import { View,Text,TouchableOpacity } from "react-native";
import {Ionicons,Entypo} from '@expo/vector-icons';
import styles from "../profileStyle/styles";
import { useNavigation } from "@react-navigation/native";
import { useFeedback } from "../../contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contextapis/AuthContext";


export default function ConsoleButton({item}){
    const navigation = useNavigation();
    const {t} = useTranslation();
    const {logout} = useAuth();
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();

    function handleLogout() {
        setAlertTitle(t('warning'));
        setAlertMessage(t('logoutWarning'));
        addAlertButton({ text: t('cancel'), style: "cancel", action: () => hideAlert() });
        addAlertButton({ text: t('exit'), style: "danger", action: logout });
        setAlertVisible(true);
    }

    return(
        <TouchableOpacity onPress={item.name === "Logout" ? handleLogout : () => navigation.navigate("Settings Navigation",{screen:item.name}) }>
            <View style={[styles.consoleButton,item.name === "Logout" && {borderColor:'red',borderWidth:1}]}>
                <View style={{backgroundColor:'white',padding:6,borderRadius:16,marginHorizontal:10}}>
                    <Ionicons name={item.icon} size={25} color={item.name === "Logout" ? "red" : "black"} />
                </View>
                <Text style={item.name === "Logout" && {color:'red'}}>{item.label || item.name}</Text>
                <Entypo style={{marginLeft:'auto',marginRight:10}} name="chevron-small-right" size={30} color={item.name === "Logout" ? "red" : "black"} />
            </View>
        </TouchableOpacity>
    )
}