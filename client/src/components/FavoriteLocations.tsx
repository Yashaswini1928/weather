import { Favorite, CurrentWeather, SearchLocation } from "@shared/schema";
import { formatTemperature } from "@/lib/utils";
import { getWeatherIcon, getCityBackground } from "@/lib/weather";
import { useQuery } from "@tanstack/react-query";

interface FavoriteLocationsProps {
  favorites: Favorite[];
  onSelect: (location: { lat: number, lon: number, name: string }) => void;
  onManageClick: () => void;
  useImperial: boolean;
}

export default function FavoriteLocations({
  favorites,
  onSelect,
  onManageClick,
  useImperial
}: FavoriteLocationsProps) {
  const { data: weatherData } = useQuery({
    queryKey: ['/api/weather/favorites'],
    enabled: favorites.length > 0,
  });

  const handleAddFirstFavorite = () => {
    onManageClick();
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-neutral-darkest">Favorite Locations</h2>
        <button
          className="text-primary hover:text-primary-dark flex items-center"
          onClick={onManageClick}
        >
          <span className="material-icons mr-1">settings</span>
          <span>Manage</span>
        </button>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite, index) => {
            const weather = weatherData?.[index];
            const background = getCityBackground(favorite.locationName);

            return (
              <div
                key={favorite.id}
                className="weather-card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelect({
                  lat: parseFloat(favorite.lat),
                  lon: parseFloat(favorite.lon),
                  name: favorite.locationName
                })}
              >
                <div
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url('${background}')` }}
                ></div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-neutral-darkest">{favorite.locationName}</h3>
                    {weather && (
                      <div className="flex items-center">
                        <span className="material-icons text-2xl mr-1 text-primary">
                          {getWeatherIcon(weather.condition)}
                        </span>
                        <span>{formatTemperature(weather.temp, useImperial).split('°')[0]}°</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-neutral capitalize">
                    {weather?.description || 'Loading...'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-neutral-dark">No favorite locations yet.</p>
          <button
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition duration-200"
            onClick={handleAddFirstFavorite}
          >
            Add Your First Location
          </button>
        </div>
      )}
    </section>
  );
}
