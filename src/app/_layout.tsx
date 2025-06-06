import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { WSProvider } from "@/service/WSProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(); // 👈 Suppresses all warnings

const Layout = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <WSProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="role" />
          <Stack.Screen name="customer/selectedLocation" />
          <Stack.Screen name="customer/home" />
          <Stack.Screen name="customer/RideBooking" />
          <Stack.Screen name="customer/auth" />
          <Stack.Screen name="rider/auth" />
          <Stack.Screen name="rider/home" />
          <Stack.Screen name="customer/liveride" />
          <Stack.Screen name="rider/liveride" />
        </Stack>
      </WSProvider>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Layout;
