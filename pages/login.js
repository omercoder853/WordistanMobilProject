import { View,Text,TouchableOpacity,TextInput,Image,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard } from "react-native";
import { useAuth } from "../contextapis/AuthContext";
import { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";


export default function LoginPage(){
    const { t } = useTranslation();
    const navigation = useNavigation();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^\S+@\S+\.[a-z]{2,}$/;
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const {setLogin,setDataStorage,setAccToken,setRefToken,setUser} = useAuth();
    const [isLoading,setLoading] = useState(false)

    const isValidEmail = emailRegex.test(email)
    const isValidPassword = passwordRegex.test(password)

    const login = async () => {
        Keyboard.dismiss();
        if (isValidEmail && isValidPassword) {
            setLoading(true)
            const res = await fetch('https://terribilita-milissa-unpermitted.ngrok-free.dev/api/token',
            {body:JSON.stringify({email,password}),method:'POST',headers:{'Content-Type': 'application/json'}})
            if (res.status == 200) {
                const data = await res.json();
                await setDataStorage("access-token",data['access'])
                setAccToken(data['access'])
                await setDataStorage("refresh-token",data['refresh'])
                setRefToken(data['refresh'])
                await setDataStorage("user",JSON.stringify(data['user']))
                setUser(data['user'])
                setLogin(true)
            }
            else {
                alert(t('loginFailed'))
            }
            setLoading(false)
        }
        
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.mainContainer}>
                    <View style={styles.loginArea}>
                        <View style={styles.loginTitleRow}>
                            <Image source={require('../assets/logo.png')} style={{width:60,height:60}}/>
                            <Text style={styles.loginTitle}>{t('wordistan')}</Text>
                        </View>
                        <Text style={styles.loginTitleSmall}>{t('translateDesc')}</Text>
                        <View style={styles.inputLabelRow}>
                            <MaterialIcons name="email" size={18} color="#b565f5" />
                            <Text style={styles.inputLabel}>{t('emailLabel')}</Text>
                        </View>
                        <TextInput style={styles.textInput} autoCapitalize="none" placeholder={t('emailPlaceholder')} 
                        onChangeText={(value) => setEmail(value.trim().toLowerCase())}/>
                        {!isValidEmail && email?.length>0 && <Text style={styles.warningText}>{t('validEmailAddressWarning')}</Text>}
                        <View style={styles.inputLabelRow}>
                            <MaterialIcons name="vpn-key" size={18} color="#b565f5"/>
                            <Text style={styles.inputLabel}>{t('loginPasswordLabel')}</Text>
                        </View>
                        <TextInput style={styles.textInput} autoCapitalize="none" placeholder={t('password')} 
                        onChangeText={(value)=>setPassword(value.trim())}/>
                        {!isValidPassword && password?.length>0 && <Text style={styles.warningText}>{t('passwordRule')}</Text>}
                        <TouchableOpacity onPress={login} style={styles.loginButton}>
                            {isLoading ?
                            (<LottieView source={require('../assets/animations/loadingAnimationDots.json')} 
                            style={{height:19,width:37,transform:[{scale:6}]}} loop autoPlay colorFilters={[{keypath:"*",color:"#FFFFFF"}]} />): 
                            (<Text style={{color:'white',fontWeight:'900'}}>{t('login')}</Text>)}
                        </TouchableOpacity>
                        <View style={{flexDirection:'row',marginTop:20,gap:10}}>
                            <Text style={{fontSize:12}}>{t('dontHaveAccount')}</Text>
                            <Text style={{textDecorationLine:'underline',color: '#e86ad0',fontWeight:'600'}} 
                            onPress={()=>navigation.navigate("Register")}>{t('register')}</Text> 
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:'#EBE1FF70',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    loginArea:{
        width:'85%',
        borderWidth:3,
        borderColor:'#B565F54D',
        paddingHorizontal:35,
        paddingVertical:30,
        borderRadius:25,
        backgroundColor:'#FCFAFF90'
    },
    loginTitleRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    loginTitle:{
        color:'#b565f5',
        fontWeight:'900',
        fontSize:30
    },
    loginTitleSmall:{
        color:'#555',
        fontSize:12,
        width:'70%',
        textAlign:'center',
        alignSelf:'center',
        marginBottom:25
    },
    inputLabelRow:{
        flexDirection:'row',
        alignItems:'center',
        gap:5,
        marginBottom:10
    },
    inputLabel:{
        color: '#6b3fa0',
        fontWeight:'800'
    },
    textInput:{
        borderWidth:2,
        borderColor:'#B565F54D',
        borderRadius:10,
        marginBottom:20,
        paddingHorizontal:10
    },
    warningText:{
        color:"#FF3B30",
        marginTop:-15,
        fontSize:13,
        marginBottom:20
    },
    loginButton:{
        paddingHorizontal:35,
        paddingVertical:13,
        backgroundColor:'#e86ad0',
        borderRadius:10,
        alignSelf:'center'
    }
})