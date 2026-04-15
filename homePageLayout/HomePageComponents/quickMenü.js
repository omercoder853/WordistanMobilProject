import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import styles from '../HomePageStyles/homeStyles'
import { MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';
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
                <View style={styles.quickMenuColumn}>
                    <TouchableOpacity style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={goToPersonalDicts}>
                        <MaterialCommunityIcons name="bookshelf" size={28} color="#5B3FD3" style={{marginBottom: 8}} />
                        <Text style={styles.quickMenuText}>{t('collections')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.quickMenuColumn}>
                    <TouchableOpacity style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={goToBadges}>
                        <MaterialCommunityIcons name="medal" size={28} color="#5B3FD3" style={{marginBottom: 8}} />
                        <Text style={styles.quickMenuText}>{t('badges')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.quickMenuColumn}>
                    <TouchableOpacity style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="star-o" size={28} color="#5B3FD3" style={{marginBottom: 8}} />
                        <Text style={styles.quickMenuText}>{t('favorites')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.quickMenuColumn}>
                    <TouchableOpacity style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={goToStatistics}>
                        <Feather name="search" size={28} color="#5B3FD3" style={{marginBottom: 8}} />
                        <Text style={styles.quickMenuText}>{t('statistics')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const QuickMenu = () => {
    const { t } = useTranslation();
    return (
        <View style={[styles.quickMenu, {paddingLeft: 10}]}>
            <Text style={{ fontWeight: '900', marginBottom: 15, fontSize: 20, marginLeft: 10 }}>{t('shortcuts')}</Text>
            <QuickMenuItems />
        </View>
    )
}

export default QuickMenu;