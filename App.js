import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RootNavigation from "./components/rootNavigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./contextapis/AuthContext";



export default function App() { 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}} edges={["top","right","left"]}>
        <AuthProvider>
          <RootNavigation/>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
