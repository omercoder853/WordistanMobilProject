import { View,TouchableOpacity,TouchableWithoutFeedback,Keyboard,
    Platform,TextInput,Text,KeyboardAvoidingView,Modal } from "react-native";
import alertStyles from "../../commonComponents/customAlert/customAlertStyle";
import dictStyles from "../../dictionariesLayout/DictionariesStyles/dictStyles"
import styles from "../translateStyles/transStyles";
import DropDownPicker from "react-native-dropdown-picker";
import { useState,useEffect } from "react";
import {useDictionary} from "../../contextapis/DictContext"
import CustomAlert from "../../commonComponents/customAlert/customAlert"

export default function AddDictPage({visible,input,result,setVisible,from}){
    const [open,setOpen] = useState(false)
    const [value,setValue] = useState(null)
    const {dicts,setDictReload,setFocus,saveWord} = useDictionary();
    const [success,setSuccess] = useState(false)
    const [fail,setFail] = useState(false)

    useEffect(()=>{
        setDictReload(true),
        setFocus(true)
    },[])

    const filteredDicts = dicts.filter((dict)=>dict.language.slice(0,2) == from)
    const items = filteredDicts.map((dict) => ({
        label: dict.name,
        value: dict.id
    }));

    const saveButton = async () => {
        console.log("tıklandı")
        const status = await saveWord({word:input,meaning:result,dict_id:value});
        console.log("Status",status)
        if (status) {
            setSuccess(true)
            setFail(false)
        }
        else{
            setFail(true)
            setSuccess(false)
        }
    }

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <View style={alertStyles.overlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"}>
                        <View style={[alertStyles.alertBox,{alignItems:'flex-start'}]}>
                            <Text style={dictStyles.addDictTitle}>Add to Your Dictionary</Text>
                            <Text style={dictStyles.addDictLabel}>Word:</Text>
                            <TextInput style={dictStyles.addDictInput} value={input} editable={false}/>
                            <Text style={dictStyles.addDictLabel}>Meaning:</Text>
                            <TextInput style={dictStyles.addDictInput} value={result} editable={false}/>
                            <Text style={dictStyles.addDictLabel}>Choose One of Your Dictionary:</Text>
                            <DropDownPicker
                            style={{marginBottom:25}}
                            open={open}
                            setOpen={setOpen}
                            items={items}
                            value={value}
                            setValue={setValue}
                            placeholder="Select a dictionary" />
                            <View style={alertStyles.buttonContainer}>
                                <TouchableOpacity style={alertStyles.cancel} onPress={()=>setVisible(false)}>
                                    <Text style={{color:'white',fontWeight:'600'}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={alertStyles.success} onPress={saveButton}>
                                    <Text style={{color:'white',fontWeight:'900'}}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    <CustomAlert visible={success} 
                    title="Word Added" 
                    message="We have just added the word into your dictionary successfully!" 
                    buttons={[{text:"Got it!" ,style:"success",action:()=>{setSuccess(false),setVisible(false)}}]}/>
                    <CustomAlert visible={fail} title="Ooops.." 
                    message="Something went wrong. Sorry about that" 
                    buttons={[{text:"Cancel",style:"danger",action:()=>setFail(false)}]}/>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}