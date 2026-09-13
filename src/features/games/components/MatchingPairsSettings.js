import React, { memo } from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles";
import NumericInput from "./NumericInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

function MpSettings({ perPage, setPerPage }) {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <View>
            <Text style={[styles.setupOptionLabel, { color: colors.games.textPrimary }]}>{t('questionsPerPage')}</Text>
            <NumericInput minValue={3} maxValue={5} value={perPage} setValue={setPerPage} quantity={t('qQuestionsPerPage') || "per page"} />
        </View>
    );
}

export default memo(MpSettings);
