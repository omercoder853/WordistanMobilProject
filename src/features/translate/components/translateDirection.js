import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/contextapis/ThemeContext';

export default function Direction({ setDisplay, from, setFrom }) {
    const { colors } = useTheme();
    const tColors = colors.translate;

    const toggleDirection = () => {
        setFrom(from === "TR" ? "EN" : "TR");
        setDisplay("none");
    };

    return (
        <View style={[styles.directionRow, { backgroundColor: tColors.directionRowBg, shadowColor: tColors.shadow }]}>
            <Text style={[styles.directionItem, { backgroundColor: tColors.directionItemBg, color: tColors.directionItemText }]}>
                {from === "TR" ? "TR" : "ENG"}
            </Text>
            <TouchableOpacity
                onPress={toggleDirection}
                style={[styles.directionButton, { backgroundColor: tColors.directionItemBg }]}
                activeOpacity={0.7}
            >
                <MaterialIcons name="compare-arrows" size={24} color={tColors.directionIcon} />
            </TouchableOpacity>
            <Text style={[styles.directionItem, { backgroundColor: tColors.directionItemBg, color: tColors.directionItemText }]}>
                {from === "TR" ? "ENG" : "TR"}
            </Text>
        </View>
    );
}