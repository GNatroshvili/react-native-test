import WeatherCard from "@/src/components/WeatherCard/WeatherCard";
import React, { useEffect, useState } from "react";

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
};

export default function WeatherScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<WeatherUI | null>(null);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    loadRecents().then(setRecents);
  }, []);

  const applyWeather = async (data: WeatherUI) => {
    setWeather(data);
    const updated = await addRecent(data.city);
    setRecents(updated);
    await saveWeatherToCache(data);
  };

  const onSearch = async (cityOverride?: string) => {
    const city = (cityOverride ?? query).trim();
    if (!city) return;
    if (loading) return;

    Keyboard.dismiss();
    setError("");
    setLoading(true);

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
      setQuery("");
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
    }
  };

  const bgImage = weather ? getWeatherBg(weather.condition) : null;

  const Content = (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, width: "100%" }}
    >
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={styles.content}>
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
              <Text style={styles.searchBtnText}>Search</Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : error ? (
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
                <Text style={styles.recentsTitle}>Recent Searches</Text>
                <Pressable
                  hitSlop={20}
                  onPress={async () => {
                    await clearRecents();
                    setRecents([]);
                  }}
                  style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                >
                  <Text style={styles.clearText}>Clear all</Text>
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
                    onPress={() => {
                      setQuery(item);
                      onSearch(item);
                    }}
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
    <View style={[styles.container, { backgroundColor: "#141B2E" }]}>
      {Content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 15, 26, 0.55)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  header: {
    paddingVertical: 8,
  },
  headertext: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  searchRow: {
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginTop: 12,
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
    backgroundColor: "#2863ef",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  searchBtnPressed: {
    backgroundColor: "#1f4fd8",
  },
  searchBtnDisabled: {
    opacity: 0.6,
  },
  recentsWrap: {
    width: "100%",
    marginTop: 24,
  },
  recentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  recentsTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  clearText: {
    color: "#6366F1",
    fontSize: 14,
    fontWeight: "600",
  },
  recentItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignSelf: "flex-start",
  },
  recentItemPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: [{ scale: 0.98 }],
  },
  recentText: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "500",
  },
});