import { StatusBar } from "expo-status-bar";
import React from "react";
import RootNavigation from './navigations/rootNavigation'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./contextapis/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import './src/i18n/i18n';
import { FeedbackProvider } from "./contextapis/FeedbackContext";
import CustomToast from "./commonComponents/customToast/CustomToast";
import CustomAlert from "./commonComponents/customAlert/customAlert";

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
