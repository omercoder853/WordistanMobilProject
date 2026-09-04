import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { FontAwesome, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useDictionary } from "../../contextapis/DictContext";
import modalStyles from "../HomePageStyles/modalStyles";

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
  const { saveWord, dicts, setDictReload } = useDictionary();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedDictId, setSelectedDictId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (wordItem) => {
    setDictReload(true);
    setSelectedWord(wordItem);
    setSelectedDictId(null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    if (!loading) {
      setModalVisible(false);
      setSelectedDictId(null);
      setSelectedWord(null);
    }
  };

  const handleSave = async () => {
    if (!selectedDictId || !selectedWord || loading) return;
    setLoading(true);
    try {
      const result = await saveWord(
        { dictionary_id: selectedDictId, word: selectedWord.word, meaning: selectedWord.meaning },
        null,
        false
      );
    } catch (e) {
      console.log("Error saving word:", e);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
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
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={modalStyles.overlay}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <TouchableOpacity activeOpacity={1} style={modalStyles.container}>
            {/* Header */}
            <View style={modalStyles.header}>
              <View style={modalStyles.headerLeft}>
                <View style={modalStyles.iconCircle}>
                  <MaterialCommunityIcons name="book-plus-outline" size={22} color="#8E4A7C" />
                </View>
                <Text style={modalStyles.title}>{t('saveToDict')}</Text>
              </View>
              <TouchableOpacity onPress={handleCloseModal} style={modalStyles.closeIcon}>
                <Ionicons name="close" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={modalStyles.divider} />

            {/* Kelime Kartı */}
            <View style={modalStyles.wordCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={modalStyles.wordCardLabel}>{t('wordToSave')}</Text>
                <View style={modalStyles.badgeContainer}>
                  <Text style={modalStyles.directionBadge}>
                    {selectedWord?.from === "ENG" ? "ENG → TR" : "TR → ENG"}
                  </Text>
                </View>
              </View>
              <View style={modalStyles.wordCardRow}>
                <Text style={modalStyles.wordCardWord}>{selectedWord?.word}</Text>
                <View style={modalStyles.wordCardDot} />
                <Text style={modalStyles.wordCardMeaning}>{selectedWord?.meaning}</Text>
              </View>
            </View>

            {/* Sözlük Listesi */}
            <Text style={modalStyles.sectionLabel}>{t('selectADictionary')}</Text>

            {filteredDicts.length > 0 ? (
              <ScrollView
                style={modalStyles.dictList}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {filteredDicts.map((dict) => {
                  const isSelected = selectedDictId === dict.id;
                  return (
                    <TouchableOpacity
                      key={dict.id}
                      style={[
                        modalStyles.dictItem,
                        isSelected && modalStyles.dictItemSelected
                      ]}
                      onPress={() => setSelectedDictId(dict.id)}
                      activeOpacity={0.7}
                    >
                      <View style={modalStyles.dictItemLeft}>
                        <View style={[
                          modalStyles.dictItemIcon,
                          isSelected && modalStyles.dictItemIconSelected
                        ]}>
                          <MaterialCommunityIcons
                            name="book-outline"
                            size={18}
                            color={isSelected ? '#fff' : '#8E4A7C'}
                          />
                        </View>
                        <View style={modalStyles.dictItemInfo}>
                          <Text style={[
                            modalStyles.dictItemName,
                            isSelected && modalStyles.dictItemNameSelected
                          ]}>{dict.name}</Text>
                          <Text style={modalStyles.dictItemLang}>
                            {dict.language?.toUpperCase()} • {dict.words?.length || 0} {t('words')}
                          </Text>
                        </View>
                      </View>
                      <View style={[
                        modalStyles.radioOuter,
                        isSelected && modalStyles.radioOuterSelected
                      ]}>
                        {isSelected && <View style={modalStyles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View style={modalStyles.emptyState}>
                <MaterialCommunityIcons name="book-off-outline" size={40} color="#D1D5DB" />
                <Text style={modalStyles.emptyTitle}>{t('noDictYet')}</Text>
                <Text style={modalStyles.emptyDesc}>{t('createDictFirst')}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={modalStyles.cancelButton}
                onPress={handleCloseModal}
                disabled={loading}
              >
                <Text style={modalStyles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.saveButton,
                  (!selectedDictId || loading) && modalStyles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!selectedDictId || loading}
              >
                {loading
                  ? <ActivityIndicator color="white" size="small" />
                  : <Text style={modalStyles.saveButtonText}>{t('save')}</Text>
                }
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
