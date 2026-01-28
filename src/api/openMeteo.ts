export type GeocodingResult = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string; 
};

type GeocodingResponse = {
  results?: GeocodingResult[];
};

export type CurrentWeather = {
  city: string; 
  condition: string; 
  temp: number; 
  humidity: number; 
  wind: number; 
  feelsLike: number; 
};

type ForecastResponse = {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
};

function weatherCodeToText(code: number): string {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Cloudy";
}

export async function geocodeCity(name: string): Promise<GeocodingResult> {
  const q = encodeURIComponent(name.trim());
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");
  const data = (await res.json()) as GeocodingResponse;

  const first = data.results?.[0];
  if (!first) throw new Error("City not found");
  return first;
}

export async function getCurrentWeatherByCity(
  cityName: string,
): Promise<CurrentWeather> {
  const place = await geocodeCity(cityName);

  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
    ].join(","),
    timezone: "auto",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = (await res.json()) as ForecastResponse;

  const cur = data.current;
  if (!cur) throw new Error("No current weather data");

  return {
    city: place.name,
    condition: weatherCodeToText(cur.weather_code),
    temp: cur.temperature_2m,
    humidity: cur.relative_humidity_2m,
    wind: cur.wind_speed_10m,
    feelsLike: cur.apparent_temperature,
  };
}
