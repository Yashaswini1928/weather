import { apiRequest } from "./queryClient";
import { CurrentWeather, DailyForecast, HourlyForecast, SearchLocation, UserSettings, Favorite } from "@shared/schema";

// Weather API
export async function fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const res = await apiRequest("GET", `/api/weather/current?lat=${lat}&lon=${lon}`, undefined);
  return res.json();
}

export async function fetchForecast(lat: number, lon: number): Promise<{
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}> {
  const res = await apiRequest("GET", `/api/weather/forecast?lat=${lat}&lon=${lon}`, undefined);
  return res.json();
}

export async function searchLocations(query: string): Promise<SearchLocation[]> {
  const res = await apiRequest("GET", `/api/weather/search?q=${encodeURIComponent(query)}`, undefined);
  return res.json();
}

export async function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// Favorites API
export async function getFavorites(): Promise<Favorite[]> {
  const res = await apiRequest("GET", "/api/favorites", undefined);
  return res.json();
}

export async function addFavorite(favorite: Omit<Favorite, "id" | "userId">): Promise<Favorite> {
  const res = await apiRequest("POST", "/api/favorites", favorite);
  return res.json();
}

export async function removeFavorite(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/favorites/${id}`, undefined);
}

// Settings API
export async function getSettings(): Promise<UserSettings> {
  const res = await apiRequest("GET", "/api/settings", undefined);
  return res.json();
}

export async function updateSettings(settings: UserSettings): Promise<UserSettings> {
  const res = await apiRequest("PUT", "/api/settings", settings);
  return res.json();
}
