import { View, Text,ScrollView } from "react-native"
import Collection from "./collection"
import { useTranslation } from "react-i18next";

export default function Collections() {
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1, paddingHorizontal: 15}}>
            <Text style={{ fontWeight: '700', fontSize: 20, marginVertical: 10,width:'100%' }}>{t('collections')}</Text>
            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{flexDirection:'row',flexWrap:'wrap'}} showsVerticalScrollIndicator={false}>
                <Collection title={"Fruits and Vegetables"}/>
                <Collection title={"Most Known Animals"}/>
                <Collection title={"Environment and Places"}/>
            </ScrollView>
        </View>
    )
}