import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

const languageDetector = {
  type: 'languageDetector',
  async: true, // indicates that the detect function is asynchronous
  detect: async (callback) => {
    try {
      const savedLanguage = await AsyncStorage.getItem('@wordistan:language');
      if (savedLanguage && savedLanguage!="system") {
        return callback(savedLanguage);
      }
    } catch (error) {
      console.log('Error reading language from AsyncStorage', error);
    }
    
    // Get device locale if no preference is saved
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      return callback(locales[0].languageCode);
    }
    return callback('en');
  },
  init: () => {},
  cacheUserLanguage: async (language) => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    react: {
      useSuspense: false, // Recommended false in React Native generally
    }
  });

export default i18n;
