import { View, Text, Image } from "react-native"
import styles from "../profileStyle/achievementsStyle"
import ProgressBar from "../../commonComponents/progressBar/progressBar";
import { useTranslation } from "react-i18next";
import { useUserStats } from "../../contextapis/UserStatsContext";

export default function Achievement({ach,isEarned}) {
    const {t} = useTranslation();
    const {saved_words,translated_words} = useUserStats();
    const progressList = {translated_words,saved_words}
    return (
        <View style={styles.achievementRow}>
            {!isEarned &&
                <View style={styles.lockOverlay}>
                    <Text style={{ fontSize: 25 }}>🔒</Text>
                </View>}
            <Image style={styles.achievementImage} source={ach.image}/>
            <View style={{ marginLeft: 10, flex: 1, justifyContent: 'center', marginRight: 10 }}>
                <Text style={styles.achievementTitle}>{t(ach.id)}</Text>
                <Text style={styles.achievementDec}>{t(`${ach.id}_desc`)}</Text>
                {isEarned ? <ProgressBar percantage={100}/>:<ProgressBar progress={progressList[ach.requirementField] || 0} totalProgress={ach.requirementValue}/>}
            </View>
        </View>
    )
}