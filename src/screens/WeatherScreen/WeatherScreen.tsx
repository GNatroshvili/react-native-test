import WeatherCard from "@/src/components/WeatherCard/WeatherCard";
import React, { useState } from "react";

import { getCurrentWeatherByCity } from "@/src/api/openMeteo";
import { getWeatherBg } from "@/src/utils/WeatherBackground";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function WeatherScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<null | {
    city: string;
    condition: string;
    temp: string;
    humidity: string;
    wind: string;
    feelsLike: string;
  }>(null);

  const onSearch = async () => {
    const city = query.trim();
    if (!city) return;

    Keyboard.dismiss();
    setError("");
    setLoading(true);

    try {
      const w = await getCurrentWeatherByCity(city);

      setWeather({
        city: w.city,
        condition: w.condition,
        temp: `${Math.round(w.temp)}°`,
        humidity: `${Math.round(w.humidity)}%`,
        wind: `${Math.round(w.wind)} m/s`,
        feelsLike: `${Math.round(w.feelsLike)}°`,
      });
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Content = (
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
            onSubmitEditing={onSearch}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <Pressable
          onPress={onSearch}
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
        <Text style={{ marginTop: 16, color: "#FF7A7A", fontWeight: "600" }}>
          {error}
        </Text>
      ) : weather ? (
        <WeatherCard {...weather} />
      ) : null}
    </View>
  );

  const bgImage = weather ? getWeatherBg(weather.condition) : null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {bgImage ? (
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
      )}
    </TouchableWithoutFeedback>
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
    fontWeight: 700,
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
});
