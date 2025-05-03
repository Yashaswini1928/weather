import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CurrentWeather, SearchLocation, UserSettings } from "@shared/schema";
import Header from "@/components/Header";
import CurrentWeatherComponent from "@/components/CurrentWeather";
import Forecast from "@/components/Forecast";
import HourlyForecast from "@/components/HourlyForecast";
import WeatherMaps from "@/components/WeatherMaps";
import FavoriteLocations from "@/components/FavoriteLocations";
import SettingsModal from "@/components/SettingsModal";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useSettings } from "@/hooks/use-settings";
import { useFavorites } from "@/hooks/use-favorites";
import { useWeather } from "@/hooks/use-weather";
import { getWeatherCondition, isDaytime } from "@/lib/utils";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lon: number;
    name?: string;
  } | null>(null);

  const { settings, updateSettings } = useSettings();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { 
    currentWeather, 
    forecast, 
    isLoading, 
    isError, 
    refetch,
    fetchWeatherForLocation 
  } = useWeather();

  // Try to get user's location on initial load
  useEffect(() => {
    if (navigator.geolocation && !selectedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to a predefined location if user denies location access
          setSelectedLocation({ lat: 40.7128, lon: -74.0060, name: "New York" });
        }
      );
    } else if (!selectedLocation) {
      // Fallback if geolocation is not available
      setSelectedLocation({ lat: 40.7128, lon: -74.0060, name: "New York" });
    }
  }, [selectedLocation]);

  // Fetch weather when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherForLocation(selectedLocation.lat, selectedLocation.lon);
    }
  }, [selectedLocation, fetchWeatherForLocation]);

  const handleLocationSelect = (location: SearchLocation) => {
    setSelectedLocation({
      lat: location.lat,
      lon: location.lon,
      name: location.name
    });
  };

  const handleToggleFavorite = () => {
    if (!currentWeather) return;
    
    if (isFavorite(currentWeather.cityId)) {
      const favorite = favorites.find(f => f.cityId === currentWeather.cityId);
      if (favorite) {
        removeFavorite(favorite.id);
      }
    } else {
      addFavorite({
        cityId: currentWeather.cityId,
        locationName: currentWeather.location,
        lat: currentWeather.coord.lat.toString(),
        lon: currentWeather.coord.lon.toString()
      });
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    updateSettings(newSettings);
  };

  // Set document background based on current weather
  useEffect(() => {
    if (currentWeather && settings.dynamicBg) {
      const isDay = isDaytime(
        currentWeather.dt, 
        currentWeather.sunrise, 
        currentWeather.sunset
      );
      document.body.setAttribute(
        'data-weather', 
        isDay ? currentWeather.condition : 'night'
      );
    } else {
      document.body.removeAttribute('data-weather');
    }
    
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentWeather, settings]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onLocationSelect={handleLocationSelect}
        onSettingsClick={() => setSettingsOpen(true)}
        onFavoritesToggle={() => {
          // Scroll to favorites section
          document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="container mx-auto px-4 py-6 flex-grow">
        {isLoading && !currentWeather ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : currentWeather && forecast ? (
          <>
            <CurrentWeatherComponent
              data={currentWeather}
              useImperial={settings.useImperial}
              useImperialWind={settings.useImperialWind}
              isFavorite={isFavorite(currentWeather.cityId)}
              onToggleFavorite={handleToggleFavorite}
              onToggleUnit={() => updateSettings({ ...settings, useImperial: !settings.useImperial })}
            />

            <Forecast
              data={forecast.daily}
              useImperial={settings.useImperial}
              onUnitChange={(imperial) => updateSettings({ ...settings, useImperial: imperial })}
            />

            <HourlyForecast 
              data={forecast.hourly} 
              useImperial={settings.useImperial} 
            />

            <div id="weather-maps">
              <WeatherMaps data={currentWeather} />
            </div>

            <div id="favorites">
              <FavoriteLocations 
                favorites={favorites}
                onSelect={(location) => {
                  setSelectedLocation({
                    lat: location.lat,
                    lon: location.lon,
                    name: location.name
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onManageClick={() => setSettingsOpen(true)}
                useImperial={settings.useImperial}
              />
            </div>
          </>
        ) : null}
      </main>

      <Footer />

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onOpenChange={setSettingsOpen}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
