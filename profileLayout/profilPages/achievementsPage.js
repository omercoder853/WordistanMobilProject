import { View, Text, ImageBackground, Dimensions, FlatList,StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from '@expo/vector-icons/Ionicons';
import Achievement from "./achievement";
import { useAchievements } from "../../contextapis/AchievementsContext";
import { useUserStats } from "../../contextapis/UserStatsContext";

export default function Achievements() {
    const { achievements, isAlreadyEarned } = useAchievements();
    const { userStats, pendingSavedWords, pendingTranslated, pendingDictCreated } = useUserStats();
    const { t } = useTranslation();
    const { width: screenWidth } = Dimensions.get('window');

    const getProgress = (ach) => {
        const currentSaved = (userStats?.saved_words || 0) + (pendingSavedWords || 0);
        const currentTranslated = (userStats?.translated_words || 0) + (pendingTranslated || 0);
        const currentDicts = (userStats?.dict_created || userStats?.created_dicts || 0) + (pendingDictCreated || 0);

        if (ach.target_field === 'saved_words') return currentSaved;
        if (ach.target_field === 'translated_words') return currentTranslated;
        if (ach.target_field === 'dict_created' || ach.target_field === 'created_dicts' || ach.target_field === 'dict_created_count') return currentDicts;
        return (userStats?.[ach.target_field] || 0);
    };

    const counts = (achievements || []).reduce((acc, ach) => {
        const progress = getProgress(ach);
        const isEarned = (isAlreadyEarned && isAlreadyEarned(ach.id)) || (ach.target_value && progress >= ach.target_value);
        if (isEarned && ach.type) {
            const typeKey = ach.type.toLowerCase();
            acc[typeKey] = (acc[typeKey] || 0) + 1;
        }
        return acc;
    }, { bronze: 0, silver: 0, gold: 0 });

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.achievementSumMainContainer}>
                <Text style={styles.achievementSumTitle}>{t("achievementSummary")}</Text>
                <View style={styles.achievementSumContainer}>
                    <ImageBackground style={styles.achievementSumCover}
                        resizeMode="contain" imageStyle={{ resizeMode: 'contain' }}
                        source={require("../../assets/achievement_images/bronze.png")}>
                        <Text style={styles.achievementCount}>{counts.bronze || 0}</Text>
                    </ImageBackground>
                    <ImageBackground style={styles.achievementSumCover}
                        resizeMode="contain" imageStyle={{ resizeMode: 'contain' }}
                        source={require("../../assets/achievement_images/silver.png")}>
                        <Text style={[styles.achievementCount, { top: '28%' }]}>{counts.silver || 0}</Text>
                    </ImageBackground>
                    <ImageBackground style={styles.achievementSumCover}
                        resizeMode="contain" imageStyle={{ resizeMode: 'contain' }}
                        source={require("../../assets/achievement_images/gold.png")}>
                        <Text style={styles.achievementCount}>{counts.gold || 0}</Text>
                    </ImageBackground>
                </View>
            </View>
            <View style={{ flexDirection: 'row', width: '90%', marginTop: 15, alignItems: 'center' }}>
                <Text style={styles.mainTitle}>{t("achievements")}</Text>
                <Ionicons style={{ marginLeft: 'auto' }} name="filter-sharp" size={screenWidth * 0.07} color="black" />
            </View>
            <View style={{ borderWidth: 1, borderColor: '#E0E0E0', width: '90%', marginVertical: 10 }}></View>
            <FlatList
                data={achievements}
                keyExtractor={(item) => item.id?.toString()}
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 20, alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
                renderItem={({ item }) => {
                    const progress = getProgress(item);
                    const isEarned = (isAlreadyEarned && isAlreadyEarned(item.id)) || (item.target_value && progress >= item.target_value);
                    return <Achievement ach={item} isEarned={isEarned} />;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    achievementSumMainContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        paddingTop: 5
    },
    achievementSumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '95%',
        alignItems: 'center',
    },
    achievementSumCover: {
        flex: 1,
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    achievementCount: {
        position: 'absolute',
        top: '30%',
        width: '50%',
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '900',
        color: 'white',
    },
    achievementSumTitle: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center'
    },
    mainTitle: {
        fontSize: 25,
    }
})