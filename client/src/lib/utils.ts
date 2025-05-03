import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { WeatherCondition } from "@shared/schema";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Date(timestamp * 1000).toLocaleDateString('en-US', mergedOptions);
}

export function formatTime(timestamp: number, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', mergedOptions);
}

export function formatTemperature(temp: number, useImperial: boolean): string {
  if (useImperial) {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number, useImperialWind: boolean): string {
  if (useImperialWind) {
    return `${Math.round(speed * 2.237)} mph`;
  }
  return `${Math.round(speed * 3.6)} km/h`;
}

export function formatVisibility(visibility: number): string {
  return `${(visibility / 1000).toFixed(1)} km`;
}

export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

export function getWeatherCondition(condition: string): WeatherCondition {
  const lowerCaseCondition = condition.toLowerCase();
  
  if (lowerCaseCondition.includes('clear')) return 'clear';
  if (lowerCaseCondition.includes('cloud')) return 'clouds';
  if (lowerCaseCondition.includes('rain')) return 'rain';
  if (lowerCaseCondition.includes('drizzle')) return 'drizzle';
  if (lowerCaseCondition.includes('thunderstorm')) return 'thunderstorm';
  if (lowerCaseCondition.includes('snow')) return 'snow';
  if (lowerCaseCondition.includes('mist')) return 'mist';
  if (lowerCaseCondition.includes('fog')) return 'fog';
  if (lowerCaseCondition.includes('haze')) return 'haze';
  if (lowerCaseCondition.includes('dust')) return 'dust';
  if (lowerCaseCondition.includes('smoke')) return 'smoke';
  if (lowerCaseCondition.includes('tornado')) return 'tornado';
  
  return 'clear';
}

export function getWeatherBackground(condition: WeatherCondition, isDay: boolean): string {
  if (!isDay) return 'night';
  
  if (condition === 'clear') return 'sunny';
  if (condition === 'clouds') return 'cloudy';
  if (['rain', 'drizzle', 'thunderstorm'].includes(condition)) return 'rainy';
  
  return 'sunny';
}

export function getPrecipitationAmount(rain?: { "1h"?: number, "3h"?: number }, snow?: { "1h"?: number, "3h"?: number }): string {
  let amount = 0;
  
  if (rain) {
    amount += rain["1h"] || rain["3h"] || 0;
  }
  
  if (snow) {
    amount += snow["1h"] || snow["3h"] || 0;
  }
  
  return amount.toFixed(1);
}

export function getUVIndexLevel(uvIndex?: number): string {
  if (!uvIndex) return 'N/A';
  
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

export function getRainProbability(pop: number): string {
  return `${Math.round(pop * 100)}%`;
}

export function isDaytime(dt: number, sunrise: number, sunset: number): boolean {
  return dt > sunrise && dt < sunset;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T, 
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
