import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../DictionariesStyles/collectionStyle";
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
            <View style={styles.tileContainer}>
                <Image 
                    source={require('../../assets/dictionary-cover.jpg')} 
                    style={styles.tileImage} />
                <View style={styles.tileContentWrapper}>
                    <Text style={styles.tileTitle} numberOfLines={1}>
                        {t(title)}
                    </Text>
                    
                    <View style={styles.tileTagsRow}>
                        <Text style={styles.tileTagBlue}>
                            {wordCount} {t("words")}
                        </Text>
                        <Text style={styles.tileTagPurple}>
                            A1-A2
                        </Text>
                        <Text style={styles.tileTagPink}>
                            ENG - TR
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}