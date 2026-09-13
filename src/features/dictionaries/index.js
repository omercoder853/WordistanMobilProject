import { Text, View } from "react-native";
import SearchBar from "./components/SearchBar";
import TabBar from "./components/TabBar";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Dictionaries() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState("Personal");

    return (
        <View style={{ flex: 1, backgroundColor: colors.common.background }}>
            <Text style={{
                fontWeight: '900',
                fontSize: 25,
                paddingHorizontal: 25,
                marginTop: 20,
                color: colors.dictionaries.title
            }}>{t('dictionaries')}</Text>
            <View style={{ zIndex: 3000 }}>
                <SearchBar currentTab={currentTab} />
            </View>
            <TabBar setCurrentTab={setCurrentTab} />
        </View>
    );
}