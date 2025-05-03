import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CurrentWeather, DailyForecast, HourlyForecast } from '@shared/schema';
import { fetchCurrentWeather, fetchForecast } from '@/lib/api';
import { mapWeatherCondition } from '@/lib/weather';

export function useWeather() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  // Fetch current weather
  const { 
    data: currentWeather,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    refetch: refetchCurrent
  } = useQuery({
    queryKey: ['/api/weather/current', coordinates?.lat, coordinates?.lon],
    queryFn: () => {
      if (!coordinates) return Promise.reject('No coordinates provided');
      return fetchCurrentWeather(coordinates.lat, coordinates.lon);
    },
    enabled: !!coordinates,
  });

  // Fetch forecast
  const { 
    data: forecastData,
    isLoading: isForecastLoading,
    isError: isForecastError,
    refetch: refetchForecast
  } = useQuery({
    queryKey: ['/api/weather/forecast', coordinates?.lat, coordinates?.lon],
    queryFn: () => {
      if (!coordinates) return Promise.reject('No coordinates provided');
      return fetchForecast(coordinates.lat, coordinates.lon);
    },
    enabled: !!coordinates,
  });

  const fetchWeatherForLocation = useCallback((lat: number, lon: number) => {
    setCoordinates({ lat, lon });
  }, []);

  const refetch = useCallback(() => {
    refetchCurrent();
    refetchForecast();
  }, [refetchCurrent, refetchForecast]);

  return {
    currentWeather,
    forecast: forecastData,
    isLoading: isCurrentLoading || isForecastLoading,
    isError: isCurrentError || isForecastError,
    fetchWeatherForLocation,
    refetch
  };
}
