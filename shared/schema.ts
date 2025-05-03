import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  locationName: text("location_name").notNull(),
  cityId: text("city_id").notNull(),
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  useImperial: boolean("use_imperial").default(false),
  useImperialWind: boolean("use_imperial_wind").default(false),
  darkMode: boolean("dark_mode").default(false),
  dynamicBg: boolean("dynamic_bg").default(true),
  weatherAlerts: boolean("weather_alerts").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  locationName: true,
  cityId: true,
  lat: true,
  lon: true,
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  userId: true,
  useImperial: true,
  useImperialWind: true,
  darkMode: true,
  dynamicBg: true,
  weatherAlerts: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type WeatherCondition = 
  | "clear" 
  | "clouds" 
  | "rain" 
  | "drizzle"
  | "thunderstorm" 
  | "snow" 
  | "mist" 
  | "fog" 
  | "haze" 
  | "dust" 
  | "smoke" 
  | "tornado";

export type CurrentWeather = {
  location: string;
  country: string;
  cityId: string;
  coord: {
    lat: number;
    lon: number;
  };
  temp: number;
  feelsLike: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  condition: WeatherCondition;
  description: string;
  icon: string;
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: number;
  dt: number;
  timezone: number;
  sunrise: number;
  sunset: number;
  uvIndex?: number;
};

export type DailyForecast = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feelsLike: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  speed: number;
  deg: number;
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  condition: WeatherCondition;
};

export type HourlyForecast = {
  dt: number;
  temp: number;
  feelsLike: number;
  pressure: number;
  humidity: number;
  dewPoint: number;
  clouds: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  pop: number;
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
  condition: WeatherCondition;
};

export type SearchLocation = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type UserSettings = {
  useImperial: boolean;
  useImperialWind: boolean;
  darkMode: boolean;
  dynamicBg: boolean;
  weatherAlerts: boolean;
};
