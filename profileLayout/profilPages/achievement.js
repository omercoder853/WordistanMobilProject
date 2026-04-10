import { View, Text, Image } from "react-native"
import styles from "../profileStyle/achievementsStyle"
import ProgressBar from "../../commonComponents/progressBar/progressBar";
import { useAuth } from "../../contextapis/AuthContext"

export default function Achievement({ach,isEarned }) {
    return (
        <View style={styles.achievementRow}>
            {!isEarned &&
                <View style={styles.lockOverlay}>
                    <Text style={{ fontSize: 25 }}>🔒</Text>
                </View>}
            <Image style={styles.achievementImage} source={ach.image}/>
            <View style={{ marginLeft: 10, flex: 1, justifyContent: 'center', marginRight: 10 }}>
                <Text style={styles.achievementTitle}>{ach.title}</Text>
                <Text style={styles.achievementDec}>{ach.desc}</Text>
                <ProgressBar progress={70} />
            </View>
        </View>
    )
}