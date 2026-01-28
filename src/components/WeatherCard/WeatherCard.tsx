import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  city: string;
  condition: string;
  temp: string;
  humidity: string;
  wind: string;
  feelsLike: string;
};

export default function WeatherCard({
  city,
  condition,
  temp,
  humidity,
  wind,
  feelsLike,
}: Props) {
  return (
    <View style={styles.weatherCard}>
      <View style={styles.cardTopRow}>
        <View>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.condition}>{condition}</Text>
        </View>

        <View style={styles.tempBlock}>
          <Ionicons name="cloud-outline" size={28} color="#B8C2D6" />
          <Text style={styles.temp}>{temp}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottomRow}>
        <View style={styles.stat}>
          <View style={styles.labelRow}>
            <Text style={styles.statLabel}>Humidity</Text>
            <Ionicons name="water-outline" size={13} color="#9AA3B2" />
          </View>
          <Text style={styles.statValue}>{humidity}</Text>
        </View>

        <View style={styles.stat}>
          <View style={styles.labelRow}>
            <Text style={styles.statLabel}>Wind</Text>
            <Ionicons name="leaf-outline" size={13} color="#9AA3B2" />
          </View>
          <Text style={styles.statValue}>{wind}</Text>
        </View>

        <View style={styles.stat}>
          <View style={styles.labelRow}>
            <Text style={styles.statLabel}>Feels like</Text>
            <Ionicons name="thermometer-outline" size={13} color="#9AA3B2" />
          </View>
          <Text style={styles.statValue}>{feelsLike}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherCard: {
    width: "100%",
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: "#141B2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  city: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  condition: {
    marginTop: 4,
    color: "#B8C2D6",
    fontSize: 14,
    fontWeight: "500",
  },
  tempBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  temp: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
  },
  cardDivider: {
    marginVertical: 14,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  stat: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "space-between"
  },
  statLabel: {
    color: "#9AA3B2",
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
