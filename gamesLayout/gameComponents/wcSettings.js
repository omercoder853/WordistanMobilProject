import { View, Text, Switch } from "react-native";
import styles from "../gameStyles/styles";
import { useGame } from "../../contextapis/GamesContext";
import { useTranslation } from "react-i18next";

export default function WcSettings() {
    const { t } = useTranslation();
    const { visibleFirstLetter, setVisibleFirstLetter } = useGame();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
            <Text style={[styles.setupOptionLabel, { flex: 1, marginBottom: 0, marginTop: 0 }]}>
                {t('visibleFirstLetter')}
            </Text>
            <Switch
                trackColor={{ false: "#E2E8F0", true: "#5B3FD3" }}
                thumbColor="#FFFFFF"
                onValueChange={() => setVisibleFirstLetter(!visibleFirstLetter)}
                value={visibleFirstLetter}
            />
        </View>
    );
}