import { useState } from "react";
import { CurrentWeather as CurrentWeatherType } from "@shared/schema";
import { 
  formatDate, 
  formatTime, 
  formatTemperature, 
  formatWindSpeed, 
  formatVisibility, 
  formatPressure,
  getUVIndexLevel
} from "@/lib/utils";
import { getWeatherIcon } from "@/lib/weather";
import WeatherIcon from "./WeatherIcon";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  useImperial: boolean;
  useImperialWind: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToggleUnit: () => void;
}

export default function CurrentWeather({ 
  data, 
  useImperial, 
  useImperialWind, 
  isFavorite, 
  onToggleFavorite, 
  onToggleUnit 
}: CurrentWeatherProps) {
  const formattedTemp = formatTemperature(data.temp, useImperial);
  const formattedFeelsLike = formatTemperature(data.feelsLike, useImperial);
  const formattedWindSpeed = formatWindSpeed(data.wind.speed, useImperialWind);
  const formattedVisibility = formatVisibility(data.visibility);
  const formattedPressure = formatPressure(data.pressure);
  const currentDate = formatDate(data.dt, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const sunriseTime = formatTime(data.sunrise);
  const sunsetTime = formatTime(data.sunset);
  const isDay = data.dt > data.sunrise && data.dt < data.sunset;
  const precipitationAmount = data.rain?.["1h"] || data.rain?.["3h"] || 0;
  const rainChance = "5%"; // This would ideally come from forecast data
  const uvIndexLevel = getUVIndexLevel(data.uvIndex);

  return (
    <section className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-darkest">{data.location}, {data.country}</h2>
              <p className="text-neutral-dark">{currentDate}</p>
            </div>
            <button 
              className="text-neutral hover:text-primary transition-colors" 
              onClick={onToggleFavorite}
            >
              <span className="material-icons">
                {isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>
          
          <div className="flex flex-wrap items-center">
            <div className="flex items-center mr-6">
              <span className="material-icons text-6xl text-primary mr-2">
                {getWeatherIcon(data.condition, isDay)}
              </span>
              <div>
                <span className="text-5xl font-light">{formattedTemp.split('°')[0]}°</span>
                <button 
                  className="ml-1 text-sm text-neutral-dark hover:text-primary" 
                  onClick={onToggleUnit}
                >
                  <span>{useImperial ? 'F' : 'C'}</span>
                </button>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-xl text-neutral-darkest capitalize">{data.description}</p>
              <p className="text-gray-600">Feels like {formattedFeelsLike}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap mt-6 text-gray-600">
            <div className="mr-6 mb-4">
              <p className="flex items-center"><span className="material-icons mr-1 text-primary">air</span> Wind</p>
              <p className="font-medium text-gray-800">{formattedWindSpeed}</p>
            </div>
            <div className="mr-6 mb-4">
              <p className="flex items-center"><span className="material-icons mr-1 text-primary">water_drop</span> Humidity</p>
              <p className="font-medium text-gray-800">{data.humidity}%</p>
            </div>
            <div className="mr-6 mb-4">
              <p className="flex items-center"><span className="material-icons mr-1 text-primary">visibility</span> Visibility</p>
              <p className="font-medium text-gray-800">{formattedVisibility}</p>
            </div>
            <div className="mb-4">
              <p className="flex items-center"><span className="material-icons mr-1 text-primary">compress</span> Pressure</p>
              <p className="font-medium text-gray-800">{formattedPressure}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary-light bg-opacity-10 p-6 md:w-1/3">
          <h3 className="text-xl font-medium mb-3 text-primary-dark">Today's Highlights</h3>
          
          <div className="space-y-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-gray-600 text-sm">UV Index</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-medium">{data.uvIndex || 'N/A'}</span>
                <div className="w-1/2 bg-neutral-light rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full" 
                    style={{ width: data.uvIndex ? `${Math.min(data.uvIndex * 10, 100)}%` : '0%' }}
                  ></div>
                </div>
                <span className={`text-sm ${
                  uvIndexLevel === 'Low' ? 'text-success' : 
                  uvIndexLevel === 'Moderate' ? 'text-secondary' : 
                  uvIndexLevel === 'High' ? 'text-secondary-dark' : 
                  'text-destructive'
                }`}>
                  {uvIndexLevel}
                </span>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-gray-600 text-sm">Sunrise & Sunset</p>
              <div className="flex justify-between mt-1">
                <div className="flex items-center">
                  <span className="material-icons text-secondary mr-1">wb_sunny</span>
                  <span>{sunriseTime}</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary-dark mr-1">nightlight</span>
                  <span>{sunsetTime}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="text-gray-600 text-sm">Precipitation</p>
              <div className="flex items-center mt-1">
                <span className="material-icons text-primary mr-1">opacity</span>
                <span className="text-xl font-medium">{precipitationAmount.toFixed(1)} mm</span>
              </div>
              <div className="flex text-sm mt-1">
                <span className="text-gray-600">Chance of rain: </span>
                <span className="ml-1 font-medium">{rainChance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
