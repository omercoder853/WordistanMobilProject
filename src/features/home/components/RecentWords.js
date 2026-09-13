import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useDictionary } from "@/contextapis/DictContext";
import { useTheme } from "@/contextapis/ThemeContext";
import SaveWordModal from "@/shared/components/SaveWordModal";

const RecentWord = ({ item, onSavePress }) => {
  const { colors } = useTheme();
  const rwColors = colors.home.recentWords;

  return (
    <View
      style={[
        recentStyles.rowContainer,
        {
          backgroundColor: rwColors.cardBg,
          borderColor: rwColors.cardBorder,
          shadowColor: rwColors.shadow,
        },
      ]}
    >
      <Text style={[recentStyles.wordText, { color: rwColors.wordText }]}>{item.word}</Text>
      <View style={recentStyles.arrowContainer}>
        <FontAwesome name="arrows-h" size={16} color={rwColors.arrowColor} />
      </View>
      <Text style={[recentStyles.meaningText, { color: rwColors.meaningText }]}>{item.meaning}</Text>
      <TouchableOpacity
        onPress={() => onSavePress(item)}
        style={[recentStyles.addBtn, { backgroundColor: rwColors.addBtnBg }]}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="book-plus-outline" size={20} color={rwColors.addBtnIcon} />
      </TouchableOpacity>
    </View>
  );
};

const RecentWords = ({ recentWords }) => {
  const { colors } = useTheme();
  const rwColors = colors.home.recentWords;
  const { t } = useTranslation();
  const { dicts, setDictReload } = useDictionary();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  const handleOpenModal = (wordItem) => {
    setDictReload(true);
    setSelectedWord(wordItem);
    setModalVisible(true);
  };

  // Filter dictionaries matching translation direction:
  // If item.from === "TR", only TR -> ENG dictionaries
  // If item.from === "ENG", only ENG -> TR dictionaries
  const filteredDicts = (dicts || []).filter((dict) => {
    if (!selectedWord) return false;
    const wordFrom = selectedWord.from || "TR";
    if (wordFrom === "TR") {
      return dict.language === "TR to ENG" || dict.language?.startsWith("TR");
    } else {
      return dict.language === "ENG to TR" || dict.language?.startsWith("ENG");
    }
  });

  return (
    <>
      <View style={{ padding: 20 }}>
        <Text style={{ fontWeight: "900", marginBottom: 10, fontSize: 20, color: colors.home.sectionTitle }}>
          {t("recentWords")}
        </Text>
        <View style={{ borderColor: rwColors.divider, borderWidth: 1, marginBottom: 10 }} />
        <View>
          {recentWords && recentWords.length !== 0 ? (
            recentWords.map((word, ind) => (
              <RecentWord key={ind} item={word} onSavePress={handleOpenModal} />
            ))
          ) : (
            <Text style={{ color: rwColors.emptyText }}>{t('dontHavePastWord')}</Text>
          )}
        </View>
      </View>

      {/* Sözlük Seçim Modalı */}
      <SaveWordModal modalVisible={modalVisible} setModalVisible={setModalVisible} word={selectedWord?.word || ''} meaning={selectedWord?.meaning || ''} filteredDicts={filteredDicts} />
    </>
  );
};

const recentStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  wordText: {
    flex: 2,
    fontSize: 15,
    fontWeight: '600',
  },
  arrowContainer: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  meaningText: {
    flex: 2,
    fontSize: 14,
    textAlign: 'center',
  },
  addBtn: {
    padding: 6,
    borderRadius: 10,
    marginLeft: 8,
  },
});

export default RecentWords;
