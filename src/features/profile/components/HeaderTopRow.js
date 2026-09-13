import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import styles from "../styles/styles";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function HeaderTopRow() {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.headerTopRow}>
            <TouchableOpacity style={[styles.headerRowButtons, { backgroundColor: isDark ? colors.common.surface : 'white' }]}>
                <Feather name="share-2" size={24} color={colors.profile.textPrimary} />
            </TouchableOpacity>
            <View style={[styles.subscriptionArea, { backgroundColor: isDark ? colors.common.surface : 'white' }]}>
                <MaterialCommunityIcons name="star-four-points" size={12} color="#8B5CF6" />
                <Text style={{ color: '#8B5CF6', fontWeight: '500' }}>{t('premium')}</Text>
            </View>
            <TouchableOpacity style={[styles.headerRowButtons, { backgroundColor: isDark ? colors.common.surface : 'white' }]}>
                <Ionicons name="settings-outline" size={24} color={colors.profile.textPrimary} />
            </TouchableOpacity>
        </View>
    );
}
