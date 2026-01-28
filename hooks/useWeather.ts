import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { WeatherData, mapWeatherCode } from "../utils/weather";

const RECENT_SEARCHES_KEY = "@weather_app_recent_searches";

export function useWeather() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      } else {
        setRecentSearches(["New York", "London", "Tokyo"]);
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (e) {
      console.error("Failed to save recent searches", e);
    }
  };

  const handleSearch = async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please try another name.");
      }

      const { latitude, longitude, name: cityName } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=auto`,
      );
      const weatherData = await weatherRes.json();

      const current = weatherData.current;
      const { condition, icon, iconUrl, bgColors } = mapWeatherCode(
        current.weather_code,
        current.is_day === 1,
      );

      const newWeather: WeatherData = {
        city: cityName,
        temp: Math.round(current.temperature_2m),
        condition: condition,
        icon: icon,
        iconUrl: iconUrl,
        humidity: `${current.relative_humidity_2m}%`,
        wind: `${Math.round(current.wind_speed_10m)} km/h`,
        feelsLike: Math.round(current.apparent_temperature),
        bgColors: bgColors,
      };

      setWeather(newWeather);

      if (
        !recentSearches.some((s) => s.toLowerCase() === cityName.toLowerCase())
      ) {
        const updated = [cityName, ...recentSearches].slice(0, 5);
        setRecentSearches(updated);
        saveRecentSearches(updated);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    recentSearches,
    weather,
    loading,
    error,
    handleSearch,
  };
}
