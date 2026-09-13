import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import * as Animatable from "react-native-animatable";
import { useTheme } from "@/contextapis/ThemeContext";

export default function NoDictionary() {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView loop={false} autoPlay
                source={require("../assets/anim_no_dictionary.json")} style={{ width: '85%', aspectRatio: 1 }} />
            <Animatable.Text animation="fadeIn" duration={1200} delay={500}
                style={{ marginTop: -50, fontSize: 20, color: dColors.textMuted }}>
                {t('libraryOfThousandWords')}
            </Animatable.Text>
            <Animatable.Text animation="fadeIn" duration={1200} delay={500}
                style={{ fontSize: 20, color: dColors.textMuted }}>
                {t('beginsWithSingleDictionary')}
            </Animatable.Text>
        </View>
    );
}