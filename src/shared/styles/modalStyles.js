import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const getModalStyles = (colors = {}) => {
  const sw = colors;
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: sw.overlay || 'rgba(0, 0, 0, 0.55)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: width * 0.88,
      maxHeight: '80%',
      backgroundColor: sw.containerBg || '#FFFFFF',
      borderRadius: 24,
      padding: 22,
      shadowColor: sw.containerShadow || '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: sw.headerIconBg || 'rgba(142, 74, 124, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: sw.title || '#1F2937',
    },
    closeIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: sw.closeIconBg || '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: sw.divider || '#F3F4F6',
      marginVertical: 16,
    },
    wordCard: {
      backgroundColor: sw.wordCardBg || '#FDF2F8',
      borderRadius: 16,
      padding: 14,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: sw.wordCardBorder || '#FCE7F3',
    },
    wordCardLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: sw.wordCardLabel || '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    badgeContainer: {
      backgroundColor: sw.badgeBg || '#8E4A7C',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    directionBadge: {
      fontSize: 10,
      fontWeight: '700',
      color: sw.badgeText || '#FFFFFF',
    },
    wordCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    wordCardWord: {
      fontSize: 18,
      fontWeight: '800',
      color: sw.wordCardWord || '#8E4A7C',
    },
    wordCardDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: sw.wordCardDot || '#D1D5DB',
      marginHorizontal: 8,
    },
    wordCardMeaning: {
      fontSize: 15,
      fontWeight: '600',
      color: sw.wordCardMeaning || '#6B7280',
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: sw.sectionLabel || '#6B7280',
      marginBottom: 10,
    },
    dictList: {
      maxHeight: 200,
    },
    dictItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: sw.dictItemBg || '#F9FAFB',
      marginBottom: 8,
      borderWidth: 1.5,
      borderColor: sw.dictItemBorder || '#F3F4F6',
    },
    dictItemSelected: {
      backgroundColor: sw.dictItemSelectedBg || '#FDF2F8',
      borderColor: sw.dictItemSelectedBorder || '#8E4A7C',
    },
    dictItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    dictItemIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: sw.dictItemIconBg || 'rgba(142, 74, 124, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    dictItemIconSelected: {
      backgroundColor: sw.dictItemIconSelectedBg || '#8E4A7C',
    },
    dictItemInfo: {
      flex: 1,
    },
    dictItemName: {
      fontSize: 15,
      fontWeight: '600',
      color: sw.dictItemName || '#374151',
    },
    dictItemNameSelected: {
      color: sw.dictItemNameSelected || '#8E4A7C',
    },
    dictItemLang: {
      fontSize: 12,
      color: sw.dictItemLang || '#9CA3AF',
      marginTop: 2,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: sw.radioOuterBorder || '#D1D5DB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioOuterSelected: {
      borderColor: sw.radioOuterSelectedBorder || '#8E4A7C',
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: sw.radioInnerBg || '#8E4A7C',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: sw.emptyTitle || '#6B7280',
      marginTop: 10,
    },
    emptyDesc: {
      fontSize: 13,
      color: sw.emptyDesc || '#9CA3AF',
      textAlign: 'center',
      marginTop: 4,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 18,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 14,
      backgroundColor: sw.cancelBtnBg || '#F3F4F6',
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: sw.cancelBtnText || '#6B7280',
    },
    saveButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 14,
      backgroundColor: sw.saveBtnBg || '#8E4A7C',
      alignItems: 'center',
    },
    saveButtonDisabled: {
      backgroundColor: sw.saveBtnDisabledBg || '#C4A6BC',
    },
    saveButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: sw.saveBtnText || '#FFFFFF',
    },
  });
};

const modalStyles = getModalStyles();
export default modalStyles;