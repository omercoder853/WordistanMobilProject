import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Entypo } from '@expo/vector-icons';
import styles from "../styles/styles";
import { useNavigation } from "@react-navigation/native";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contextapis/AuthContext";
import { useTheme } from "@/contextapis/ThemeContext";

export default function ConsoleButton({ item }) {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { logout } = useAuth();
    const { colors, isDark } = useTheme();
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();

    function handleLogout() {
        setAlertTitle(t('warning'));
        setAlertMessage(t('logoutWarning'));
        addAlertButton({ text: t('cancel'), style: "cancel", action: () => hideAlert() });
        addAlertButton({ text: t('exit'), style: "danger", action: logout });
        setAlertVisible(true);
    }

    const isLogout = item.name === "Logout";

    return (
        <TouchableOpacity onPress={isLogout ? handleLogout : () => navigation.navigate("Profile Navigation", { screen: item.name })}>
            <View style={[styles.consoleButton, isLogout && { borderColor: 'red', borderWidth: 1 }]}>
                <View style={{ backgroundColor: isDark ? colors.common.surface : 'white', padding: 6, borderRadius: 16, marginHorizontal: 10 }}>
                    <Ionicons name={item.icon} size={25} color={isLogout ? "red" : colors.profile.textPrimary} />
                </View>
                <Text style={isLogout ? { color: 'red' } : { color: colors.profile.textPrimary, fontWeight: '600' }}>{item.label || item.name}</Text>
                <Entypo style={{ marginLeft: 'auto', marginRight: 10 }} name="chevron-small-right" size={30} color={isLogout ? "red" : colors.profile.textSecondary} />
            </View>
        </TouchableOpacity>
    );
}