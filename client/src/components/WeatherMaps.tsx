import { CurrentWeather } from "@shared/schema";

interface WeatherMapsProps {
  data: CurrentWeather;
}

export default function WeatherMaps({ data }: WeatherMapsProps) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
  const { lat, lon } = data.coord;
  
  const precipitationMapUrl = `https://tile.openweathermap.org/map/precipitation_new/1/${Math.floor(lat)}/${Math.floor(lon)}.png?appid=${apiKey}`;
  const temperatureMapUrl = `https://tile.openweathermap.org/map/temp_new/1/${Math.floor(lat)}/${Math.floor(lon)}.png?appid=${apiKey}`;
  
  return (
    <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-dark text-white p-4">
          <h3 className="text-lg font-medium">Precipitation Map</h3>
        </div>
        <div className="p-4 h-64 relative bg-neutral-lightest">
          {apiKey ? (
            <div className="w-full h-full bg-[url('https://tile.openweathermap.org/map/precipitation_new/1/0/0.png?appid=placeholder')] bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${precipitationMapUrl})` }}></div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral">
              <span className="material-icons text-6xl">map</span>
            </div>
          )}
          <p className="absolute bottom-2 right-2 text-sm text-neutral">Powered by OpenWeatherMap</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-dark text-white p-4">
          <h3 className="text-lg font-medium">Temperature Map</h3>
        </div>
        <div className="p-4 h-64 relative bg-neutral-lightest">
          {apiKey ? (
            <div className="w-full h-full bg-[url('https://tile.openweathermap.org/map/temp_new/1/0/0.png?appid=placeholder')] bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${temperatureMapUrl})` }}></div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral">
              <span className="material-icons text-6xl">map</span>
            </div>
          )}
          <p className="absolute bottom-2 right-2 text-sm text-neutral">Powered by OpenWeatherMap</p>
        </div>
      </div>
    </section>
  );
}
