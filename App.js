import { StatusBar } from "expo-status-bar";
import React from "react";
import RootNavigation from './navigations/rootNavigation'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./contextapis/AuthContext";
import { NavigationContainer } from "@react-navigation/native";


export default function App() { 
  return (
    <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigation/>
          </NavigationContainer>
        </AuthProvider>
    </SafeAreaProvider>
  );
}
