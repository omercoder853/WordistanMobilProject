import { View, Text, Image, TouchableOpacity,StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function Collection({ title, data, desc }) {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const wordCount = data ? data.length : 0;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("CollectionDetails", { title, data, desc })}>
            <View style={styles.cardContainer}>
                <Image 
                    source={require('../../assets/dictionary-cover.jpg')} 
                    style={styles.cardImage} />
                <View style={styles.cardContentWrapper}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {t(title)}
                    </Text>
                    
                    <View style={styles.cardTagsRow}>
                        <Text style={styles.cardTagBlue}>
                            {wordCount} {t("words")}
                        </Text>
                        <Text style={styles.cardTagPurple}>
                            A1-A2
                        </Text>
                        <Text style={styles.cardTagPink}>
                            ENG - TR
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        width: '100%'
    },
    cardImage: {
        width: 65, 
        height: 65, 
        borderRadius: 12, 
        marginRight: 15
    },
    cardContentWrapper: {
        flex: 1, 
        justifyContent: 'center'
    },
    cardTitle: {
        fontWeight: '800', 
        fontSize: 16, 
        color: '#1F2937', 
        marginBottom: 6
    },
    cardTagsRow: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 6, 
        alignItems: 'center'
    },
    cardTagBlue: {
        fontSize: 10, 
        color: '#4F46E5', 
        fontWeight: '700', 
        backgroundColor: '#EEF2FF', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 10
    },
    cardTagPurple: {
        fontSize: 10, 
        color: '#7C3AED', 
        fontWeight: '700', 
        backgroundColor: '#F3E8FF', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 10
    },
    cardTagPink: {
        fontSize: 10, 
        color: '#EC4899', 
        fontWeight: '700', 
        backgroundColor: '#FDF2F8', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 10
    }
})