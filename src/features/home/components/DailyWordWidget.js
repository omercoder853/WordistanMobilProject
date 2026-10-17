import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Entypo,Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useDictionary } from '@/contextapis/DictContext';
import useSpeech from '@/hooks/useSpeech';
import SaveWordModal from '@/shared/components/SaveWordModal';
import { useTheme } from '@/contextapis/ThemeContext';
import Skeleton from '@/shared/components/Skeleton';
import { useAuth } from '@/contextapis/AuthContext';

const DailyWord = () => {
    const { colors } = useTheme();
    const dwColors = colors.home.dailyWord;
    const { speak, stop, isSpeaking } = useSpeech();
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const { dailyWord, setDictReload, deleteWord, dicts , dailyWordLoading } = useDictionary();
    const lang = i18n.language;
    const { isGuest } = useAuth();

    const heartToggle = async () => {
        if (dailyWord != null && dailyWord.is_saved) {
            await deleteWord(dailyWord["saved_id"]);
        }
        else {
            setDictReload(true);
            setModalVisible(true);
        }
    };

    const handleSpeak = () => {
        if (!isSpeaking) {
            speak(lang == 'tr' ? dailyWord?.word : dailyWord?.meaning , lang == 'tr' ? 'en' : 'tr');
        }
        else {
            stop();
        }
    };

    const filteredDicts = (dicts || []).filter(dict =>
        (lang === 'tr' && dict.language === 'ENG to TR') ||
        (lang === 'en' && dict.language === 'TR to ENG')
    );

    const word = lang === 'tr' ? dailyWord?.word : dailyWord?.meaning;
    const meaning = lang === 'tr' ? dailyWord?.meaning : dailyWord?.word;

    return (
        <>
            <LinearGradient
                colors={dwColors.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.dailyWordContainer, { shadowColor: dwColors.shadow }]}
            >
                {isGuest ? (
                    <View style={[styles.guestNotice, { backgroundColor: dwColors.guestNotice.background }]}>
                        <View style={[styles.guestNoticeIcon, { backgroundColor: dwColors.guestNotice.iconBackground }]}>
                            <Ionicons name="warning" size={24} color={dwColors.guestNotice.icon} />
                        </View>
                        <View style={styles.guestNoticeText}>
                            <Text style={[styles.guestNoticeMessage, { color: dwColors.guestNotice.message }]}>
                                {t('guestDailyWordFetchError')}
                            </Text>
                        </View>
                    </View>
                ) : !dailyWordLoading && !dailyWord ? (
                    <View style={[styles.guestNotice, { backgroundColor: dwColors.guestNotice.background }]}>
                        <View style={[styles.guestNoticeIcon, { backgroundColor: dwColors.guestNotice.iconBackground }]}>
                            <Ionicons name="warning" size={24} color={dwColors.guestNotice.icon} />
                        </View>
                        <View style={styles.guestNoticeText}>
                            <Text style={[styles.guestNoticeMessage, { color: dwColors.guestNotice.message }]}>
                                {t('dailyWordUnavailable')}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={styles.dailyWordRow}>
                            <Text style={[styles.dailyWordTitle, { color: dwColors.title }]}>{t('wordOfTheDay')}</Text>
                            <View style={styles.dailyWordButtons}>
                                {dailyWordLoading ? (
                                    <Skeleton variant="glass" width={36} height={36} radius={20} />
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleSpeak}
                                        style={[styles.actionBtn, { backgroundColor: dwColors.buttonBg }]}
                                    >
                                        <Feather name="volume-2" size={20} color={dwColors.speakerIcon} />
                                    </TouchableOpacity>
                                )}
                                {dailyWordLoading ? (
                                    <Skeleton variant="glass" width={36} height={36} style={styles.secondSkeleton} radius={20} />
                                ) : (
                                    <TouchableOpacity
                                        onPress={heartToggle}
                                        style={[styles.actionBtn, { backgroundColor: dwColors.buttonBg }]}
                                    >
                                        <Entypo
                                            name={dailyWord?.is_saved ? "heart" : "heart-outlined"}
                                            size={20}
                                            color={dailyWord?.is_saved ? dwColors.heartActive : dwColors.heartInactive}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <Text style={[styles.dailyWordLabel, { color: dwColors.label }]}>{t('word')}</Text>
                        {dailyWordLoading ? (
                            <Skeleton variant="glass" width="80%" height={38} radius={10} style={styles.wordSkeleton} />
                        ) : (
                            <Text style={[styles.dailyWordContent, styles.wordText, { color: dwColors.content }]}>{word}</Text>
                        )}
                        <Text style={[styles.dailyWordLabel, { color: dwColors.label }]}>{t('meaning')}</Text>
                        {dailyWordLoading ? (
                            <Skeleton variant="glass" width="80%" height={20} radius={10} style={styles.meaningSkeleton} />
                        ) : (
                            <Text style={[styles.dailyWordContent, styles.meaningText, { color: dwColors.content }]}>{meaning}</Text>
                        )}
                        <Text style={[styles.dailyWordLabel, { color: dwColors.label }]}>{t('inSentence')}</Text>
                        {dailyWordLoading ? (
                            <Skeleton variant="glass" width="80%" height={34} radius={10} style={styles.sentenceSkeleton} />
                        ) : (
                            <Text style={[styles.dailyWordContent, { color: dwColors.content }]}>
                                {lang === 'tr' ? dailyWord?.example_en : dailyWord?.example_tr}
                            </Text>
                        )}
                    </>
                )}
            </LinearGradient>

            {/* Sözlük Seçim Modalı */}
            <SaveWordModal modalVisible={modalVisible} setModalVisible={setModalVisible} filteredDicts={filteredDicts} word={word} meaning={meaning} isDaily={true} />
        </>
    );
};

export default DailyWord;

const styles = StyleSheet.create({
    dailyWordContainer: {
        padding: 20,
        borderRadius: 25,
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        marginHorizontal: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    guestNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
        padding: 16,
        gap: 14,
    },
    guestNoticeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    guestNoticeText: {
        flex: 1,
        gap: 4,
    },
    guestNoticeTitle: {
        fontSize: 17,
        fontWeight: '800',
    },
    guestNoticeMessage: {
        fontSize: 14,
        lineHeight: 20,
    },
    dailyWordRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dailyWordButtons: {
        flexDirection: 'row',
        marginLeft: 'auto'
    },
    dailyWordTitle: {
        fontSize: 23,
        fontWeight: '900'
    },
    dailyWordLabel: {
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 10
    },
    dailyWordContent: {
        fontSize: 15,
        fontWeight: '700'
    },
    actionBtn: {
        padding: 8,
        borderRadius: 20,
        marginLeft: 8,
    },
    secondSkeleton: {
        marginLeft: 8,
    },
    wordSkeleton: {
        marginTop: 5,
    },
    meaningSkeleton: {
        marginTop: 5,
    },
    sentenceSkeleton: {
        marginTop: 5,
    },
    wordText: {
        fontSize: 28,
        marginTop: 5,
    },
    meaningText: {
        fontSize: 18,
    },
})