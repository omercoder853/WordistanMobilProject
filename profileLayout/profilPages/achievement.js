import { View, Text, Image, StyleSheet } from "react-native";
import ProgressBar from "../../commonComponents/progressBar/progressBar";
import { useTranslation } from "react-i18next";
import { useUserStats } from "../../contextapis/UserStatsContext";
import { Ionicons } from "@expo/vector-icons";

export default function Achievement({ ach, isEarned }) {
    const { i18n } = useTranslation();
    const { userStats, pendingSavedWords, pendingTranslated, pendingDictCreated } = useUserStats();
    const lang = i18n.language;

    // Target value check: userStats + pending
    const currentSaved = (userStats?.saved_words || 0) + (pendingSavedWords || 0);
    const currentTranslated = (userStats?.translated_words || 0) + (pendingTranslated || 0);
    const currentDicts = (userStats?.dict_created || userStats?.created_dicts || 0) + (pendingDictCreated || 0);

    let currentProgress = 0;
    if (ach.target_field === 'saved_words') {
        currentProgress = currentSaved;
    } else if (ach.target_field === 'translated_words') {
        currentProgress = currentTranslated;
    } else if (ach.target_field === 'dict_created') {
        currentProgress = currentDicts;
    } else {
        currentProgress = (userStats?.[ach.target_field] || 0);
    }

    const earned = isEarned || (ach.target_value && currentProgress >= ach.target_value);

    // Type badge styling
    const tier = (ach.type || 'bronze').toLowerCase();
    const tierStyles = {
        bronze: { bg: '#FFF7ED', border: '#FDBA74', text: '#C2410C' },
        silver: { bg: '#F8FAFC', border: '#CBD5E1', text: '#475569' },
        gold: { bg: '#FEFCE8', border: '#FDE047', text: '#A16207' },
    }[tier] || { bg: '#FFF7ED', border: '#FDBA74', text: '#C2410C' };

    return (
        <View style={styles.achievementRow}>
            {!earned && (
                <View style={styles.lockOverlay}>
                    <Text style={{ fontSize: 25 }}>🔒</Text>
                </View>
            )}
            <Image style={styles.achievementImage} source={{ uri: ach.icon_url }} />
            <View style={{ marginLeft: 10, flex: 1, justifyContent: 'center', marginRight: 10, paddingVertical: 10 }}>
                <Text style={styles.achievementTitle}>{ach["title_" + lang]}</Text>
                <Text style={styles.achievementDec}>{ach["description_" + lang]}</Text>

                {/* Badges Row: XP Reward & Type */}
                <View style={styles.badgeRow}>
                    {/* XP Reward Badge */}
                    {ach.xp_reward ? (
                        <View style={styles.xpBadge}>
                            <Ionicons name="flash" size={11} color="#7E22CE" style={{ marginRight: 3 }} />
                            <Text style={styles.xpBadgeText}>+{ach.xp_reward} XP</Text>
                        </View>
                    ) : null}

                    {/* Type / Tier Badge */}
                    {ach.type ? (
                        <View style={[styles.tierBadge, { backgroundColor: tierStyles.bg, borderColor: tierStyles.border }]}>
                            <Text style={[styles.tierBadgeText, { color: tierStyles.text }]}>
                                {tier.toUpperCase()}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {earned ? (
                    <ProgressBar percantage={100} />
                ) : (
                    <ProgressBar progress={currentProgress} totalProgress={ach.target_value} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginVertical: 6,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E8FF',
        borderWidth: 1,
        borderColor: '#C084FC',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    xpBadgeText: {
        color: '#7E22CE',
        fontSize: 11,
        fontWeight: '800',
    },
    tierBadge: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    tierBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    achievementImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    achievementRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '92%',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 10,
        elevation: 2,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333'
    },
    achievementDec: {
        color: '#666666',
        fontSize: 12,
        lineHeight: 16
    },
    lockOverlay:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:1000,
        backgroundColor:'rgba(0,0,0,0.4)',
        borderRadius: 15,
    },
});