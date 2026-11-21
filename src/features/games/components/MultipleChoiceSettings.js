import React, { memo } from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles";
import NumericInput from "./NumericInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

function McqSettings({ numberOptions, setnumberOptions,numberQuestions }) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const max = Math.min(6,numberQuestions-1)

    return (
        <View>
            <Text style={[styles.setupOptionLabel, { color: colors.games.textPrimary }]}>{t('numberOfOptions')}</Text>
            <NumericInput minValue={2} maxValue={max} value={numberOptions} setValue={setnumberOptions} quantity={t('qOptions') || "options"} />
        </View>
    );
}

export default memo(McqSettings);
