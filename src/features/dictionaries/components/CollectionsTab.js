import { View, Text, ScrollView } from "react-native";
import Collection from "./CollectionCard";
import { useTranslation } from "react-i18next";
import { COLLECTION_LIST } from "../data/CollectionList";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Collections() {
    const { colors } = useTheme();
    const dColors = colors.dictionaries;
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: colors.common.background }}>
            <Text style={{ fontWeight: '700', fontSize: 20, marginVertical: 10, width: '100%', color: dColors.title }}>{t('collections')}</Text>
            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                {COLLECTION_LIST.map((item) => (
                    <Collection 
                        key={item.id}
                        title={item.title} 
                        data={item.data} 
                        desc={item.desc}
                    />
                ))}
            </ScrollView>
        </View>
    );
}