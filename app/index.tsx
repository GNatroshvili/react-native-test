import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WeatherCard } from "../components/WeatherCard";
import { useWeather } from "../hooks/useWeather";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { recentSearches, weather, loading, error, handleSearch } =
    useWeather();

  const onSearch = (city: string) => {
    handleSearch(city);
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Weather</Text>

          {/* Search Input Area */}
          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="search-outline"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Search city..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => onSearch(searchQuery)}
                placeholderTextColor="#999"
                editable={!loading}
              />
              {searchQuery.length > 0 && !loading && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.searchButton,
                loading && styles.searchButtonDisabled,
              ]}
              onPress={() => onSearch(searchQuery)}
              disabled={loading}
            >
              <Text style={styles.searchButtonText}>
                {loading ? "..." : "Search"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentList}>
              {recentSearches.map((city, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleSearch(city)}
                  disabled={loading}
                >
                  <Ionicons name="time-outline" size={14} color="#007AFF" />
                  <Text style={styles.recentText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Feedback */}
          {loading && (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.statusText}>Fetching weather data...</Text>
            </View>
          )}

          {error && !loading && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Weather Display */}
          {weather && !loading && <WeatherCard weather={weather} />}

          {!weather && !loading && !error && (
            <View style={styles.emptyContainer}>
              <Ionicons name="cloud-outline" size={80} color="#E0E0E0" />
              <Text style={styles.emptyText}>
                Search for a city to see the weather
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  searchButtonDisabled: {
    backgroundColor: "#A0CFFF",
  },
  searchButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  recentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9ECEF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  recentText: {
    color: "#495057",
    fontSize: 14,
    fontWeight: "500",
  },
  statusContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  statusText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 15,
    color: "#FF3B30",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 40,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 15,
    fontSize: 16,
    lineHeight: 24,
  },
});
