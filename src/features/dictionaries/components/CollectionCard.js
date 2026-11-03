import { View, Text, Image, TouchableOpacity, StyleSheet,ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Collection({ collection }) {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const lang = i18n.language.split("-")[0];
    const title = collection["title_" + lang] ?? "";
    const desc = collection["description_" + lang] ?? "";
    const count = collection.collection_words ?? 0;
    const level = collection.level ?? "";
    const owner = collection.owner ?? "";
    const tags = collection["tags_" + lang] ?? []

    return (
        <View style={[styles.cardContainer, {
                backgroundColor: dColors.cardBg,
                shadowColor: dColors.cardShadow,
                borderColor: dColors.cardBorder
            }]}>
            <TouchableOpacity
                style={styles.collectionInfo}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("CollectionDetails", {
                    id:collection["id"],
                    title,
                    desc,
                    count,
                    level,
                    owner,
                })}
            >
                <Image
                    source={require('../assets/dictionary_default_cover.jpg')}
                    resizeMode="cover"
                    style={styles.cardImage}
                />
                <View style={styles.cardContentWrapper}>
                    <Text style={[styles.cardTitle, { color: dColors.textPrimary }]} numberOfLines={1}>
                        {t(title)}
                    </Text>

                    <View style={styles.cardTagsRow}>
                        <Text style={[styles.cardTagBlue, { color: dColors.badgeText, backgroundColor: dColors.badgeBg }]}>
                            {count} {t("words")}
                        </Text>
                        {level ? (
                            <Text style={[styles.cardTagPurple, { color: dColors.badgeText, backgroundColor: dColors.badgeBg }]}>
                                {level}
                            </Text>
                        ) : null}
                        <Text style={[styles.cardTagPink, { color: dColors.badgeText, backgroundColor: dColors.badgeBg }]}>
                            ENG - TR
                        </Text>
                        {owner ? (
                            <Text style={[styles.cardTagBlue, {
                                color: dColors.badgeText,
                                backgroundColor: dColors.badgeBg,
                                borderColor: dColors.badgeBorder,
                                borderWidth: 1,
                            }]} numberOfLines={1}>
                                {t("collectionOwner", { owner })}
                            </Text>
                        ) : null}

                    </View>
                </View >
            </TouchableOpacity>
            {tags.length > 0 && (
                <ScrollView
                    horizontal
                    style={styles.tagsScroll}
                    contentContainerStyle={styles.tagsContatiner}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    {tags.map((tag, index) => (
                        <Text
                            key={`${tag}-${index}`}
                            style={[styles.cardTagBlue, {
                                color: dColors.badgeText,
                                backgroundColor: dColors.badgeBg,
                                borderColor: dColors.badgeBorder,
                                borderWidth: 1,
                            }]}
                            numberOfLines={1}
                        >
                            #{tag}
                        </Text>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        width: '100%',
        borderWidth: 1
    },
    collectionInfo: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    cardImage: {
        width: 76,
        height: 76,
        borderRadius: 14,
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
    },
    tagsScroll: {
        width: "100%",
        flexGrow: 0,
        marginTop: 10,
    },
    tagsContatiner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingRight: 2,
    },
})