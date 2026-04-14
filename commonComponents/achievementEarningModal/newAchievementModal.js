import { View, Modal, Text, TouchableOpacity, Image , ActivityIndicator} from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './newAchievementModalStyle';
import { useUserStats } from '../../contextapis/UserStatsContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function NewAchievement() {
    const { t } = useTranslation();
    const { activeAchievement,updateAchievements } = useUserStats();
    const [isLoading,setIsLoading] = useState(false)
    let achText;
    switch (activeAchievement?.requirementField) {
        case "translated_words":
            achText = t('translatingwordsachievement', {count: activeAchievement.requirementValue})
            break;
        case "saved_words":
            achText = t('savingwordsachievement',{count: activeAchievement.requirementValue})
        default:
            break;
    }

    if (!activeAchievement) return null;

    const handlePress = async()=>{
        setIsLoading(true);
        await updateAchievements();
        setIsLoading(false);
    }

    return (
        <Modal statusBarTranslucent={true} visible={true} transparent animationType="fade">
            <View style={styles.overlay}>
                <LottieView
                    source={require('../../assets/animations/ConfettiAnimation.json')}
                    autoPlay
                    loop={false}
                    style={styles.confettiAnimation}
                    resizeMode="cover"/>

                <View style={styles.alertBox}>
                    {activeAchievement?.image && (
                        <View style={styles.achievementLogoFrame}>
                            <Image source={activeAchievement.image} style={styles.achievementLogo} />
                        </View>
                    )}

                    <Text style={styles.headingText}>{t('congratulations')}</Text>
                    <Text style={styles.titleText}>{t(activeAchievement.id)}</Text>
                    
                    <Text style={styles.messageText}>
                        {achText}
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