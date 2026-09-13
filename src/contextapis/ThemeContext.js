import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../constants/Colors';
import { storage } from '@/storage/storage';
import { STORAGE_KEYS } from '@/constants/StorageKeys';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); 
  const [themeMode, setThemeMode] = useState('system');
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedMode = await storage.get(STORAGE_KEYS.PREFERENCES.THEME);
        if (savedMode) setThemeMode(savedMode);
      } catch (e) {
        console.error('Tema tercihi yüklenemedi', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const updateThemeMode = async (mode) => {
    try {
      setThemeMode(mode);
      await storage.set(STORAGE_KEYS.PREFERENCES.THEME , mode);
    } catch (e) {
      console.error('Tema tercihi kaydedilemedi', e);
    }
  };


  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const currentColors = isDark ? colors.dark : colors.light;

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider
      value={{
        themeMode, 
        setThemeMode: updateThemeMode,
        colors: currentColors, 
        isDark,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);