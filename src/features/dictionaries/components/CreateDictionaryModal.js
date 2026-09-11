import { View, Modal, TextInput, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import styles from "../styles/DictionaryStyles";
import alertStyle from "@/shared/components/customAlert/customAlertStyle";
import { useState } from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useDictionary } from "../../../contextapis/DictContext";
import { useTranslation } from "react-i18next";

export default function CreateDictionary({ visible, setVisible }) {
    const { t } = useTranslation();
    const [dictName, setDictName] = useState("");
    const [dictDesc, setDictDesc] = useState("");
    const [dictLang, setDictLang] = useState("TR to ENG");
    const [loading, setLoading] = useState(false);
    const { createDictionary } = useDictionary();

    const createButton = async () => {
        if (dictName != "" && dictDesc != "") {
            setLoading(true);
            await createDictionary({ name: dictName, description: dictDesc, language: dictLang });
            setVisible(false);
            setLoading(false);
        }
    }

    return (
        <Modal visible={visible} statusBarTranslucent={true} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={alertStyle.overlay} >
                    <KeyboardAvoidingView >
                        <View style={[alertStyle.alertBox, { alignItems: 'flex-start' }]}>
                            <Text style={styles.addDictTitle}>{t('createNewDictionary')}</Text>
                            <Text style={styles.addDictLabel}>{t('dictionaryName')}</Text>
                            <TextInput placeholder={t('enterName')}
                                style={styles.addDictInput} editable={!loading}
                                onChangeText={(value) => setDictName(value.trim())} />
                            <Text style={styles.addDictLabel}>{t('dictionaryDescription')}</Text>
                            <TextInput placeholder={t('enterShortDescription')}
                                style={styles.addDictInput} editable={!loading}
                                onChangeText={(value) => setDictDesc(value.trim())} />
                            <Text style={styles.addDictLabel}>{t('dictionaryLanguage')}</Text>
                            <View style={[alertStyle.buttonContainer, { marginBottom: 25 }]}>
                                <TouchableOpacity onPress={() => setDictLang("TR to ENG")} disabled={loading}
                                    style={[styles.dictLangButton, dictLang == "ENG to TR" && { backgroundColor: 'white' }]}>
                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                        <Text style={dictLang == "ENG to TR" ? { color: "#6b3fa0" } : { color: "white" }}>{t('tr')}</Text>
                                        <FontAwesome5 name="long-arrow-alt-right" size={24} color={dictLang == "ENG to TR" ? "#6b3fa0" : "white"} />
                                        <Text style={dictLang == "ENG to TR" ? { color: "#6b3fa0" } : { color: "white" }}>{t('eng')}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setDictLang("ENG to TR")} disabled={loading}
                                    style={[styles.dictLangButton, dictLang == "TR to ENG" && { backgroundColor: 'white' }]}>
                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                        <Text style={dictLang == "TR to ENG" ? { color: "#6b3fa0" } : { color: "white" }}>{t('eng')}</Text>
                                        <FontAwesome5 name="long-arrow-alt-right" size={24} color={dictLang == "TR to ENG" ? "#6b3fa0" : "white"} />
                                        <Text style={dictLang == "TR to ENG" ? { color: "#6b3fa0" } : { color: "white" }}>{t('tr')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={alertStyle.buttonContainer}>
                                <TouchableOpacity style={[alertStyle.cancel, loading && alertStyle.cancelDisabled]} onPress={() => setVisible(false)} disabled={loading}>
                                    <Text style={{ fontWeight: '700', color: 'white' }}>{t('cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[alertStyle.success, loading && alertStyle.successDisabled]} onPress={createButton} disabled={loading}>
                                    {loading ? (<ActivityIndicator size="small" color="#fff" />) :
                                        (<Text style={{ fontWeight: '700', color: 'white' }}>{t('create')}</Text>)}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}