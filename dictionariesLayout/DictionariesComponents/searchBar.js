import { View,TextInput,TouchableOpacity } from "react-native";
import styles from "../DictionariesStyles/dictStyles";
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from "react-i18next";

const SearchBar = ({ currentTab = "Personal" }) => {
    const { t } = useTranslation();
    return(
        <View style={styles.searchBarRow}>
            <TextInput style={styles.searchBarInput} placeholder={currentTab === "Personal" ? t('searchInPersonal') : t('searchInCollections')}/>
            <TouchableOpacity style={styles.searchButton}>
                <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar;