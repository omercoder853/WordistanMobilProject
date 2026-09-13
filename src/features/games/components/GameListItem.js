import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles/styles";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contextapis/ThemeContext";

export default function Game({ item }) {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.gameButton,
                {
                    backgroundColor: colors.games.cardBg,
                    borderColor: colors.games.cardBorder,
                    shadowColor: colors.games.cardShadow,
                }
            ]}
            onPress={() => navigation.navigate("Game Navigation", { screen: "Game Setup", params: { gameType: item.id } })}
        >
            <View style={styles.gameRow}>
                <View style={{ flex: 2 }}>
                    <Image style={styles.gameCover} source={item.cover} />
                </View>
                <View style={{ flex: 6 }}>
                    <Text style={[styles.gameName, { color: colors.games.textPrimary }]}>{item.name}</Text>
                    <Text style={{ color: colors.games.textSecondary }}>{item.desc}</Text>
                </View>
                <AntDesign name="play-circle" size={24} color="#dc9f9f" style={{ flex: 1, marginLeft: 'auto' }} />
            </View>
        </TouchableOpacity>
    );
}
