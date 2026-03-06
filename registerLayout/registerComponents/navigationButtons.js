import { View,TouchableOpacity,Text,ActivityIndicator,Alert } from "react-native";
import styles from "../registerStyles/styles";
import { useRoute,useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contextapis/AuthContext";

export default function NavigationButtons({anyError,data}){
    const {registerData,setRegisterData,register,registerLoading} = useAuth();
    const pages = ["Login","Personal Info","Preferences","Entry Info"]
    const route = useRoute();
    const navigation = useNavigation();
    const currentPage = route.name
    const currentIndex = pages.indexOf(currentPage)
    const isFirst = currentPage === "Personal Info"
    const isLast = currentPage === "Entry Info"
    const currentData = {...registerData,...data}

    const nextPage = () => {
        if (!anyError && data!=null) {
            console.log("Gelen data:",data)
            setRegisterData((prev)=>({
                ...prev,
                ...data
            }));
            console.log("Kaydedilen data:",registerData)
            const nextScreen = pages[currentIndex+1]
            navigation.navigate(nextScreen)
        } 
    }
    const registerButton = async () => {
        const status = await register(currentData)
        if (status == 201) {
            Alert.alert("You are all set!" , "We're taking you to the login page to get started.",[{
                text:'Login' , onPress:()=>navigation.navigate("Login") , 
            }])
        }
        else{
            Alert.alert("Oops!","Something went wrong. Let's get you back in!",[{
                text:'Cancel',style:'cancel'
            }])
        }
    }
    const backPage = () => {
        const backScreen = pages[currentIndex-1]
        navigation.navigate(backScreen)
    }
    
    return(
        <View style={styles.buttonsArea}>
            <TouchableOpacity onPress={backPage} style={styles.navigationButton}>
                <Text style={{color:'white',fontWeight:'900'}}>{isFirst?"Login Page":"Back"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={isLast ? registerButton:nextPage} style={[styles.navigationButton,{marginLeft:'auto'}]}>
                {registerLoading ? (<ActivityIndicator/>):(<Text style={{color:'white',fontWeight:'900',fontSize:15}}>{isLast ? "Create Account":"Next"}</Text>)}
            </TouchableOpacity>
        </View>
    )
}