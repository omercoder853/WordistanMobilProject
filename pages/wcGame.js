import { View,Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WordCompletionPage(){
    const router = useRoute();
    const {source,value,numberQuestion,seconds,hints,firstLetter} = router.params
    return (
        <SafeAreaView>
            <Text>{source}</Text>
            <Text>{firstLetter ? "true":"false"}</Text>
        </SafeAreaView>
    )
}