import { DailyForecast } from "@shared/schema";
import { formatDate, formatTemperature } from "@/lib/utils";
import { getWeatherIcon } from "@/lib/weather";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface ForecastProps {
  data: DailyForecast[];
  useImperial: boolean;
  onUnitChange: (useImperial: boolean) => void;
}

export default function Forecast({ data, useImperial, onUnitChange }: ForecastProps) {
  const handleUnitChange = (checked: boolean) => {
    onUnitChange(checked);
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-neutral-darkest">5-Day Forecast</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-dark">°C</span>
          <Switch
            checked={useImperial}
            onCheckedChange={handleUnitChange}
          />
          <span className="text-sm text-neutral-dark">°F</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {data.map((day, index) => (
          <div key={index} className="weather-card bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-center font-medium text-neutral-dark">
              {formatDate(day.dt, { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <div className="flex justify-center my-3">
              <span className="material-icons text-4xl text-primary">
                {getWeatherIcon(day.condition)}
              </span>
            </div>
            <p className="text-center font-medium text-neutral-darkest mb-1 capitalize">
              {day.weather[0].description}
            </p>
            <div className="flex justify-center items-center space-x-2">
              <span className="font-bold">
                {formatTemperature(day.temp.max, useImperial).split('°')[0]}°
              </span>
              <span className="text-neutral">
                {formatTemperature(day.temp.min, useImperial).split('°')[0]}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
