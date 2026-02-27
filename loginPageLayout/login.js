import { View,Text,TouchableOpacity,TextInput,Image,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard } from "react-native";
import { useAuth } from "../contextapis/AuthContext";
import { useState } from "react";
import styles from "./loginStyles";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LoginPage(){
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const {setLogin,setDataStorage,setAccToken,setRefToken,setUser} = useAuth();
    const login = async () => {
        const res = await fetch('http://192.168.1.4/api/token',
                    {body:JSON.stringify({email,password}),method:'POST',headers:{'Content-Type': 'application/json'}})
        if (res.status == 200) {
            const data = await res.json();
            setDataStorage("access-token",data['access'])
            setAccToken(data['access'])
            setDataStorage("refresh-token",data['refresh'])
            setRefToken(data['refresh'])
            setDataStorage("user",JSON.stringify(data['user']))
            setUser(data['user'])
            setLogin(true)
            console.log("giriş başarılı")
        }
        else {
            alert("Giriş başarılı olmadı")
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.mainContainer}>
                    <View style={styles.loginArea}>
                        <View style={styles.loginTitleRow}>
                            <Image source={require('../assets/logo.png')} style={{width:60,height:60}}/>
                            <Text style={styles.loginTitle}>Wordistan</Text>
                        </View>
                        <Text style={styles.loginTitleSmall}>Translate, add your dictionary and start to learn!</Text>
                        <View style={styles.inputLabelRow}>
                            <MaterialIcons name="email" size={18} color="#b565f5" />
                            <Text style={styles.inputLabel}>Email: </Text>
                        </View>
                        <TextInput style={styles.textInput} autoCapitalize="none" placeholder="email@example.com" 
                        onChangeText={(value) => setEmail(value)}/>
                        <View style={styles.inputLabelRow}>
                            <MaterialIcons name="vpn-key" size={18} color="#b565f5"/>
                            <Text style={styles.inputLabel}>Password: </Text>
                        </View>
                        <TextInput style={styles.textInput} autoCapitalize="none" placeholder="Password" 
                        onChangeText={(value)=>setPassword(value)}/>
                        <TouchableOpacity onPress={login} style={styles.loginButton}>
                            <Text style={{color:'white',fontWeight:'900'}}>Login</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:12,marginTop:20}}>Don't you have an account ? </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}