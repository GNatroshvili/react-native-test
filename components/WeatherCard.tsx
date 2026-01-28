import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { WeatherData } from "../utils/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
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
        {weather.iconUrl ? (
          <Image
            source={{ uri: weather.iconUrl }}
            style={styles.weatherIcon}
            contentFit="contain"
            transition={500}
            priority="high"
          />
        ) : (
          <Ionicons name={weather.icon} size={64} color="#007AFF" />
        )}
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
  );
};

const styles = StyleSheet.create({
  weatherCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
  weatherIcon: {
    width: 100,
    height: 100,
    marginRight: -10,
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
});
