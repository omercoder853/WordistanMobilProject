import { View, Text, Image } from "react-native";
import { useTranslation } from 'react-i18next';
import { useTheme } from "@/contextapis/ThemeContext";

export default function LogoArea() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    return (
        <View style={{ flexDirection: 'row', marginBottom: 25, alignItems: 'center' }}>
            <Image style={{ width: 60, height: 60 }} source={require("@/shared/assets/logo.png")} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.auth.title }}>{t('wordistan')}</Text>
        </View>
    )
}