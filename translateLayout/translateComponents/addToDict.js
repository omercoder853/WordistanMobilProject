import { View,TouchableOpacity,TouchableWithoutFeedback,Keyboard,
    Platform,TextInput,Text,KeyboardAvoidingView,Modal } from "react-native";
import alertStyles from "../../commonComponents/customAlert/customAlertStyle";
import dictStyles from "../../dictionariesLayout/DictionariesStyles/dictStyles"
import styles from "../translateStyles/transStyles";
import DropDownPicker from "react-native-dropdown-picker";
import { useState,useEffect } from "react";
import {useDictionary} from "../../contextapis/DictContext"
import CustomAlert from "../../commonComponents/customAlert/customAlert"
import { useTranslation } from "react-i18next";

export default function AddDictPage({visible,input,result,setVisible,from}){
    const { t } = useTranslation();
    const [open,setOpen] = useState(false)
    const [value,setValue] = useState(null)
    const {dicts,setDictReload,saveWord} = useDictionary();
    const [success,setSuccess] = useState(false)
    const [fail,setFail] = useState(false)

    useEffect(()=>{
        setDictReload(true)
    },[])

    const filteredDicts = dicts.filter((dict)=>dict.language.slice(0,2) == from)
    const items = filteredDicts.map((dict) => ({
        label: dict.name,
        value: dict.id
    }));

    const saveButton = async () => {
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
        <Modal visible={visible} statusBarTranslucent={true} animationType="fade" transparent>
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <View style={alertStyles.overlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"}>
                        <View style={[alertStyles.alertBox,{alignItems:'flex-start'}]}>
                            <Text style={dictStyles.addDictTitle}>{t('addToYourDictionary')}</Text>
                            <Text style={dictStyles.addDictLabel}>{t('wordLabel')}</Text>
                            <TextInput style={dictStyles.addDictInput} value={input} editable={false}/>
                            <Text style={dictStyles.addDictLabel}>{t('meaningLabel')}</Text>
                            <TextInput style={dictStyles.addDictInput} value={result} editable={false}/>
                            <Text style={dictStyles.addDictLabel}>{t('chooseOneOfYourDictionary')}</Text>
                            <DropDownPicker
                            style={{marginBottom:25}}
                            open={open}
                            setOpen={setOpen}
                            items={items}
                            value={value}
                            setValue={setValue}
                            placeholder={t('selectDictionary')} />
                            <View style={alertStyles.buttonContainer}>
                                <TouchableOpacity style={alertStyles.cancel} onPress={()=>setVisible(false)}>
                                    <Text style={{color:'white',fontWeight:'600'}}>{t('cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={alertStyles.success} onPress={saveButton}>
                                    <Text style={{color:'white',fontWeight:'900'}}>{t('add')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    <CustomAlert visible={success} 
                    title={t('wordAdded')} 
                    message={t("wordAddedSuccessfully")} 
                    buttons={[{text:t("ok") ,style:"success",action:()=>{setSuccess(false),setVisible(false)}}]}/>
                    <CustomAlert visible={fail} title={t('ooops')} 
                    message={t("somethingWentWrong")} 
                    buttons={[{text:t('cancel'),style:"danger",action:()=>setFail(false)}]}/>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}