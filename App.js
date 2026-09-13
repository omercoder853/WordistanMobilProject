import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import RootNavigation from '@/navigations/RootNavigation'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contextapis/AuthContext";
import { NavigationContainer , DefaultTheme , DarkTheme  } from "@react-navigation/native";
import '@/i18n/i18n';
import { FeedbackProvider } from "@/contextapis/FeedbackContext";
import CustomToast from "@/shared/components/customToast/CustomToast";
import CustomAlert from "@/shared/components/customAlert/CustomAlert";
import {useTheme , ThemeProvider} from "@/contextapis/ThemeContext"

function MainContent() {
  const {isDark,themeMode,colors} = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme
  return (
    <View style={{ flex: 1, backgroundColor: colors.common.background }}>
      <StatusBar style={isDark ? "light" : "dark"} 
      backgroundColor="transparent"/>
      <FeedbackProvider>
        <NavigationContainer 
        theme={{ ...baseTheme, 
        colors: { ...baseTheme.colors, background: colors.common.background } }}>
          <AuthProvider>
            <RootNavigation/>
          </AuthProvider>
          <CustomAlert/>
          <CustomToast/>
        </NavigationContainer>
      </FeedbackProvider>
    </View>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainContent/>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
