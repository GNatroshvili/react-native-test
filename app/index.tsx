import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
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

// Weather data type for Open-Meteo
type WeatherData = {
  city: string;
  temp: number;
  condition: string;
  icon: keyof typeof Ionicons.glyphMap;
  humidity: string;
  wind: string;
  feelsLike: number;
};

// Map WMO codes to UI descriptions and icons
const mapWeatherCode = (
  code: number,
): { condition: string; icon: keyof typeof Ionicons.glyphMap } => {
  if (code === 0) return { condition: "Clear Sky", icon: "sunny-outline" };
  if (code >= 1 && code <= 3)
    return { condition: "Partly Cloudy", icon: "partly-sunny-outline" };
  if (code === 45 || code === 48)
    return { condition: "Fog", icon: "cloudy-outline" };
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82))
    return { condition: "Rainy", icon: "rainy-outline" };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86))
    return { condition: "Snowy", icon: "snow-outline" };
  if (code >= 95)
    return { condition: "Thunderstorm", icon: "thunderstorm-outline" };
  return { condition: "Unknown", icon: "help-circle-outline" };
};

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "New York",
    "London",
    "Tokyo",
  ]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      // 1. Geocoding API to get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please try another name.");
      }

      const { latitude, longitude, name: cityName } = geoData.results[0];

      // 2. Weather Forecast API
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
      );
      const weatherData = await weatherRes.json();

      const current = weatherData.current;
      const { condition, icon } = mapWeatherCode(current.weather_code);

      const newWeather: WeatherData = {
        city: cityName,
        temp: Math.round(current.temperature_2m),
        condition: condition,
        icon: icon,
        humidity: `${current.relative_humidity_2m}%`,
        wind: `${Math.round(current.wind_speed_10m)} km/h`,
        feelsLike: Math.round(current.apparent_temperature),
      };

      setWeather(newWeather);

      // Add to recent searches (case insensitive check)
      if (
        !recentSearches.some((s) => s.toLowerCase() === cityName.toLowerCase())
      ) {
        setRecentSearches((prev) => [cityName, ...prev].slice(0, 5));
      }
      setSearchQuery("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
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
                onSubmitEditing={() => handleSearch(searchQuery)}
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
              onPress={() => handleSearch(searchQuery)}
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
          {weather && !loading && (
            <View style={styles.weatherCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cityInfo}>
                  <Text style={styles.cityName}>{weather.city}</Text>
                  <Text style={styles.dateText}>
                    {new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
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
                  <Text style={styles.detailValue}>{weather.feelsLike}°</Text>
                </View>
              </View>
            </View>
          )}

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
  cityInfo: {
    flex: 1,
    marginRight: 10,
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
