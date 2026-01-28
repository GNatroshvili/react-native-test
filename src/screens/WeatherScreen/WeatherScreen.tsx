import WeatherCard from "@/src/components/WeatherCard/WeatherCard";
import { Ionicons } from "@expo/vector-icons"; // Added
import React, { useCallback, useEffect, useState } from "react";

import { getCurrentWeatherByCity } from "@/src/api/openMeteo";
import {
  addRecent,
  clearRecents,
  loadRecents,
  loadWeatherFromCache,
  saveWeatherToCache,
} from "@/src/storage/weatherCache";
import { getWeatherBg } from "@/src/utils/WeatherBackground";

import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type WeatherUI = {
  city: string;
  condition: string;
  temp: string;
  humidity: string;
  wind: string;
  feelsLike: string;
  lastUpdated?: string;
};

export default function WeatherScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<WeatherUI | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    loadRecents().then(setRecents);
  }, []);

  const applyWeather = async (data: WeatherUI) => {
    const dataWithTime = {
      ...data,
      lastUpdated: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setWeather(dataWithTime);
    const updated = await addRecent(data.city);
    setRecents(updated);
    await saveWeatherToCache(dataWithTime);
  };

  const onSearch = async (cityOverride?: string, isRefreshing = false) => {
    const city = (cityOverride ?? query).trim();
    if (!city) return;

    if (loading && !isRefreshing) return;

    Keyboard.dismiss();
    setError("");
    if (!isRefreshing) setLoading(true);

    try {
      const w = await getCurrentWeatherByCity(city);
      const ui: WeatherUI = {
        city: w.city,
        condition: w.condition,
        temp: `${Math.round(w.temp)}°`,
        humidity: `${Math.round(w.humidity)}%`,
        wind: `${Math.round(w.wind)} m/s`,
        feelsLike: `${Math.round(w.feelsLike)}°`,
      };
      await applyWeather(ui);
      if (!isRefreshing) setQuery("");
    } catch (e: any) {
      const cached = await loadWeatherFromCache(city);
      if (cached) {
        setWeather(cached);
        const updated = await addRecent(cached.city);
        setRecents(updated);
        setError("Showing cached data (offline).");
      } else {
        setError(e?.message ?? "Something went wrong");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    if (weather?.city) {
      setRefreshing(true);
      onSearch(weather.city, true);
    } else {
      setRefreshing(false);
    }
  }, [weather]);

  const bgImage = weather ? getWeatherBg(weather.condition) : null;

  const Content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, width: "100%" }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2863ef"
            colors={["#2863ef"]}
          />
        }
      >
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.headertext}>Weather</Text>
              {weather?.lastUpdated && (
                <Text style={styles.updateText}>
                  Last updated: {weather.lastUpdated}
                </Text>
              )}
            </View>

            <View style={styles.searchRow}>
              <View style={styles.inputWrap}>
                <Ionicons name="location-outline" size={20} color="#9AA3B2" />
                <TextInput
                  placeholder="Search city"
                  placeholderTextColor="#9AA3B2"
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="search"
                  onSubmitEditing={() => onSearch()}
                  value={query}
                  onChangeText={setQuery}
                />
              </View>

              <Pressable
                onPress={() => onSearch()}
                style={({ pressed }) => [
                  styles.searchBtn,
                  pressed && styles.searchBtnPressed,
                  (loading || !query.trim()) && styles.searchBtnDisabled,
                ]}
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Ionicons name="search" size={22} color="white" />
                )}
              </Pressable>
            </View>

            {error ? (
              <Text
                style={{ marginTop: 16, color: "#FF7A7A", fontWeight: "600" }}
              >
                {error}
              </Text>
            ) : null}

            {weather ? <WeatherCard {...weather} /> : null}

            {recents.length > 0 ? (
              <View style={styles.recentsWrap}>
                <View style={styles.recentsHeader}>
                  <Text style={styles.recentsTitle}>Recent</Text>
                  <Pressable
                    hitSlop={20}
                    onPress={async () => {
                      await clearRecents();
                      setRecents([]);
                    }}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </Pressable>
                </View>

                <FlatList
                  data={recents}
                  keyExtractor={(item) => item.toLowerCase()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => onSearch(item)}
                      style={({ pressed }) => [
                        styles.recentItem,
                        pressed && styles.recentItemPressed,
                      ]}
                    >
                      <Text style={styles.recentText}>{item}</Text>
                    </Pressable>
                  )}
                />
              </View>
            ) : null}
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return bgImage ? (
    <ImageBackground
      source={bgImage}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.overlay} />
      {Content}
    </ImageBackground>
  ) : (
    <View style={[styles.container, { backgroundColor: "#0B0F1A" }]}>
      {Content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 15, 26, 0.65)",
  },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingBottom: 40,
    paddingTop: 60,
  },
  header: { paddingVertical: 8, alignItems: "center", marginBottom: 10 },
  headertext: { color: "white", fontSize: 32, fontWeight: "800" },
  updateText: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 },
  searchRow: { flexDirection: "row", gap: 10, width: "100%", marginTop: 12 },
  inputWrap: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(20, 27, 46, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  input: { flex: 1, color: "#FFFFFF", fontSize: 16, marginLeft: 10 },
  searchBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#2863ef",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnPressed: {
    backgroundColor: "#1f4fd8",
    transform: [{ scale: 0.95 }],
  },
  searchBtnDisabled: { opacity: 0.5 },
  recentsWrap: { width: "100%", marginTop: 30 },
  recentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  recentsTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  listContent: { paddingHorizontal: 4, gap: 10 },
  clearText: { color: "#6366F1", fontSize: 14, fontWeight: "600" },
  recentItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  recentItemPressed: { backgroundColor: "rgba(255, 255, 255, 0.2)" },
  recentText: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
});
