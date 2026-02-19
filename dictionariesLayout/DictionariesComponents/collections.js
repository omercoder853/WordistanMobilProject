import { View, Text,ScrollView } from "react-native"
import Collection from "./collection"

export default function Collections() {
    return (
        <View style={{ flex: 1, paddingHorizontal: 15}}>
            <Text style={{ fontWeight: '700', fontSize: 20, marginVertical: 10,width:'100%' }}>Collections</Text>
            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{flexDirection:'row',flexWrap:'wrap'}} showsVerticalScrollIndicator={false}>
                <Collection title={"Fruits and Vegetables"}/>
                <Collection title={"Most Known Animals"}/>
                <Collection title={"Environment and Places"}/>
            </ScrollView>
        </View>
    )
}