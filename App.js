import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavbar from "./components/BottomNavbar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
        <NavigationContainer>
          <BottomNavbar />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
