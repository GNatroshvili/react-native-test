import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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

// Mock weather data type
type WeatherData = {
  city: string;
  temp: number;
  condition: string;
  icon: keyof typeof Ionicons.glyphMap;
  humidity: string;
  wind: string;
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "New York",
    "London",
    "Tokyo",
  ]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Mock search function
  const handleSearch = (city: string) => {
    if (!city.trim()) return;

    const conditions: Array<{
      cond: string;
      icon: keyof typeof Ionicons.glyphMap;
    }> = [
      { cond: "Sunny", icon: "sunny-outline" },
      { cond: "Partly Cloudy", icon: "partly-sunny-outline" },
      { cond: "Cloudy", icon: "cloudy-outline" },
      { cond: "Rainy", icon: "rainy-outline" },
      { cond: "Thunderstorm", icon: "thunderstorm-outline" },
      { cond: "Snowy", icon: "snow-outline" },
    ];

    const randomIdx = Math.floor(Math.random() * conditions.length);
    const selected = conditions[randomIdx];

    // Simulate finding weather
    const mockWeather: WeatherData = {
      city: city,
      temp:
        Math.floor(Math.random() * 30) + (selected.cond === "Snowy" ? -5 : 5),
      condition: selected.cond,
      icon: selected.icon,
      humidity: `${Math.floor(Math.random() * 60) + 30}%`,
      wind: `${Math.floor(Math.random() * 20) + 5} km/h`,
    };

    setWeather(mockWeather);

    // Add to recent searches if not already there
    if (!recentSearches.includes(city)) {
      setRecentSearches((prev) => [city, ...prev].slice(0, 5));
    }
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
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
                onSubmitEditing={() => handleSearch(searchQuery)}
                placeholderTextColor="#999"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearch(searchQuery)}
            >
              <Text style={styles.searchButtonText}>Search</Text>
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
                >
                  <Ionicons name="time-outline" size={14} color="#007AFF" />
                  <Text style={styles.recentText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Weather Display */}
          {weather ? (
            <View style={styles.weatherCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cityName}>{weather.city}</Text>
                  <Text style={styles.dateText}>Today, 28 Jan</Text>
                </View>
                <Ionicons name={weather.icon} size={64} color="#007AFF" />
              </View>

              <View style={styles.tempContainer}>
                <Text style={styles.tempText}>{weather.temp}°</Text>
                <Text style={styles.conditionText}>{weather.condition}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={24} color="#555" />
                  <Text style={styles.detailLabel}>Humidity</Text>
                  <Text style={styles.detailValue}>{weather.humidity}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="leaf-outline" size={24} color="#555" />
                  <Text style={styles.detailLabel}>Wind</Text>
                  <Text style={styles.detailValue}>{weather.wind}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="thermometer-outline" size={24} color="#555" />
                  <Text style={styles.detailLabel}>Feels Like</Text>
                  <Text style={styles.detailValue}>{weather.temp - 2}°</Text>
                </View>
              </View>
            </View>
          ) : (
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
  weatherCard: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  dateText: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  tempContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  tempText: {
    fontSize: 80,
    fontWeight: "200",
    color: "#1A1A1A",
  },
  conditionText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F3F5",
    marginVertical: 25,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 2,
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
