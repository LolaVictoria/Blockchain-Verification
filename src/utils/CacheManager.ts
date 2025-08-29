import apiClient from './apiClient';

interface CacheItem<T = any> {
  data: T;
  timestamp: Date;
  isEmpty?: boolean;
}

// interface LastUpdateTimes {
//   [key: string]: string | null;
// }

interface CacheConfig {
  [key: string]: {
    endpoint: string;
    cacheKey: string;
    dataKey: string;
  };
}

export class CacheManager {
  private static instance: CacheManager;
  
  private config: CacheConfig = {
    products: {
      endpoint: '/manufacturer/products',
      cacheKey: 'productData',
      dataKey: 'products'
    },
    stats: {
      endpoint: '/manufacturer/dashboard-stats',
      cacheKey: 'statsData',
      dataKey: 'stats'
    },
    profile: {
      endpoint: '/manufacturer/profile',
      cacheKey: 'profileData',
      dataKey: 'user'
    }
  };

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Check if cached data is still valid (from main.js)
  async isCacheValid(dataType: string): Promise<boolean> {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) return false;

    const cachedData = this.getCachedData(this.config[dataType].cacheKey);
    if (!cachedData) return false;

    let lastUpdateTimes = localStorage.getItem('lastUpdateTimes');
    if (!lastUpdateTimes) {
      try {
        const response = await apiClient.get(`/manufacturer/last-update-times?types=${dataType}`);
        
        if (response.status === 200) {
          lastUpdateTimes = response.data.last_updates;
          localStorage.setItem('lastUpdateTimes', JSON.stringify({
            data: lastUpdateTimes,
            timestamp: new Date()
          }));
        } else {
          return false;
        }
      } catch (error) {
        console.error(`Error fetching last-update-times for ${dataType}:`, error);
        return false;
      }
    } else {
      try {
        lastUpdateTimes = JSON.parse(lastUpdateTimes).data;
      } catch (error) {
        console.error('Error parsing lastUpdateTimes:', error);
        localStorage.removeItem('lastUpdateTimes');
        return false;
      }
    }

    const serverLastUpdate = (lastUpdateTimes as any)[dataType];
    if (serverLastUpdate === null) {
      return (cachedData.isEmpty ?? false) && (Date.now() - new Date(cachedData.timestamp).getTime()) < 60 * 1000;
    }

    return new Date(cachedData.timestamp) >= new Date(serverLastUpdate);
  }

  // Load data with caching strategy (from main.js)
  async loadDataWithCache<T = any>(
    dataType: string, 
    displayFunction: (data: T) => void, 
    forceRefresh = false
  ): Promise<T | T[]> {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      console.log(`No auth token, skipping ${dataType} data load`);
      return [] as T[];
    }

    try {
      if (!forceRefresh && await this.isCacheValid(dataType)) {
        const cachedData = this.getCachedData(this.config[dataType].cacheKey);
        if (cachedData) {
          console.log(`Using cached ${dataType} data`);
          if (!cachedData.isEmpty) {
            displayFunction(cachedData.data as T);
            return cachedData.data as T | T[];
          }
          displayFunction([] as T);
          return [] as T[];
        }
      }

      const response = await apiClient.get(this.config[dataType].endpoint);

      if (response.status === 200 && response.data.status === 'success') {
        const data = response.data[this.config[dataType].dataKey];
        if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
          this.setCachedData(this.config[dataType].cacheKey, data);
          displayFunction(data);
          return data;
        } else {
          this.setCachedData(this.config[dataType].cacheKey, [], true);
          displayFunction([] as T);
          return [] as T[];
        }
      }
      return [] as T[];
    } catch (error: any) {
      console.error(`Error loading ${dataType}:`, error);
      const cachedData = this.getCachedData(this.config[dataType].cacheKey);
      if (cachedData && !cachedData.isEmpty) {
        displayFunction(cachedData.data as T);
        return cachedData.data as T | T[];
      }
      if (error.status === 401) {
        // Handle logout - you might want to import authService here
        localStorage.clear();
        window.location.href = '/login';
      }
      return [] as T[];
    }
  }

  // Load multiple data types with cache (from main.js)
  async loadMultipleDataWithCache(
    dataTypesConfig: { [key: string]: { displayFunction: (data: any) => void } },
    forceRefresh = false
  ): Promise<any[]> {
    const promises = Object.keys(dataTypesConfig).map(dataType =>
      this.loadDataWithCache(dataType, dataTypesConfig[dataType].displayFunction, forceRefresh)
        .catch(error => {
          console.error(`Failed to load ${dataType}:`, error);
          return [];
        })
    );
    return Promise.all(promises);
  }

  // Set cached data with timestamp (from main.js)
  setCachedData<T>(key: string, data: T, isEmpty = false): void {
    const cacheItem: CacheItem<T> = { data, timestamp: new Date(), isEmpty };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  }

  // Get cached data with timestamp validation (from main.js)
  getCachedData<T>(key: string): CacheItem<T> | null {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      return JSON.parse(cached) as CacheItem<T>;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  }

  // Clear specific cache (from main.js)
  clearCache(dataType: string): void {
    localStorage.removeItem(this.config[dataType].cacheKey);
    console.log(`Cleared ${dataType} cache`);
  }

  // Clear all caches (from main.js)
  clearAllCaches(): void {
    Object.values(this.config).forEach(config => localStorage.removeItem(config.cacheKey));
    localStorage.removeItem('lastUpdateTimes');
    console.log('Cleared all caches');
  }

  // Smart cache clearing strategies (from main.js)
  smartCacheClear(action: string): void {
    const strategies: { [key: string]: () => void } = {
      product_registration: () => {
        this.clearCache('products');
        this.clearCache('stats');
      },
      profile_update: () => this.clearCache('profile'),
      wallet_verification: () => this.clearCache('profile'),
      company_name_change: () => {
        this.clearCache('profile');
        this.clearCache('products');
      },
      account_verification: () => this.clearAllCaches()
    };
    
    const strategy = strategies[action];
    if (strategy) {
      strategy();
    } else {
      console.log(`No cache strategy for action: ${action}`);
    }
  }

  // Set cached data with timestamp helper (from main.js)
  setCachedDataWithTimestamp<T>(key: string, data: T): void {
    const cacheItem: CacheItem<T> = {
      data: data,
      timestamp: new Date()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  }

  // Get cached data with timestamp helper (from main.js)
  getCachedDataWithTimestamp<T>(key: string): { data: T; timestamp: Date } | null {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    try {
      const cacheItem = JSON.parse(cached) as CacheItem<T>;
      return {
        data: cacheItem.data,
        timestamp: new Date(cacheItem.timestamp)
      };
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  }
}

// Create singleton instance
const cacheManager = CacheManager.getInstance();
export default cacheManager;

// Export functions for easier migration from main.js
export const setCachedDataWithTimestamp = <T>(key: string, data: T) => 
  cacheManager.setCachedDataWithTimestamp(key, data);
export const getCachedDataWithTimestamp = <T>(key: string) => 
  cacheManager.getCachedDataWithTimestamp<T>(key);
export const clearCache = (dataType: string) => cacheManager.clearCache(dataType);
export const clearAllCaches = () => cacheManager.clearAllCaches();
export const smartCacheClear = (action: string) => cacheManager.smartCacheClear(action);