import {View,TouchableOpacity,TextInput,Text} from "react-native"
import styles from "../gameStyles/styles"
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";

export default function NumericInput({minValue,maxValue,setValue,value,quantity}){
    const [error,setError] = useState(false)
    const increaseValue = () => {
        if (value!=maxValue) {
            setValue(value+1)
        }
    }
    const decreaseValue = () => {
        if (value!=minValue) {
            setValue(value-1)
        }
    }
    const changeValue = (value) => {
        const cleaned = parseInt(value.replace(/[^0-9]/g, '')) || 0;
        setValue(cleaned)
    }
    const checkValue = ()=>{
        if (value>maxValue) {
            setValue(maxValue)
            setError(true)
            setTimeout(()=>setError(false),2000)
            return
        }
        else if (value<minValue){
            setValue(minValue)
            setError(true)
            setTimeout(()=>setError(false),2000)
            return
        }
    }
    return (
        <View>
            <View style={styles.inputRow}>
                <TextInput style={styles.numericInput} value={value.toString()+ " " + quantity} keyboardType="numeric" 
                onChangeText={(value)=>changeValue(value)} onBlur={checkValue} 
                selection={{start: value.toString().length,end: value.toString().length}}/>
                <TouchableOpacity style={styles.decreaseButton} onPress={decreaseValue}>
                    <Feather name="minus" size={24} color="white" /></TouchableOpacity>
                <TouchableOpacity style={styles.increaseButton} onPress={increaseValue}>
                    <Feather name="plus" size={24} color="white" /></TouchableOpacity>
            </View>
            {error && <Text style={{color:'red',marginTop:2}}>* The value must between {minValue} and {maxValue}</Text> }
        </View>
    )
}