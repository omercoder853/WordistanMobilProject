import { Text, View } from "react-native";
import SearchBar from "../dictionariesLayout/DictionariesComponents/searchBar";
import TabBar from "../dictionariesLayout/DictionariesComponents/navigationTab";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Dictionaries() {
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState("Personal");
    return (
        <View style={{ flex: 1 }}>
            <Text style={{
                fontWeight: '900',
                fontSize: 25,
                paddingHorizontal: 25,
                marginTop: 20
            }}>{t('dictionaries')}</Text>
            <SearchBar currentTab={currentTab} />
            <TabBar setCurrentTab={setCurrentTab} />
        </View>
    )
}