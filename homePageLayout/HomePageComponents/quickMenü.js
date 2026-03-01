import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import styles from '../HomePageStyles/homeStyles'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const QuickMenuItems = () => {
    const navigation = useNavigation();
    const goToPersonalDicts = () => {
        navigation.navigate('Dictionaries', {
            screen: 'Collections'});};
    return (
        <ScrollView style={{ height: 'auto' }} horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.scrollView}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={goToPersonalDicts}>
                    <View style={styles.quickMenuColumn}>
                        <MaterialCommunityIcons name="bookshelf" size={24} color="black" />
                        <Text>Collections</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <View style={styles.quickMenuColumn}>
                        <MaterialCommunityIcons name="medal" size={24} color="black" />
                        <Text>Badges</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <View style={styles.quickMenuColumn}>
                        <FontAwesome name="star" size={24} color="black" />
                        <Text>Favorites</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                    <View style={styles.quickMenuColumn}>
                        <FontAwesome name="line-chart" size={24} color="black" />
                        <Text>Statistics</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const QuickMenu = () => {
    return (
        <View style={styles.quickMenu}>
            <Text style={{ fontWeight: '900', marginBottom: 10, fontSize: 20 }}>Shortcuts</Text>
            <View style={{ borderColor: '#E8E4F2', borderWidth: 1, marginBottom: 10 }}></View>
            <QuickMenuItems />
        </View>
    )
}

export default QuickMenu;