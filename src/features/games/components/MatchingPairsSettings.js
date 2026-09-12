import React, { memo } from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles";
import NumericInput from "./NumericInput";
import { useTranslation } from "react-i18next";

function MpSettings({ perPage, setPerPage }) {
    const { t } = useTranslation();
    return (
        <View>
            <Text style={styles.setupOptionLabel}>{t('questionsPerPage')}</Text>
            <NumericInput minValue={3} maxValue={5} value={perPage} setValue={setPerPage} quantity={t('qQuestionsPerPage') || "per page"} />
        </View>
    );
}

export default memo(MpSettings);
