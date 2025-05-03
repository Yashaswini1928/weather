import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { 
  CurrentWeather, 
  WeatherCondition, 
  DailyForecast, 
  HourlyForecast,
  SearchLocation,
  UserSettings
} from "@shared/schema";
import { mapWeatherCondition } from "../client/src/lib/weather";

// Add session type definition
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

// Add session to Request type
declare global {
  namespace Express {
    interface Request {
      session: {
        userId?: number;
        [key: string]: any;
      }
    }
  }
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "8d223482a132e36c23b632354537f10c";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0";

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API routes
  app.get("/api/weather/current", async (req: Request, res: Response) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric"
        }
      });
      
      const data = response.data;
      const weatherCondition = mapWeatherCondition(data.weather[0].id);
      
      const currentWeather: CurrentWeather = {
        location: data.name,
        country: data.sys.country,
        cityId: data.id.toString(),
        coord: {
          lat: data.coord.lat,
          lon: data.coord.lon
        },
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        wind: {
          speed: data.wind.speed,
          deg: data.wind.deg
        },
        condition: weatherCondition,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        clouds: data.clouds.all,
        dt: data.dt,
        timezone: data.timezone,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      };
      
      if (data.rain) {
        currentWeather.rain = data.rain;
      }
      
      // Set a default UV index value since the oneCall API might not be available in the free tier
      currentWeather.uvIndex = 0; // Default value when UV index is unavailable
      
      res.json(currentWeather);
    } catch (error) {
      console.error("Error fetching current weather:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });
  
  app.get("/api/weather/forecast", async (req: Request, res: Response) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      // Using the 5-day/3-hour forecast endpoint instead of onecall API since it's available in the free tier
      const forecastResponse = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric"
        }
      });
      
      // Get current weather for sunrise/sunset data
      const currentResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat, 
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric"
        }
      });
      
      // Group by day for daily forecast
      const forecastData = forecastResponse.data.list;
      const sunrise = currentResponse.data.sys.sunrise;
      const sunset = currentResponse.data.sys.sunset;
      
      // Create grouped days for daily forecast (take first entry of each day)
      const dailyMap = new Map();
      
      forecastData.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, item);
        }
      });
      
      // Convert to daily forecast format
      const daily: DailyForecast[] = Array.from(dailyMap.values()).slice(0, 5).map((day: any) => {
        const condition = mapWeatherCondition(day.weather[0].id);
        
        return {
          dt: day.dt,
          sunrise: sunrise, // Use current day sunrise as estimate
          sunset: sunset,   // Use current day sunset as estimate
          temp: {
            day: day.main.temp,
            min: day.main.temp_min,
            max: day.main.temp_max,
            night: day.main.temp,  // Estimate
            eve: day.main.temp,    // Estimate
            morn: day.main.temp    // Estimate
          },
          feelsLike: {
            day: day.main.feels_like,
            night: day.main.feels_like, // Estimate
            eve: day.main.feels_like,   // Estimate
            morn: day.main.feels_like   // Estimate
          },
          pressure: day.main.pressure,
          humidity: day.main.humidity,
          weather: day.weather,
          speed: day.wind.speed,
          deg: day.wind.deg,
          clouds: day.clouds.all,
          pop: day.pop || 0,
          condition
        };
      });
      
      // Use the 3-hour forecast data for hourly forecast (limited to 5 days, 3-hour intervals)
      const hourly: HourlyForecast[] = forecastData.slice(0, 24).map((hour: any) => {
        const condition = mapWeatherCondition(hour.weather[0].id);
        
        return {
          dt: hour.dt,
          temp: hour.main.temp,
          feelsLike: hour.main.feels_like,
          pressure: hour.main.pressure,
          humidity: hour.main.humidity,
          dewPoint: 0, // Not provided in this API
          clouds: hour.clouds.all,
          visibility: hour.visibility,
          windSpeed: hour.wind.speed,
          windDeg: hour.wind.deg,
          weather: hour.weather,
          pop: hour.pop || 0,
          condition
        };
      });
      
      res.json({ daily, hourly });
    } catch (error) {
      console.error("Error fetching forecast:", error);
      res.status(500).json({ message: "Failed to fetch forecast data" });
    }
  });
  
  app.get("/api/weather/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const response = await axios.get(`${OPENWEATHER_GEO_URL}/direct`, {
        params: {
          q,
          limit: 5,
          appid: OPENWEATHER_API_KEY
        }
      });
      
      const locations: SearchLocation[] = response.data.map((location: any) => ({
        name: location.name,
        local_names: location.local_names,
        lat: location.lat,
        lon: location.lon,
        country: location.country,
        state: location.state
      }));
      
      res.json(locations);
    } catch (error) {
      console.error("Error searching locations:", error);
      res.status(500).json({ message: "Failed to search locations" });
    }
  });
  
  app.get("/api/weather/reverse-geocode", async (req: Request, res: Response) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const response = await axios.get(`${OPENWEATHER_GEO_URL}/reverse`, {
        params: {
          lat,
          lon,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        }
      });
      
      const locations: SearchLocation[] = response.data.map((location: any) => ({
        name: location.name,
        local_names: location.local_names,
        lat: location.lat,
        lon: location.lon,
        country: location.country,
        state: location.state
      }));
      
      res.json(locations);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      res.status(500).json({ message: "Failed to reverse geocode" });
    }
  });
  
  app.get("/api/weather/favorites", async (req: Request, res: Response) => {
    try {
      const favorites = await storage.getAllFavorites();
      
      // Fetch weather for each favorite
      const weatherPromises = favorites.map(async (favorite) => {
        try {
          const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
            params: {
              lat: favorite.lat,
              lon: favorite.lon,
              appid: OPENWEATHER_API_KEY,
              units: "metric"
            }
          });
          
          const data = response.data;
          const weatherCondition = mapWeatherCondition(data.weather[0].id);
          
          return {
            id: favorite.id,
            cityId: favorite.cityId,
            location: favorite.locationName,
            temp: data.main.temp,
            condition: weatherCondition,
            description: data.weather[0].description
          };
        } catch (error) {
          console.error(`Error fetching weather for ${favorite.locationName}:`, error);
          return {
            id: favorite.id,
            cityId: favorite.cityId,
            location: favorite.locationName,
            temp: 0,
            condition: "clear" as WeatherCondition,
            description: "Unknown"
          };
        }
      });
      
      const weatherData = await Promise.all(weatherPromises);
      res.json(weatherData);
    } catch (error) {
      console.error("Error fetching favorites weather:", error);
      res.status(500).json({ message: "Failed to fetch favorites weather" });
    }
  });
  
  // User routes
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser({ username, password });
      
      // Create default settings for new user
      await storage.createSettings({
        userId: user.id,
        useImperial: false,
        useImperialWind: false,
        darkMode: false,
        dynamicBg: true,
        weatherAlerts: true
      });
      
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  app.post("/api/users/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set user session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Favorites routes
  app.get("/api/favorites", async (req: Request, res: Response) => {
    try {
      // In a real app, get user ID from session
      const userId = req.session?.userId || 1; // Default for demo
      
      const favorites = await storage.getFavoritesByUserId(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error getting favorites:", error);
      res.status(500).json({ message: "Failed to get favorites" });
    }
  });
  
  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      // In a real app, get user ID from session
      const userId = req.session?.userId || 1; // Default for demo
      
      const { locationName, cityId, lat, lon } = req.body;
      
      if (!locationName || !cityId || !lat || !lon) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const favorite = await storage.createFavorite({
        userId,
        locationName,
        cityId,
        lat,
        lon
      });
      
      res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });
  
  app.delete("/api/favorites/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      await storage.deleteFavorite(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting favorite:", error);
      res.status(500).json({ message: "Failed to delete favorite" });
    }
  });
  
  // Settings routes
  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      // In a real app, get user ID from session
      const userId = req.session?.userId || 1; // Default for demo
      
      let settings = await storage.getSettingsByUserId(userId);
      
      if (!settings) {
        // Create default settings if none exist
        settings = await storage.createSettings({
          userId,
          useImperial: false,
          useImperialWind: false,
          darkMode: false,
          dynamicBg: true,
          weatherAlerts: true
        });
      }
      
      const userSettings: UserSettings = {
        useImperial: settings.useImperial,
        useImperialWind: settings.useImperialWind,
        darkMode: settings.darkMode,
        dynamicBg: settings.dynamicBg,
        weatherAlerts: settings.weatherAlerts
      };
      
      res.json(userSettings);
    } catch (error) {
      console.error("Error getting settings:", error);
      res.status(500).json({ message: "Failed to get settings" });
    }
  });
  
  app.put("/api/settings", async (req: Request, res: Response) => {
    try {
      // In a real app, get user ID from session
      const userId = req.session?.userId || 1; // Default for demo
      
      const { useImperial, useImperialWind, darkMode, dynamicBg, weatherAlerts } = req.body;
      
      if (typeof useImperial !== 'boolean' || 
          typeof useImperialWind !== 'boolean' || 
          typeof darkMode !== 'boolean' || 
          typeof dynamicBg !== 'boolean' || 
          typeof weatherAlerts !== 'boolean') {
        return res.status(400).json({ message: "All settings must be boolean values" });
      }
      
      let settings = await storage.getSettingsByUserId(userId);
      
      if (!settings) {
        // Create settings if they don't exist
        settings = await storage.createSettings({
          userId,
          useImperial,
          useImperialWind,
          darkMode,
          dynamicBg,
          weatherAlerts
        });
      } else {
        // Update existing settings
        settings = await storage.updateSettings(settings.id, {
          userId,
          useImperial,
          useImperialWind,
          darkMode,
          dynamicBg,
          weatherAlerts
        });
      }
      
      const userSettings: UserSettings = {
        useImperial: settings.useImperial,
        useImperialWind: settings.useImperialWind,
        darkMode: settings.darkMode,
        dynamicBg: settings.dynamicBg,
        weatherAlerts: settings.weatherAlerts
      };
      
      res.json(userSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
