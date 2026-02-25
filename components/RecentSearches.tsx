import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecentSearchesProps {
  recentSearches: string[];
  onSearch: (city: string) => void;
  loading: boolean;
  isDarkBg?: boolean;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  recentSearches,
  onSearch,
  loading,
  isDarkBg,
}) => {
  if (recentSearches.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDarkBg && styles.lightText]}>
        Recent Searches
      </Text>
      <View style={styles.recentList}>
        {recentSearches.map((city, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentItem}
            onPress={() => onSearch(city)}
            disabled={loading}
          >
            <Ionicons name="time-outline" size={14} color="#007AFF" />
            <Text style={styles.recentText}>{city}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  lightText: {
    color: "#FFF",
  },
  recentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233, 236, 239, 0.9)",
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
});
