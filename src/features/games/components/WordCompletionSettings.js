import React, { memo } from "react";
import { View, Text, Switch } from "react-native";
import styles from "../styles/styles";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

function WcSettings({ visibleFirstLetter, setVisibleFirstLetter }) {
    const { t } = useTranslation();
    const { colors, isDark } = useTheme();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
            <Text style={[styles.setupOptionLabel, { flex: 1, marginBottom: 0, marginTop: 0, color: colors.games.textPrimary }]}>
                {t('visibleFirstLetter')}
            </Text>
            <Switch
                trackColor={{ false: isDark ? "#333544" : "#E2E8F0", true: colors.common.primary }}
                thumbColor="#FFFFFF"
                onValueChange={() => setVisibleFirstLetter(!visibleFirstLetter)}
                value={visibleFirstLetter}
            />
        </View>
    );
}

export default memo(WcSettings);
