import { View,Text,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,TouchableWithoutFeedback, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState,useEffect } from "react";
import styles from "../registerStyles/styles";
import LogoArea from "./logoArea";
import NavigationButtons from "./navigationButtons";
import {Ionicons,FontAwesome} from '@expo/vector-icons';

export default function PersonalInfoPage(){
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 12)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear()-80)
    const [date, setDate] = useState(maxDate); 
    const [show, setShow] = useState(false);
    const [name,setName] = useState("");
    const [surname,setSurname] = useState("")
    const [error,setError] = useState(true)
    const onChange = (selectedDate) => {
    setShow(false);
    if (selectedDate) {
        const currentDate = new Date(selectedDate["nativeEvent"]["timestamp"])
        setDate(currentDate);
    }};
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ]{3,}(\s[a-zA-ZğüşıöçĞÜŞİÖÇ]{2,})*$/;
    const validName = nameRegex.test(name)
    const validSurname = nameRegex.test(surname)
    const isFormValid = validName && validSurname && date

    const data = isFormValid ? {
            "first_name" : name,
            "last_name" : surname,
            "birth_date":date.toISOString().split('T')[0]
        } : null;

    useEffect(()=>{
        if (isFormValid) {
            setError(false)}
        else
        {
            setError(true)
        }
    },[isFormValid])
    

    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding':'height'} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <View style={styles.mainContainer}>
                    <LogoArea/>
                    <Text style={styles.titleText}>Who's joining us?</Text>
                    <View>
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <Ionicons name="person" size={15} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>First Name:</Text>
                        </View>
                        <TextInput autoCapitalize="words" onChangeText={(value) => setName(value)} style={styles.inputArea} placeholder="Your name"/>
                        {!validName && name.length>0 && <Text style={styles.warningText}>* Enter a valid name!</Text>}
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <Ionicons name="person" size={15} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>Surname:</Text>
                        </View>
                        <TextInput autoCapitalize="words" onChangeText={(value) => setSurname(value)} style={styles.inputArea} placeholder="Your surname"/>
                        {!validSurname && surname.length>0 && <Text style={styles.warningText}>* Enter a valid surname!</Text>}
                        <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
                            <FontAwesome name="birthday-cake" size={18} color="#6b3fa0" />
                            <Text style={styles.inputLabel}>Birth Date:</Text>
                        </View>
                        <TouchableOpacity style={styles.dateInput} onPress={()=>setShow(true)}>
                            <Text>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {show && <DateTimePicker value={date} mode="date" display="default" onChange={onChange} minimumDate={minDate} maximumDate={maxDate}/>}
                        <NavigationButtons anyError={error} data={data}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
