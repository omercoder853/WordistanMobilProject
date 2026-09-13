import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const getAlertStyles = (alertColors = {}) => {
  const ca = alertColors;
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: ca.overlay || 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertBox: {
      width: width * 0.8,
      backgroundColor: ca.cardBg || 'white',
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      shadowColor: ca.cardShadow || '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: ca.title || '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: ca.message || '#666',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 22,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 5,
    },

    defaultButton: {
      backgroundColor: ca.defaultBtnBg || '#5B3FD3',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
    },
    cancel: {
      backgroundColor: ca.cancelBtnBg || '#6B7280',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
      borderWidth: 1,
      borderColor: ca.cancelBtnBorder || '#E5E7EB',
    },

    success: {
      backgroundColor: ca.successBtnBg || '#10B981',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
    },

    danger: {
      backgroundColor: ca.dangerBtnBg || '#EF4444',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
      flex: 1,
    },

    buttonText: {
      color: ca.buttonText || 'white',
      fontSize: 16,
      fontWeight: '600',
    },

    defaultButtonDisabled: {
      backgroundColor: ca.defaultBtnDisabledBg || '#B4A8EE',
    },

    cancelDisabled: {
      backgroundColor: ca.cancelBtnDisabledBg || '#9CA3AF',
    },

    successDisabled: {
      backgroundColor: ca.successBtnDisabledBg || '#A7F3D0',
    },

    dangerDisabled: {
      backgroundColor: ca.dangerBtnDisabledBg || '#FCA5A5',
    },
  });
};

const styles = getAlertStyles();
export default styles;