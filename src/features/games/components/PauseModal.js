import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';

export default function PauseModal({ visible, onResume, onExit }) {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={onResume}
        >
            <View style={styles.backdrop}>
                <Pressable style={styles.dismissArea} onPress={onResume} />
                <View style={styles.modalCard}>
                    {/* Pause Icon */}
                    <View style={styles.iconCircle}>
                        <Feather name="pause" size={30} color="#5B3FD3" />
                    </View>

                    {/* Title & Subtitle */}
                    <Text style={styles.title}>{t('gamePaused') || 'Oyun Duraklatıldı'}</Text>
                    <Text style={styles.subtitle}>
                        {t('gamePausedDesc') || 'Oyuna devam edebilir veya oyundan çıkabilirsiniz.'}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={onResume}
                            style={styles.resumeButtonWrapper}
                        >
                            <LinearGradient
                                colors={['#6D28D9', '#5B3FD3']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.resumeGradientBtn}
                            >
                                <Feather name="play" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.resumeText}>{t('resume') || 'Devam Et'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onExit}
                            style={styles.exitButton}
                        >
                            <Feather name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                            <Text style={styles.exitText}>{t('exitGame') || 'Oyundan Çık'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    dismissArea: {
        ...StyleSheet.absoluteFillObject,
    },
    modalCard: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        alignItems: 'center',
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#EDE9FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    buttonGroup: {
        width: '100%',
        gap: 12,
    },
    resumeButtonWrapper: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    resumeGradientBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    resumeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    exitButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        borderWidth: 1.5,
        borderColor: '#FECACA',
    },
    exitText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '700',
    },
});
