import { useRef, useState } from "react";
import { HourlyForecast as HourlyForecastType } from "@shared/schema";
import { formatTime, formatTemperature } from "@/lib/utils";
import { getWeatherIcon } from "@/lib/weather";

interface HourlyForecastProps {
  data: HourlyForecastType[];
  useImperial: boolean;
}

export default function HourlyForecast({ data, useImperial }: HourlyForecastProps) {
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get the next 24 hours of data
  const hourlyData = data.slice(0, 24);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    setSelectedHourIndex(index);
    
    // Scroll to center the selected hour
    if (scrollContainerRef.current) {
      const hourWidth = 100; // Approximate width of each hour element in px
      const scrollPosition = (index * hourWidth) - (scrollContainerRef.current.clientWidth / 2) + (hourWidth / 2);
      scrollContainerRef.current.scrollLeft = Math.max(0, scrollPosition);
    }
  };
  
  return (
    <section className="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-neutral-darkest mb-4">Hourly Forecast</h2>
      
      <div className="overflow-x-auto pb-2" ref={scrollContainerRef}>
        <div className="flex space-x-8 min-w-max">
          {hourlyData.map((hour, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center w-20 ${index === selectedHourIndex ? 'bg-primary bg-opacity-10 rounded py-1' : ''}`}
            >
              <p className="text-neutral-dark">
                {index === 0 ? 'Now' : formatTime(hour.dt, { hour: 'numeric', hour12: true })}
              </p>
              <span className="material-icons text-2xl my-2 text-primary">
                {getWeatherIcon(hour.condition)}
              </span>
              <p className="font-medium text-neutral-darkest">
                {formatTemperature(hour.temp, useImperial).split('°')[0]}°
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-neutral-dark mb-2">Temperature ({useImperial ? '°F' : '°C'})</p>
        <div className="relative h-16 bg-neutral-lightest rounded">
          <div className="absolute left-0 right-0 h-full flex items-center px-8">
            <div className="w-full h-px bg-neutral-light relative">
              {/* Temperature curve */}
              <div className="absolute h-10 w-full" style={{ top: '-5px' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path 
                    d={hourlyData.map((hour, index) => {
                      const x = index * (100 / (hourlyData.length - 1));
                      // Normalize temp to 0-10 range for the SVG
                      const minTemp = Math.min(...hourlyData.map(h => h.temp));
                      const maxTemp = Math.max(...hourlyData.map(h => h.temp));
                      const range = maxTemp - minTemp;
                      const normalizedTemp = range > 0 ? 
                        10 - ((hour.temp - minTemp) / range) * 9 : 
                        5; // If all temps are the same, draw a flat line
                      
                      return `${index === 0 ? 'M' : 'L'} ${x},${normalizedTemp}`;
                    }).join(' ')}
                    stroke="#2196F3"
                    strokeWidth="0.5"
                    fill="none"
                  />
                </svg>
              </div>
              
              {/* Temperature data points */}
              {hourlyData.map((hour, index) => {
                const position = index * (100 / (hourlyData.length - 1));
                // Normalize temp position for UI
                const minTemp = Math.min(...hourlyData.map(h => h.temp));
                const maxTemp = Math.max(...hourlyData.map(h => h.temp));
                const range = maxTemp - minTemp;
                const normalizedTop = range > 0 ? 
                  10 - ((hour.temp - minTemp) / range) * 8 : 
                  5; // If all temps are the same, place dots in the middle
                
                return (
                  <div 
                    key={index}
                    className="absolute w-2 h-2 bg-primary rounded-full" 
                    style={{ 
                      left: `${position}%`, 
                      top: `${normalizedTop - 1}px`
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max={hourlyData.length - 1} 
          value={selectedHourIndex}
          onChange={handleSliderChange}
          className="temp-slider w-full h-2 bg-neutral-light rounded-lg mt-4 appearance-none cursor-pointer"
        />
      </div>
    </section>
  );
}
