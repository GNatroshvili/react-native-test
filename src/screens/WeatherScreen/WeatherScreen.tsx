import WeatherCard from "@/src/components/WeatherCard/WeatherCard";
import React from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function WeatherScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headertext}>Weather</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Search city"
              placeholderTextColor="#9AA3B2"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          <Pressable style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </Pressable>
        </View>
        <WeatherCard
          city="Tbilisi"
          condition="Cloudy"
          temp="12"
          humidity="62%"
          wind="4 m/s"
          feelsLike="10"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  header: {
    paddingVertical: 8,
  },
  headertext: {
    color: "white",
    fontSize: 30,
    fontWeight: 700,
  },
  searchRow: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginTop: 12,
  },
  inputWrap: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#141B2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 15,
    width: "100%",
  },
  searchBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#2863ef",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
