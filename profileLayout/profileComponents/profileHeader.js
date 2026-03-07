import { View,Text,TouchableOpacity } from "react-native";
import { useAuth } from "../../contextapis/AuthContext";
import {FontAwesome5,MaterialCommunityIcons,MaterialIcons} from '@expo/vector-icons';
import HeaderTopRow from "./headerTopRow";

export default function ProfileHeader(){
    return(
        <HeaderTopRow/>
    )
}