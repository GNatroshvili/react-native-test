import WeatherScreen from "@/src/screens/WeatherScreen/WeatherScreen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.app}>
      <Stack.Screen options={{ headerShown: false }}></Stack.Screen>
      <StatusBar style="light" />
      <WeatherScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
});
