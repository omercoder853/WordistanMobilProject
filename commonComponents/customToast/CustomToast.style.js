import { StyleSheet, Platform } from 'react-native';

/**
 * Toast türlerine göre tema yapılandırması
 * - danger: Kırmızı tema, ünlem ikonu
 * - warning: Sarı/Amber tema, uyarı ikonu
 * - default: Gri/Slate tema, bilgi ikonu
 * - success: Yeşil tema, onay/tik ikonu
 */
export const TOAST_THEMES = {
  danger: {
    iconName: 'alert-circle',
    primaryColor: '#EF4444',
    accentBarColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    badgeBgColor: '#FEF2F2',
    badgeBorderColor: '#FEE2E2',
    borderColor: '#FECACA',
    titleColor: '#991B1B',
    messageColor: '#4B5563',
    iconColor: '#DC2626',
  },
  warning: {
    iconName: 'warning',
    primaryColor: '#F59E0B',
    accentBarColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    badgeBgColor: '#FFFBEB',
    badgeBorderColor: '#FEF3C7',
    borderColor: '#FDE68A',
    titleColor: '#92400E',
    messageColor: '#4B5563',
    iconColor: '#D97706',
  },
  default: {
    iconName: 'information-circle',
    primaryColor: '#64748B',
    accentBarColor: '#64748B',
    backgroundColor: '#FFFFFF',
    badgeBgColor: '#F8FAFC',
    badgeBorderColor: '#E2E8F0',
    borderColor: '#CBD5E1',
    titleColor: '#1E293B',
    messageColor: '#475569',
    iconColor: '#475569',
  },
  success: {
    iconName: 'checkmark-circle',
    primaryColor: '#10B981',
    accentBarColor: '#10B981',
    backgroundColor: '#FFFFFF',
    badgeBgColor: '#ECFDF5',
    badgeBorderColor: '#D1FAE5',
    borderColor: '#A7F3D0',
    titleColor: '#065F46',
    messageColor: '#4B5563',
    iconColor: '#059669',
  },
};

export const getToastTheme = (type) => {
  return TOAST_THEMES[type] || TOAST_THEMES.default;
};

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toastCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  leftAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});
