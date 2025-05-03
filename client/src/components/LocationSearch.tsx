import { useState, useCallback, useRef, useEffect } from "react";
import { debounce } from "@/lib/utils";
import { SearchLocation } from "@shared/schema";

interface LocationSearchProps {
  onLocationSelect: (location: SearchLocation) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<SearchLocation[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchLocationSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setLocationSuggestions([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setLocationSuggestions(data);
        setIsSuggestionsOpen(data.length > 0);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      setIsLoading(true);
      fetchLocationSuggestions(query);
    } else {
      setLocationSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationSuggestions.length > 0) {
      handleLocationSelect(locationSuggestions[0]);
    }
  };

  const handleLocationSelect = (location: SearchLocation) => {
    setSearchQuery(location.name);
    setIsSuggestionsOpen(false);
    onLocationSelect(location);
  };

  return (
    <div className="relative w-full md:w-1/2 lg:w-1/3" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="flex items-center bg-white rounded-full shadow-sm overflow-hidden">
          <span className="material-icons text-neutral p-2">search</span>
          <input
            type="text"
            className="w-full py-2 px-1 focus:outline-none text-gray-800"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => {
              if (locationSuggestions.length > 0) {
                setIsSuggestionsOpen(true);
              }
            }}
          />
          <button
            type="submit"
            className="bg-primary p-2 text-white"
            disabled={isLoading}
          >
            <span className="material-icons">{isLoading ? "sync" : "arrow_forward"}</span>
          </button>
        </div>
      </form>
      
      {isSuggestionsOpen && (
        <div className="absolute w-full mt-1 bg-white shadow-lg rounded-md z-20">
          {locationSuggestions.map((location, index) => (
            <div
              key={index}
              className="p-2 hover:bg-neutral-lightest cursor-pointer flex items-center text-gray-800"
              onClick={() => handleLocationSelect(location)}
            >
              <span className="material-icons text-gray-600 mr-2">place</span>
              <span>{location.name}, {location.country}</span>
              {location.state && <span className="text-gray-600 ml-1">({location.state})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
