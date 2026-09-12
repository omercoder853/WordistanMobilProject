import React, { memo } from "react";
import { View, Text, Switch } from "react-native";
import styles from "../styles/styles";
import { useTranslation } from "react-i18next";

function WcSettings({ visibleFirstLetter, setVisibleFirstLetter }) {
    const { t } = useTranslation();
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

export default memo(WcSettings);
