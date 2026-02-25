import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface StatusStateProps {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  weather: any; // Using any for simplicity as it's just for existence check
  isDarkBg: boolean;
}

export const StatusState: React.FC<StatusStateProps> = ({
  loading,
  refreshing,
  error,
  weather,
  isDarkBg,
}) => {
  // Status Feedback (Loading)
  if (loading && !refreshing) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color={isDarkBg ? "#FFF" : "#007AFF"} />
        <Text style={[styles.statusText, isDarkBg && styles.lightText]}>
          Fetching weather data...
        </Text>
      </View>
    );
  }

  // Error State
  if (error && !loading) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Empty State
  if (!weather && !loading && !error) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cloud-outline" size={80} color="#E0E0E0" />
        <Text style={styles.emptyText}>
          Search for a city to see the weather
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  statusContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  statusText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
  },
  lightText: {
    color: "#FFF",
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
