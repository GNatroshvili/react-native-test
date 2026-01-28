import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import WeatherScreen from "@/src/screens/WeatherScreen/WeatherScreen";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StatusBar style="light" />
      <WeatherScreen />
    </View>
  );
}
