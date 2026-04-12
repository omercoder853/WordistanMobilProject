import { View, Text, ScrollView } from "react-native"
import Collection from "./collection"
import { useTranslation } from "react-i18next";
import { collectionList } from "./collectionList";

export default function Collections() {
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1, paddingHorizontal: 15}}>
            <Text style={{ fontWeight: '700', fontSize: 20, marginVertical: 10,width:'100%' }}>{t('collections')}</Text>
            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                {collectionList.map((item) => (
                    <Collection 
                        key={item.id}
                        title={item.title} 
                        data={item.data} 
                        desc={item.desc}
                    />
                ))}
            </ScrollView>
        </View>
    )
}