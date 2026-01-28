import { Ionicons } from "@expo/vector-icons";

export type WeatherData = {
  city: string;
  temp: number;
  condition: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconUrl: string;
  humidity: string;
  wind: string;
  feelsLike: number;
  bgColors: [string, string, ...string[]];
};

// Map WMO codes to UI descriptions, icons, and image URLs
export const mapWeatherCode = (
  code: number,
  isDay: boolean = true,
): {
  condition: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconUrl: string;
  bgColors: [string, string, ...string[]];
} => {
  const suffix = isDay ? "d" : "n";

  if (code === 0)
    return {
      condition: "Clear Sky",
      icon: "sunny-outline",
      iconUrl: `https://openweathermap.org/img/wn/01${suffix}@4x.png`,
      bgColors: isDay
        ? ["#4CA1AF", "#2C3E50"]
        : ["#1a2a6c", "#b21f1f", "#fdbb2d"],
    };

  if (code >= 1 && code <= 3)
    return {
      condition: "Partly Cloudy",
      icon: "partly-sunny-outline",
      iconUrl: `https://openweathermap.org/img/wn/02${suffix}@4x.png`,
      bgColors: isDay ? ["#BDC3C7", "#2C3E50"] : ["#232526", "#414345"],
    };

  if (code === 45 || code === 48)
    return {
      condition: "Fog",
      icon: "cloudy-outline",
      iconUrl: `https://openweathermap.org/img/wn/50${suffix}@4x.png`,
      bgColors: ["#757F9A", "#D7DDE8"],
    };

  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82))
    return {
      condition: "Rainy",
      icon: "rainy-outline",
      iconUrl: `https://openweathermap.org/img/wn/10${suffix}@4x.png`,
      bgColors: ["#203A43", "#2C5364"],
    };

  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86))
    return {
      condition: "Snowy",
      icon: "snow-outline",
      iconUrl: `https://openweathermap.org/img/wn/13${suffix}@4x.png`,
      bgColors: ["#83a4d4", "#b6fbff"],
    };

  if (code >= 95)
    return {
      condition: "Thunderstorm",
      icon: "thunderstorm-outline",
      iconUrl: `https://openweathermap.org/img/wn/11${suffix}@4x.png`,
      bgColors: ["#0f0c29", "#302b63", "#24243e"],
    };

  return {
    condition: "Unknown",
    icon: "help-circle-outline",
    iconUrl: "",
    bgColors: ["#F8F9FA", "#E9ECEF"],
  };
};
