import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function WeatherScreen() {
  return (
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
          />
        </View>

        <Pressable style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Search</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48
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
    backgroundColor: "#2E6BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
