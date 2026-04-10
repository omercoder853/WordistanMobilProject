import { View, Text, Image } from "react-native"
import styles from "../profileStyle/achievementsStyle"
import ProgressBar from "../../commonComponents/progressBar/progressBar";
import { useTranslation } from "react-i18next";

export default function Achievement({ach,isEarned}) {
    const {t} = useTranslation();
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
                {isEarned ? <ProgressBar percantage={100}/>:<ProgressBar progress={6} totalProgress={12}/>}
            </View>
        </View>
    )
}