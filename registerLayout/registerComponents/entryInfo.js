import { View,Text,TextInput,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback,Platform } from "react-native";
import styles from "../registerStyles/styles";
import LogoArea from "./logoArea";
import NavigationButtons from "./navigationButtons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState,useEffect } from "react";
import CustomAlert from "../../commonComponents/customAlert/customAlert";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';

export default function EntryInfoPage(){
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [passwordVerification,setPasswordVerification] = useState("");
    const [error,setError] = useState();
    const [isSuccess,setSuccess] = useState(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;

    const validEmail = emailRegex.test(email.trim())
    const validPassword = passwordRegex.test(password.trim())
    const validPasswordVerification = validPassword && password.trim()==passwordVerification.trim()
    const isValidForm = validEmail && validPassword && validPasswordVerification

    const data = isValidForm ? {  
        "email":email.trim(),
        "password":password.trim(),
        "password_confirm":passwordVerification.trim()
    }:null;

    useEffect(()=>{
        if (!isValidForm) {
            setError(true)
        }
        else{
            setError(false)
        }
    },[isValidForm])
    return(
        <KeyboardAvoidingView behavior={Platform.OS==='ios' ? 'padding' : 'height'} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <View style={styles.mainContainer}>
                    <LogoArea/>
                    <Text style={styles.titleText}>{t('joinTheKingdom')}</Text>
                    <View>
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <MaterialIcons name="email" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('email')}</Text>
                        </View>
                        <TextInput autoCapitalize="none" onChangeText={(value)=>setEmail(value.toLowerCase())} style={styles.inputArea} placeholder={t('emailPlaceholder')}/>
                        {!validEmail && email.length>0 && <Text style={styles.warningText}>{t('validEmailWarning')}</Text> }
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <MaterialIcons name="password" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('passwordLabel')}</Text>
                        </View>
                        <TextInput onChangeText={(value) => setPassword(value)} style={styles.inputArea} placeholder={t('yourPassword')}/>
                        {!validPassword && password.length>0 && <Text style={styles.warningText}>{t('passwordRule')}</Text>}
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <MaterialIcons name="password" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>{t('passwordVerification')}</Text>
                        </View>
                        <TextInput onChangeText={(value)=>setPasswordVerification(value)} style={styles.inputArea} placeholder={t('enterPasswordAgain')}/>
                        {!validPasswordVerification && passwordVerification.length>0 && <Text style={styles.warningText}>{t('passwordsNotSameWarning')}</Text>}
                    </View>

                    <NavigationButtons anyError={error} data={data} setSuccess={setSuccess}/>

                    <CustomAlert visible={isSuccess==true} title={t('allSet')} 
                    message={t('takingYouToLogin')} 
                    buttons={[{text:t('login') , style:"success" , action:()=>{navigation.navigate("Login"),setSuccess(null)}}]} />
                
                    <CustomAlert visible={isSuccess==false} title={t('ooopsShort')} 
                    message={t('somethingWentWrong')} 
                    buttons={[{text:t('cancel') ,style:"danger" , action:()=>setSuccess(null)}]} />
                </View>
                
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}