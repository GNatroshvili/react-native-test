import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENTS_KEY = "recents_v1";
const WEATHER_CACHE_KEY = "weather_cache_v1";
const MAX_RECENTS = 8;

export async function loadRecents(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(RECENTS_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((x) => typeof x === "string");
    return [];
  } catch {
    return [];
  }
}

export async function addRecent(city: string): Promise<string[]> {
  const clean = city.trim();
  if (!clean) return loadRecents();

  const current = await loadRecents();
  const next = [
    clean,
    ...current.filter((c) => c.toLowerCase() !== clean.toLowerCase()),
  ].slice(0, MAX_RECENTS);

  await AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  return next;
}

export async function clearRecents(): Promise<void> {
  await AsyncStorage.removeItem(RECENTS_KEY);
}

type WeatherCardData = {
  city: string;
  condition: string;
  temp: string;
  humidity: string;
  wind: string;
  feelsLike: string;
};

type CacheMap = Record<string, WeatherCardData>;

export async function saveWeatherToCache(data: WeatherCardData): Promise<void> {
  const key = data.city.trim().toLowerCase();
  if (!key) return;

  const raw = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
  let map: CacheMap = {};
  try {
    if (raw) map = JSON.parse(raw) || {};
  } catch {
    map = {};
  }

  map[key] = data;
  await AsyncStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(map));
}

export async function loadWeatherFromCache(
  city: string,
): Promise<WeatherCardData | null> {
  const key = city.trim().toLowerCase();
  if (!key) return null;

  const raw = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
  if (!raw) return null;

  try {
    const map = JSON.parse(raw) as CacheMap;
    return map?.[key] ?? null;
  } catch {
    return null;
  }
}
