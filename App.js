import { StatusBar } from "expo-status-bar";
import React from "react";
import RootNavigation from './src/navigations/RootNavigation'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/contextapis/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import './src/i18n/i18n';
import { FeedbackProvider } from "./src/contextapis/FeedbackContext";
import CustomToast from "./src/shared/components/customToast/CustomToast";
import CustomAlert from "./src/shared/components/customAlert/CustomAlert";

export default function App() {
  return (
    <SafeAreaProvider>
      <FeedbackProvider>
        <NavigationContainer>
          <AuthProvider>
            <RootNavigation />
          </AuthProvider>
          <CustomToast />
          <CustomAlert />
        </NavigationContainer>
      </FeedbackProvider>
    </SafeAreaProvider>
  );
}
