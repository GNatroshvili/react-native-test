import WeatherScreen from "@/src/screens/WeatherScreen/WeatherScreen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.app}>
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
