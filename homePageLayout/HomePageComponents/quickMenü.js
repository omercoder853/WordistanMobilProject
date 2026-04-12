import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import styles from '../HomePageStyles/homeStyles'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const QuickMenuItems = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const goToPersonalDicts = () => {
        navigation.navigate('Dictionaries', {
            screen: 'Collections'})};

    const goToBadges = () => {
        navigation.navigate('Settings Navigation',
            {screen:'Achievements'})};

    const goToStatistics = () => {
        navigation.navigate('Settings Navigation',
            {screen:'Statistics'})}
    
    return (
        <ScrollView style={{ height: 'auto' }} horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.scrollView}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={goToPersonalDicts}>
                    <View style={styles.quickMenuColumn}>
                        <MaterialCommunityIcons name="bookshelf" size={24} color="black" />
                        <Text>{t('collections')}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={goToBadges}>
                    <View style={styles.quickMenuColumn}>
                        <MaterialCommunityIcons name="medal" size={24} color="black" />
                        <Text>{t('badges')}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <View style={styles.quickMenuColumn}>
                        <FontAwesome name="star" size={24} color="black" />
                        <Text>{t('favorites')}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={goToStatistics}>
                    <View style={styles.quickMenuColumn}>
                        <FontAwesome name="line-chart" size={24} color="black" />
                        <Text>{t('statistics')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const QuickMenu = () => {
    const { t } = useTranslation();
    return (
        <View style={styles.quickMenu}>
            <Text style={{ fontWeight: '900', marginBottom: 10, fontSize: 20 }}>{t('shortcuts')}</Text>
            <View style={{ borderColor: '#E8E4F2', borderWidth: 1, marginBottom: 10 }}></View>
            <QuickMenuItems />
        </View>
    )
}

export default QuickMenu;