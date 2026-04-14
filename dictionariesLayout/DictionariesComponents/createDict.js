import { View,Modal,TextInput,Text,TouchableOpacity,TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView } from "react-native";
import styles from "../DictionariesStyles/dictStyles";
import alertStyle from "../../commonComponents/customAlert/customAlertStyle";
import { useState } from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useDictionary } from "../../contextapis/DictContext";
import CustomAlert from "../../commonComponents/customAlert/customAlert"
import { useTranslation } from "react-i18next";

export default function CreateDictionary({visible,setVisible}){
    const { t } = useTranslation();
    const [dictName,setDictName] = useState("");
    const [dictDesc,setDictDesc] = useState("");
    const [dictLang,setDictLang] = useState("TR to ENG")
    const {createDictionary} = useDictionary();
    const [success,setSuccess] = useState(false)
    const [fail,setFail] = useState(false)

    const createButton = async () => {
        if (dictName!="" && dictDesc!="") {
            const status = await createDictionary({name:dictName,description:dictDesc,language:dictLang});
            if (status===201) {
                setSuccess(true)
                setFail(false)
            }
            else{
                setFail(true)
                setSuccess(false)
            }
        }
    }

    return (
        <Modal visible={visible} statusBarTranslucent={true} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
                <View style={alertStyle.overlay} >
                    <KeyboardAvoidingView >
                        <View style={[alertStyle.alertBox,{alignItems:'flex-start'}]}>
                            <Text style={styles.addDictTitle}>{t('createNewDictionary')}</Text>
                            <Text style={styles.addDictLabel}>{t('dictionaryName')}</Text>
                            <TextInput placeholder={t('enterName')} 
                            style={styles.addDictInput}
                            onChangeText={(value)=>setDictName(value.trim())}/>
                            <Text style={styles.addDictLabel}>{t('dictionaryDescription')}</Text>  
                            <TextInput placeholder={t('enterShortDescription')} 
                            style={styles.addDictInput}
                            onChangeText={(value)=>setDictDesc(value.trim())}/>
                            <Text style={styles.addDictLabel}>{t('dictionaryLanguage')}</Text>
                            <View style={[alertStyle.buttonContainer,{marginBottom:25}]}>
                                <TouchableOpacity onPress={()=>setDictLang("TR to ENG")} style={[styles.dictLangButton , dictLang=="ENG to TR" && {backgroundColor:'white'}]}>
                                    <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
                                        <Text style={dictLang=="ENG to TR" ? {color:"#6b3fa0"}:{color:"white"}}>{t('tr')}</Text>
                                        <FontAwesome5 name="long-arrow-alt-right" size={24} color={dictLang=="ENG to TR" ? "#6b3fa0":"white"} />
                                        <Text style={dictLang=="ENG to TR" ? {color:"#6b3fa0"}:{color:"white"}}>{t('eng')}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>setDictLang("ENG to TR")} style={[styles.dictLangButton , dictLang=="TR to ENG" && {backgroundColor:'white'}]}>
                                    <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
                                        <Text style={dictLang=="TR to ENG" ? {color:"#6b3fa0"}:{color:"white"}}>{t('eng')}</Text>
                                        <FontAwesome5 name="long-arrow-alt-right" size={24} color={dictLang=="TR to ENG" ? "#6b3fa0":"white"} />
                                        <Text style={dictLang=="TR to ENG" ? {color:"#6b3fa0"}:{color:"white"}}>{t('tr')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={alertStyle.buttonContainer}>
                                <TouchableOpacity style={alertStyle.cancel} onPress={()=>setVisible(false)}>
                                    <Text style={{fontWeight:'700',color:'white'}}>{t('cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={alertStyle.success} onPress={createButton}>
                                    <Text style={{fontWeight:'700',color:'white'}}>{t('create')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                    <CustomAlert visible={success} 
                    title={t('dictionaryCreated')} 
                    message={t("dictionaryCreatedSuccessfully")} 
                    buttons={[{text:t("ok") ,style:"success",action:()=>{setSuccess(false),setVisible(false)}}]}/>
                    <CustomAlert visible={fail} title={t('ooops')} 
                    message="Something went wrong. Sorry about that" 
                    buttons={[{text:t('cancel'),style:"danger",action:()=>setFail(false)}]}/>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}