import { WeatherCondition } from "@shared/schema";

// Maps weather condition to appropriate icon
export function getWeatherIcon(condition: WeatherCondition, isDay: boolean = true): string {
  switch (condition) {
    case 'clear':
      return isDay ? 'wb_sunny' : 'nightlight';
    case 'clouds':
      return isDay ? 'cloud' : 'nights_stay';
    case 'rain':
      return 'grain';
    case 'drizzle':
      return 'grain';
    case 'thunderstorm':
      return 'thunderstorm';
    case 'snow':
      return 'ac_unit';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'waves';
    case 'dust':
    case 'smoke':
      return 'air';
    case 'tornado':
      return 'tornado';
    default:
      return isDay ? 'wb_sunny' : 'nightlight';
  }
}

// Maps weather condition to background class
export function getBackgroundClass(condition: WeatherCondition, isDay: boolean = true): string {
  if (!isDay) return 'bg-night text-white';
  
  switch (condition) {
    case 'clear':
      return 'bg-sunny';
    case 'clouds':
      return 'bg-cloudy';
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return 'bg-rainy';
    default:
      return 'bg-sunny';
  }
}

// Maps OpenWeatherMap weather condition code to our condition type
export function mapWeatherCondition(code: number): WeatherCondition {
  // https://openweathermap.org/weather-conditions
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) {
    if (code === 741) return 'fog';
    if (code === 711) return 'smoke';
    if (code === 721) return 'haze';
    if (code === 731 || code === 761) return 'dust';
    if (code === 771) return 'rain';
    if (code === 781) return 'tornado';
    return 'mist';
  }
  if (code === 800) return 'clear';
  if (code >= 801 && code < 900) return 'clouds';
  
  return 'clear';
}

// City background images for favorite locations
export const cityBackgrounds = {
  default: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500",
  paris: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=500",
  tokyo: "https://images.unsplash.com/photo-1444084316824-dc26d6657664?auto=format&fit=crop&w=500",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500",
  sydney: "https://images.unsplash.com/photo-1555589228-7354010d4a17?auto=format&fit=crop&w=500",
  rome: "https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=500",
  "hong kong": "https://images.unsplash.com/photo-1506970845246-18f21d533b22?auto=format&fit=crop&w=500",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=500",
};

export function getCityBackground(cityName: string): string {
  const lowercaseName = cityName.toLowerCase();
  
  for (const [key, url] of Object.entries(cityBackgrounds)) {
    if (lowercaseName.includes(key)) {
      return url;
    }
  }
  
  return cityBackgrounds.default;
}

// Weather background images
export const weatherBackgrounds = {
  sunny: "https://images.unsplash.com/photo-1561553543-1d7af598d3ec?auto=format&fit=crop&w=1200",
  cloudy: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200",
  rainy: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200",
  night: "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?auto=format&fit=crop&w=1200",
  snow: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=1200",
  thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200",
};

export function getWeatherBackgroundImage(condition: WeatherCondition, isDay: boolean = true): string {
  if (!isDay) return weatherBackgrounds.night;
  
  switch (condition) {
    case 'clear':
      return weatherBackgrounds.sunny;
    case 'clouds':
      return weatherBackgrounds.cloudy;
    case 'rain':
    case 'drizzle':
      return weatherBackgrounds.rainy;
    case 'thunderstorm':
      return weatherBackgrounds.thunderstorm;
    case 'snow':
      return weatherBackgrounds.snow;
    default:
      return weatherBackgrounds.sunny;
  }
}
