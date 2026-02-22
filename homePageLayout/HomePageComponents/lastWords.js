import {} from "react";
import { View, Text } from "react-native";
import styles from "../HomePageStyles/homeStyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const RecentWord = ({ item }) => {
  return (
    <View style={styles.recentWord}>
      <Text style={{ flex: 1 }}>{item.word}</Text>
      <View style={{ flex: 1, alignItems: "center" }}>
        <FontAwesome name="arrows-h" size={24} color="black" />
      </View>
      <Text style={{ flex: 1, textAlign: "right" }}>{item.meaning}</Text>
    </View>
  );
};

const RecentWords = ({recentWords}) => {
  return (
    <View style={styles.quickMenu}>
      <Text style={{ fontWeight: "900", marginBottom: 10, fontSize: 20 }}>
        Recent Words
      </Text>
      <View
        style={{ borderColor: "#E8E4F2", borderWidth: 1, marginBottom: 10 }}
      ></View>
      <View>
        {recentWords && recentWords.length !== 0 ? (recentWords.map((word, ind) => <RecentWord key={ind} item={word} />)) : 
        (<Text>You dont have any past word</Text>)}
      </View>
    </View>
  );
};

export default RecentWords;
