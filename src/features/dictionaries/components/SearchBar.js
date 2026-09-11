import { View,TextInput,TouchableOpacity,StyleSheet } from "react-native";
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

const styles = StyleSheet.create({
    searchBarRow:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:25,
        marginTop:20,
        justifyContent:'center',
    },
    searchBarInput:{
        borderWidth:1,
        borderColor:'#D1D5DB',
        borderTopLeftRadius:15,
        borderBottomLeftRadius:15,
        paddingHorizontal:15,
        paddingVertical:10,
        flex:10
    },
    searchButton:{
        padding:10,
        backgroundColor:'#8E4A7C',
        borderTopRightRadius:15,
        borderBottomRightRadius:15,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
})