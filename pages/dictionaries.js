import { Text,View } from "react-native";
import SearchBar from "../dictionariesLayout/DictionariesComponents/searchBar";
import styles from "../dictionariesLayout/DictionariesStyles/dictStyles"
import TabBar from "../dictionariesLayout/DictionariesComponents/navigationTab";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Dictionaries(){
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState("Personal");
    return(
        <View style={{flex:1}}>
            <Text style={styles.title}>{t('dictionaries')}</Text>
            <SearchBar currentTab={currentTab}/>
            <TabBar setCurrentTab={setCurrentTab}/>
        </View>
    )
}