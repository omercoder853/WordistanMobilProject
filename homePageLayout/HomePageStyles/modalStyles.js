import {StyleSheet,Dimensions} from 'react-native'
const { width } = Dimensions.get('window');


const modalStyles = StyleSheet.create({
    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.88,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
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
    backgroundColor: 'rgba(142, 74, 124, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  wordCard: {
    backgroundColor: '#FDF2F8',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  wordCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeContainer: {
    backgroundColor: '#8E4A7C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  directionBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  wordCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordCardWord: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8E4A7C',
  },
  wordCardDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  wordCardMeaning: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
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
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },
  dictItemSelected: {
    backgroundColor: '#FDF2F8',
    borderColor: '#8E4A7C',
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
    backgroundColor: 'rgba(142, 74, 124, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dictItemIconSelected: {
    backgroundColor: '#8E4A7C',
  },
  dictItemInfo: {
    flex: 1,
  },
  dictItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  dictItemNameSelected: {
    color: '#8E4A7C',
  },
  dictItemLang: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#8E4A7C',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8E4A7C',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#9CA3AF',
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#8E4A7C',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#C4A6BC',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})

export default modalStyles;