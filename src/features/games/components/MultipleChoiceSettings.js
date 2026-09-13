import React, { memo } from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles";
import NumericInput from "./NumericInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

function McqSettings({ numberOptions, setnumberOptions }) {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <View>
            <Text style={[styles.setupOptionLabel, { color: colors.games.textPrimary }]}>{t('numberOfOptions')}</Text>
            <NumericInput minValue={3} maxValue={6} value={numberOptions} setValue={setnumberOptions} quantity={t('qOptions') || "options"} />
        </View>
    );
}

export default memo(McqSettings);
