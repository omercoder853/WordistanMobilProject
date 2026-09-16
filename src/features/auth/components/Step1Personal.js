import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useEffect } from "react";
import styles from "../styles/styles";
import LogoArea from "./RegisterHeader";
import NavigationButtons from "./NavigationButtons";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/contextapis/AuthContext";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Step1Personal() {
    const { registerData } = useAuth();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const aColors = colors.auth;

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 12);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 80);
    const [date, setDate] = useState(registerData["birth_date"] ? new Date(registerData["birth_date"]) : maxDate);
    const [show, setShow] = useState(false);
    const [name, setName] = useState(registerData["first_name"] || "");
    const [surname, setSurname] = useState(registerData["last_name"] || "");
    const [error, setError] = useState(true);
    const [gender, setGender] = useState(registerData["gender"] || null);

    const genderOptions = [
        { label: t("male"), value: "male", icon: "male" },
        { label: t("female"), value: "female", icon: "female" },
        { label: t("other"), value: "other", icon: "male-female" },
    ];

    const onChange = (selectedDate) => {
        setShow(false);
        if (selectedDate) {
            const currentDate = new Date(selectedDate["nativeEvent"]["timestamp"]);
            setDate(currentDate);
        }
    };
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ]{3,}(\s[a-zA-ZğüşıöçĞÜŞİÖÇ]{2,})*$/;
    const validName = nameRegex.test(name.trim());
    const validSurname = nameRegex.test(surname.trim());
    const isFormValid = validName && validSurname && date && gender;

    const data = isFormValid ? {
        "first_name": name.trim(),
        "last_name": surname.trim(),
        "birth_date": date.toISOString().split('T')[0],
        "gender": gender
    } : null;

    useEffect(() => {
        if (isFormValid) {
            setError(false);
        } else {
            setError(true);
        }
    }, [isFormValid]);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                    <View style={[styles.mainContainer, { backgroundColor: aColors.cardBg, borderColor: aColors.cardBorder }]}>
                        <LogoArea />
                        <Text style={[styles.titleText, { color: aColors.title }]}>{t('whosJoiningUs')}</Text>
                        <View>
                            {/* First Name */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name="person" size={15} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('firstName')}</Text>
                            </View>
                            <TextInput 
                                autoCapitalize="words" 
                                onChangeText={(value) => setName(value)}
                                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                                placeholder={t('yourName')} 
                                placeholderTextColor={aColors.placeholder}
                                value={name} 
                            />
                            {!validName && name.length > 0 && (
                                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t('validNameWarning')}</Text>
                            )}

                            {/* Surname */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name="person" size={15} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('surname')}</Text>
                            </View>
                            <TextInput 
                                autoCapitalize="words" 
                                onChangeText={(value) => setSurname(value)}
                                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                                placeholder={t('yourSurname')} 
                                placeholderTextColor={aColors.placeholder}
                                value={surname} 
                            />
                            {!validSurname && surname.length > 0 && (
                                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t('validSurnameWarning')}</Text>
                            )}

                            {/* Birth Date */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <FontAwesome name="birthday-cake" size={16} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('birthDate')}</Text>
                            </View>
                            <TouchableOpacity 
                                style={[styles.dateInput, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]} 
                                onPress={() => setShow(true)}
                                activeOpacity={0.7}
                            >
                                <Text style={{ color: aColors.inputText }}>{date.toLocaleDateString()}</Text>
                                <FontAwesome name="calendar" size={15} color={aColors.inputIcon} />
                            </TouchableOpacity>
                            {show && (
                                <DateTimePicker 
                                    value={date} 
                                    mode="date" 
                                    display="default"
                                    onChange={onChange} 
                                    minimumDate={minDate} 
                                    maximumDate={maxDate} 
                                />
                            )}

                            {/* Gender Segment Buttons */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                <Ionicons name="people" size={16} color={aColors.inputIcon} />
                                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t('gender')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 20 }}>
                                {genderOptions.map((item) => {
                                    const isSelected = gender === item.value;
                                    return (
                                        <TouchableOpacity
                                            key={item.value}
                                            onPress={() => setGender(item.value)}
                                            activeOpacity={0.7}
                                            style={{
                                                flex: 1,
                                                paddingVertical: 11,
                                                borderRadius: 10,
                                                borderWidth: 1.5,
                                                borderColor: isSelected ? aColors.chipActiveBg : aColors.chipInactiveBorder,
                                                backgroundColor: isSelected ? aColors.chipActiveBg : aColors.chipInactiveBg,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'row',
                                                gap: 5,
                                            }}
                                        >
                                            <Ionicons 
                                                name={item.icon} 
                                                size={15} 
                                                color={isSelected ? aColors.chipActiveText : aColors.chipInactiveText} 
                                            />
                                            <Text style={{
                                                fontSize: 12.5,
                                                fontWeight: isSelected ? '700' : '600',
                                                color: isSelected ? aColors.chipActiveText : aColors.chipInactiveText,
                                            }}>
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <NavigationButtons anyError={error} data={data} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
