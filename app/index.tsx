import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { RecentSearches } from "../components/RecentSearches";
import { SearchInput } from "../components/SearchInput";
import { StatusState } from "../components/StatusState";
import { WeatherCard } from "../components/WeatherCard";
import { useWeather } from "../hooks/useWeather";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const {
    recentSearches,
    weather,
    loading,
    error,
    handleSearch,
    clearWeather,
  } = useWeather();

  const onSearch = (city: string) => {
    if (!city.trim()) return;
    handleSearch(city);
    setSearchQuery("");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      clearWeather();
      setRefreshing(false);
    }, 800);
  };

  const currentBgColors: [string, string, ...string[]] = weather?.bgColors || [
    "#F8F9FA",
    "#E9ECEF",
  ];

  const isDarkBg =
    currentBgColors[0].startsWith("#0") ||
    currentBgColors[0].startsWith("#2") ||
    currentBgColors[0].startsWith("#1");

  return (
    <LinearGradient colors={currentBgColors} style={styles.flex}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={isDarkBg ? "#FFF" : "#007AFF"}
              />
            }
          >
            <Text style={[styles.title, isDarkBg && styles.lightText]}>
              Weather
            </Text>

            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={onSearch}
              loading={loading}
            />

            <RecentSearches
              recentSearches={recentSearches}
              onSearch={handleSearch}
              loading={loading}
              isDarkBg={isDarkBg}
            />

            <StatusState
              loading={loading}
              refreshing={refreshing}
              error={error}
              weather={weather}
              isDarkBg={isDarkBg}
            />

            {weather && !loading && <WeatherCard weather={weather} />}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  lightText: {
    color: "#FFF",
  },
});
