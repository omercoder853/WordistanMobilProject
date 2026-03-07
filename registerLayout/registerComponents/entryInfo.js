import { View,Text,TextInput,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback,Platform } from "react-native";
import styles from "../registerStyles/styles";
import LogoArea from "./logoArea";
import NavigationButtons from "./navigationButtons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState,useEffect } from "react";
import CustomAlert from "../../commonComponents/customAlert/customAlert";
import { useNavigation } from "@react-navigation/native";

export default function EntryInfoPage(){
    const navigation = useNavigation();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [passwordVerification,setPasswordVerification] = useState("");
    const [error,setError] = useState();
    const [isSuccess,setSuccess] = useState(null);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;

    const validEmail = emailRegex.test(email)
    const validPassword = passwordRegex.test(password)
    const validPasswordVerification = validPassword && password==passwordVerification
    const isValidForm = validEmail && validPassword && validPasswordVerification

    const data = isValidForm ? {
        "email":email,
        "password":password,
        "password_confirm":passwordVerification
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
                    <Text style={styles.titleText}>Join the Kingdom</Text>
                    <View>
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <MaterialIcons name="email" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>E-Mail:</Text>
                        </View>
                        <TextInput autoCapitalize="none" onChangeText={(value)=>setEmail(value.toLowerCase())} style={styles.inputArea} placeholder="name@domain.com"/>
                        {!validEmail && email.length>0 && <Text style={styles.warningText}>* Enter a valid email!</Text> }
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <MaterialIcons name="password" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>Password:</Text>
                        </View>
                        <TextInput onChangeText={(value) => setPassword(value)} style={styles.inputArea} placeholder="Your Password"/>
                        {!validPassword && password.length>0 && <Text style={styles.warningText}>* Password must be at least 8 characters long and include an uppercase letter, 
                            a lowercase letter, and a number.</Text>}
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <MaterialIcons name="password" size={20} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>Password Verification:</Text>
                        </View>
                        <TextInput onChangeText={(value)=>setPasswordVerification(value)} style={styles.inputArea} placeholder="Enter Your Password Again"/>
                        {!validPasswordVerification && passwordVerification.length>0 && <Text style={styles.warningText}>* The passwords are not the same! </Text>}
                    </View>

                    <NavigationButtons anyError={error} data={data} setSuccess={setSuccess}/>

                    <CustomAlert visible={isSuccess==true} title="You are all set!" 
                    message="We're taking you to the login page to get started." 
                    buttons={[{text:"Login" , style:"success" , action:()=>{navigation.navigate("Login"),setSuccess(null)}}]} />
                
                    <CustomAlert visible={isSuccess==false} title="Ooops!" 
                    message="Something went wrong. Let's get you back in!" 
                    buttons={[{text:"Cancel" ,style:"danger" , action:()=>setSuccess(null)}]} />
                </View>
                
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}