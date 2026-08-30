import { View, Modal, Text, TouchableOpacity, Image , ActivityIndicator} from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './newAchievementModalStyle';
import { useUserStats } from '../../contextapis/UserStatsContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {useAchievements} from "../../contextapis/AchievementsContext";

export default function NewAchievement() {
    const { t, i18n } = useTranslation();
    const { newAchievement, setNewAchievement, dismissNewAchievement } = useAchievements();
    const [isLoading, setIsLoading] = useState(false);
    const lang = i18n.language;

    const handlePress = async () => {
        setIsLoading(true);
        if (dismissNewAchievement) {
            await dismissNewAchievement();
        } else {
            setNewAchievement(null);
        }
        setIsLoading(false);
    };

    return (
        <Modal statusBarTranslucent={true} visible={newAchievement !== null} transparent animationType="fade">
                <View style={styles.overlay}>
                    <LottieView
                        source={require('../../assets/animations/ConfettiAnimation.json')}
                        autoPlay
                        loop={false}
                        style={styles.confettiAnimation}
                        resizeMode="cover"/>

                    <View style={styles.alertBox}>
                        {newAchievement?.icon_url && (
                            <View style={styles.achievementLogoFrame}>
                                <Image source={{uri : newAchievement.icon_url}} style={styles.achievementLogo} />
                            </View>
                        )}

                        <Text style={styles.headingText}>{t('congratulations')}</Text>
                        <Text style={styles.titleText}>{newAchievement?.["title_" + lang]}</Text>
                        
                        <Text style={styles.messageText}>
                            {newAchievement?.["description_" + lang]}
                        </Text>

                        <TouchableOpacity 
                            style={styles.button} 
                            activeOpacity={0.8}
                            onPress={handlePress}>
                            {isLoading ? <ActivityIndicator/>:<Text style={styles.buttonText}>{t('keepGoing')}</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
        </Modal>
    );
}