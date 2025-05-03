import { 
  users, 
  User, 
  InsertUser,
  favorites,
  Favorite,
  InsertFavorite,
  settings,
  Settings,
  InsertSettings
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Favorites methods
  getFavorite(id: number): Promise<Favorite | undefined>;
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<void>;
  getAllFavorites(): Promise<Favorite[]>;
  
  // Settings methods
  getSettings(id: number): Promise<Settings | undefined>;
  getSettingsByUserId(userId: number): Promise<Settings | undefined>;
  createSettings(settings: InsertSettings): Promise<Settings>;
  updateSettings(id: number, settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private favoritesMap: Map<number, Favorite>;
  private settingsMap: Map<number, Settings>;
  private userIdCounter: number;
  private favoriteIdCounter: number;
  private settingsIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.favoritesMap = new Map();
    this.settingsMap = new Map();
    this.userIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.settingsIdCounter = 1;
    
    // Create a default user for demo purposes
    this.createUser({ username: 'demo', password: 'password' });
    
    // Sample favorites
    this.createFavorite({
      userId: 1,
      locationName: 'London, GB',
      cityId: '2643743',
      lat: '51.5074',
      lon: '-0.1278'
    });
    
    this.createFavorite({
      userId: 1,
      locationName: 'Paris, FR',
      cityId: '2988507',
      lat: '48.8566',
      lon: '2.3522'
    });
    
    this.createFavorite({
      userId: 1,
      locationName: 'Tokyo, JP',
      cityId: '1850147',
      lat: '35.6762',
      lon: '139.6503'
    });
    
    // Default settings
    this.createSettings({
      userId: 1,
      useImperial: false,
      useImperialWind: false,
      darkMode: false,
      dynamicBg: true,
      weatherAlerts: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.usersMap.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }
  
  // Favorites methods
  async getFavorite(id: number): Promise<Favorite | undefined> {
    return this.favoritesMap.get(id);
  }

  async getFavoritesByUserId(userId: number): Promise<Favorite[]> {
    const favorites: Favorite[] = [];
    for (const favorite of this.favoritesMap.values()) {
      if (favorite.userId === userId) {
        favorites.push(favorite);
      }
    }
    return favorites;
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteIdCounter++;
    const favorite: Favorite = { ...insertFavorite, id };
    this.favoritesMap.set(id, favorite);
    return favorite;
  }

  async deleteFavorite(id: number): Promise<void> {
    this.favoritesMap.delete(id);
  }
  
  async getAllFavorites(): Promise<Favorite[]> {
    return Array.from(this.favoritesMap.values());
  }
  
  // Settings methods
  async getSettings(id: number): Promise<Settings | undefined> {
    return this.settingsMap.get(id);
  }

  async getSettingsByUserId(userId: number): Promise<Settings | undefined> {
    for (const settings of this.settingsMap.values()) {
      if (settings.userId === userId) {
        return settings;
      }
    }
    return undefined;
  }

  async createSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = this.settingsIdCounter++;
    const settings: Settings = { ...insertSettings, id };
    this.settingsMap.set(id, settings);
    return settings;
  }

  async updateSettings(id: number, insertSettings: InsertSettings): Promise<Settings> {
    const settings: Settings = { ...insertSettings, id };
    this.settingsMap.set(id, settings);
    return settings;
  }
}

export const storage = new MemStorage();
