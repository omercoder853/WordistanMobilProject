import { View,Text,Image,TouchableOpacity } from "react-native";
import styles from "../profileStyle/profileDetailsStyle";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTranslation } from "react-i18next";
import {useAuth} from "../../contextapis/AuthContext"

export default function PersonalDetails(){
    const {user} = useAuth();
    const {t} = useTranslation();
    return (
        <View style={{flex:1,alignItems:'center'}}>
            <View style={{flexDirection:'row',marginTop:15}}>
                <Image style={styles.profilePhoto} source={require("../../assets/avatarBoy.png")}/>
                <TouchableOpacity style={styles.editPhoto}>
                    <MaterialCommunityIcons name="image-edit-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.profileDetailContainer}>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("nameProfile")}</Text>
                    <Text style={styles.profileValue}>{user.first_name}</Text>
                </View>
                <View style={{borderColor:'#F1F5F9',borderWidth:1}}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("surnameProfile")}</Text>
                    <Text style={styles.profileValue}>{user.last_name}</Text>
                </View>
                <View style={{borderColor:'#F1F5F9',borderWidth:1}}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("emailProfile")}</Text>
                    <Text style={styles.profileValue}>{user.email}</Text>
                </View>
                <View style={{borderColor:'#F1F5F9',borderWidth:1}}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("usernameProfile")}</Text>
                    <Text style={styles.profileValue}>{user.nick_name}</Text>
                </View>
                <View style={{borderColor:'#F1F5F9',borderWidth:1}}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("genderProfile")}</Text>
                    <Text style={styles.profileValue}>{user.nick_name}</Text>
                </View>
                <View style={{borderColor:'#F1F5F9',borderWidth:1}}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("birthDateProfile")}</Text>
                    <Text style={styles.profileValue}>{user.birth_date}</Text>
                </View>
                <View style={{borderColor:'#F1F5F9',borderWidth:1}}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("dateJoinedProfile")}</Text>
                    <Text style={styles.profileValue}>{user.date_joined.slice(0,10)}</Text>
                </View>
                <View style={{borderColor:'#F1F5F9',borderWidth:1}}></View>
                <View style={styles.profileDetailItem}>
                    <Text style={styles.profileLabel}>{t("passwordProfile")}</Text>
                    <TouchableOpacity style={styles.changePasswordButton}>
                        <Text style={{color:'white'}}>{t("changePassword")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.deleteAccountButton}>
                <Text style={{textAlign:'center',color:'#64748B'}}>{t("deleteAccount")}</Text>
            </TouchableOpacity>
        </View>
    )
}