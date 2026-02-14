import { View,TextInput,TouchableOpacity } from "react-native";
import styles from "../DictionariesStyles/dictStyles";
import Feather from '@expo/vector-icons/Feather';

const SearchBar = () => {
    return(
        <View style={styles.searchBarRow}>
            <TextInput style={styles.searchBarInput} placeholder="Search for dictionaries"/>
            <TouchableOpacity style={styles.searchButton}>
                <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar;