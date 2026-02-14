import { Text,View } from "react-native";
import SearchBar from "../dictionariesLayout/DictionariesComponents/searchBar";
import styles from "../dictionariesLayout/DictionariesStyles/dictStyles"
import TabBar from "../dictionariesLayout/DictionariesComponents/navigationTab";

export default function Dictionaries(){
    return(
        <View style={{flex:1}}>
            <Text style={styles.title}>Dictionaries</Text>
            <SearchBar/>
            <TabBar/>
        </View>
    )
}