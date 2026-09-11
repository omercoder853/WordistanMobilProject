import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { FontAwesome, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useDictionary } from "../../contextapis/DictContext";
import SaveWordModal from "../../dictionariesLayout/DictionariesComponents/SaveWordModal";

const { width } = Dimensions.get('window');

const RecentWord = ({ item, onSavePress }) => {
  return (
    <View style={recentStyles.rowContainer}>
      <Text style={recentStyles.wordText}>{item.word}</Text>
      <View style={recentStyles.arrowContainer}>
        <FontAwesome name="arrows-h" size={16} color="#8E4A7C" />
      </View>
      <Text style={recentStyles.meaningText}>{item.meaning}</Text>
      <TouchableOpacity 
        onPress={() => onSavePress(item)} 
        style={recentStyles.addBtn}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="book-plus-outline" size={20} color="#8E4A7C" />
      </TouchableOpacity>
    </View>
  );
};

const RecentWords = ({ recentWords }) => {
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
      <View style={{padding:20}}>
        <Text style={{ fontWeight: "900", marginBottom: 10, fontSize: 20 }}>
          {t("recentWords")}
        </Text>
        <View style={{ borderColor: "#E8E4F2", borderWidth: 1, marginBottom: 10 }} />
        <View>
          {recentWords && recentWords.length !== 0 ? (
            recentWords.map((word, ind) => (
              <RecentWord key={ind} item={word} onSavePress={handleOpenModal} />
            ))
          ) : (
            <Text style={{ color: "#9CA3AF" }}>{t('dontHavePastWord')}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  wordText: {
    flex: 2,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  arrowContainer: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  meaningText: {
    flex: 2,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  addBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(142, 74, 124, 0.08)',
    marginLeft: 8,
  },
});

export default RecentWords;
