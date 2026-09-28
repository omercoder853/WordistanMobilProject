import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles/styles";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Step1Personal({ formData, updateFormField }) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const aColors = colors.auth;

    const [showDatePicker, setShowDatePicker] = useState(false);

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 12);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 80);

    const name = formData?.first_name || "";
    const surname = formData?.last_name || "";
    const date = formData?.birth_date ? new Date(formData.birth_date) : maxDate;
    const gender = formData?.gender || null;

    const genderOptions = [
        { label: t("male"), value: "male", icon: "male" },
        { label: t("female"), value: "female", icon: "female" },
        { label: t("other"), value: "other", icon: "male-female" },
    ];

    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ]{3,}(\s[a-zA-ZğüşıöçĞÜŞİÖÇ]{2,})*$/;
    const validName = nameRegex.test(name.trim());
    const validSurname = nameRegex.test(surname.trim());

    const onDateChange = (selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate?.nativeEvent?.timestamp) {
            const currentDate = new Date(selectedDate.nativeEvent.timestamp);
            updateFormField("birth_date", currentDate.toISOString().split("T")[0]);
        }
    };

    return (
        <View style={{ width: "100%" }}>
            <Text style={[styles.titleText, { color: aColors.title }]}>{t("whosJoiningUs")}</Text>

            {/* First Name */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="person" size={15} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("firstName")}</Text>
            </View>
            <TextInput 
                autoCapitalize="words" 
                onChangeText={(value) => updateFormField("first_name", value)}
                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                placeholder={t("yourName")} 
                placeholderTextColor={aColors.placeholder}
                value={name} 
            />
            {!validName && name.length > 0 && (
                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t("validNameWarning")}</Text>
            )}

            {/* Surname */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="person" size={15} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("surname")}</Text>
            </View>
            <TextInput 
                autoCapitalize="words" 
                onChangeText={(value) => updateFormField("last_name", value)}
                style={[styles.inputArea, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, color: aColors.inputText }]} 
                placeholder={t("yourSurname")} 
                placeholderTextColor={aColors.placeholder}
                value={surname} 
            />
            {!validSurname && surname.length > 0 && (
                <Text style={[styles.warningText, { color: aColors.errorText }]}>{t("validSurnameWarning")}</Text>
            )}

            {/* Birth Date */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <FontAwesome name="birthday-cake" size={16} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("birthDate")}</Text>
            </View>
            <TouchableOpacity 
                style={[styles.dateInput, { backgroundColor: aColors.inputBg, borderColor: aColors.inputBorder, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]} 
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
            >
                <Text style={{ color: aColors.inputText }}>{date.toLocaleDateString()}</Text>
                <FontAwesome name="calendar" size={15} color={aColors.inputIcon} />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker 
                    value={date} 
                    mode="date" 
                    display="default"
                    onChange={onDateChange} 
                    minimumDate={minDate} 
                    maximumDate={maxDate} 
                />
            )}

            {/* Gender Segment Buttons */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                <Ionicons name="people" size={16} color={aColors.inputIcon} />
                <Text style={[styles.inputLabel, { color: aColors.label }]}>{t("gender")}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8, marginBottom: 12 }}>
                {genderOptions.map((item) => {
                    const isSelected = gender === item.value;
                    return (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => updateFormField("gender", item.value)}
                            activeOpacity={0.7}
                            style={{
                                flex: 1,
                                paddingVertical: 11,
                                borderRadius: 10,
                                borderWidth: 1.5,
                                borderColor: isSelected ? aColors.chipActiveBg : aColors.chipInactiveBorder,
                                backgroundColor: isSelected ? aColors.chipActiveBg : aColors.chipInactiveBg,
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "row",
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
                                fontWeight: isSelected ? "700" : "600",
                                color: isSelected ? aColors.chipActiveText : aColors.chipInactiveText,
                            }}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
