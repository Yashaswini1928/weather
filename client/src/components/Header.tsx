import { useState } from "react";
import { useLocation } from "wouter";
import LocationSearch from "./LocationSearch";
import { SearchLocation } from "@shared/schema";

interface HeaderProps {
  onLocationSelect: (location: SearchLocation) => void;
  onSettingsClick: () => void;
  onFavoritesToggle: () => void;
}

export default function Header({
  onLocationSelect,
  onSettingsClick,
  onFavoritesToggle,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(`/api/weather/reverse-geocode?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data[0]) {
                onLocationSelect(data[0]);
              }
            })
            .catch(err => {
              console.error("Error getting location name:", err);
            });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-primary py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="material-icons text-white mr-2 text-3xl">wb_sunny</span>
            <h1 className="text-2xl font-bold text-white">WeatherView</h1>
          </div>
          
          <LocationSearch onLocationSelect={onLocationSelect} />
          
          <nav className="hidden md:flex items-center space-x-4">
            <button 
              className="text-white hover:text-neutral-lightest flex items-center" 
              onClick={handleMyLocationClick}
            >
              <span className="material-icons mr-1">my_location</span>
              <span>My Location</span>
            </button>
            <button 
              className="text-white hover:text-neutral-lightest flex items-center"
              onClick={onFavoritesToggle}
            >
              <span className="material-icons mr-1">favorite</span>
              <span>Favorites</span>
            </button>
            <button 
              className="text-white hover:text-neutral-lightest flex items-center"
              onClick={onSettingsClick}
            >
              <span className="material-icons mr-1">settings</span>
              <span>Settings</span>
            </button>
          </nav>
          
          <button 
            className="md:hidden text-white mt-2" 
            onClick={toggleMobileMenu}
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className="md:hidden bg-white shadow-md transition-all duration-300 overflow-hidden" 
        style={{ maxHeight: isMobileMenuOpen ? '300px' : '0' }}
      >
        <nav className="px-6 py-4 flex flex-col space-y-4">
          <button 
            className="flex items-center text-neutral-darkest py-2 border-b border-neutral-light"
            onClick={handleMyLocationClick}
          >
            <span className="material-icons mr-2">my_location</span>
            <span>My Location</span>
          </button>
          <button 
            className="flex items-center text-neutral-darkest py-2 border-b border-neutral-light"
            onClick={onFavoritesToggle}
          >
            <span className="material-icons mr-2">favorite</span>
            <span>Favorites</span>
          </button>
          <button 
            className="flex items-center text-neutral-darkest py-2 border-b border-neutral-light"
            onClick={onSettingsClick}
          >
            <span className="material-icons mr-2">settings</span>
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </>
  );
}
