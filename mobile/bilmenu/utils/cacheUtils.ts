import AsyncStorage from "@react-native-async-storage/async-storage";
import { MissingMeal, MealPlanDay } from "@/types/submit";

export interface CachedMissingMealsData {
  currentWeekMeals: MissingMeal[];
  allMissingMeals: MissingMeal[];
  currentWeekMealPlan: MealPlanDay[];
  lastUpdated: string;
  totalCheckpoints: number;
  cachedAt: string; // ISO timestamp when this data was cached
}

const CACHE_KEY = "missing_meals_cache";
const CACHE_EXPIRY_HOURS = 168; // Cache expires after 1 week (7 days)

export const cacheUtils = {
  /**
   * Save missing meals data to local storage
   */
  async saveCache(
    data: Omit<CachedMissingMealsData, "cachedAt">
  ): Promise<void> {
    try {
      const cacheData: CachedMissingMealsData = {
        ...data,
        cachedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log("Missing meals data cached successfully");
    } catch (error) {
      console.error("Failed to cache missing meals data:", error);
    }
  },

  /**
   * Load missing meals data from local storage
   */
  async loadCache(): Promise<CachedMissingMealsData | null> {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (!cachedData) {
        return null;
      }

      const parsedData: CachedMissingMealsData = JSON.parse(cachedData);

      // Check if cache is expired
      const cacheAge = Date.now() - new Date(parsedData.cachedAt).getTime();
      const cacheAgeHours = cacheAge / (1000 * 60 * 60);

      if (cacheAgeHours > CACHE_EXPIRY_HOURS) {
        console.log("Cache expired, removing old data");
        await this.clearCache();
        return null;
      }

      console.log("Loaded missing meals data from cache");
      return parsedData;
    } catch (error) {
      console.error("Failed to load cached missing meals data:", error);
      return null;
    }
  },

  /**
   * Clear cached data
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      console.log("Missing meals cache cleared");
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  },

  /**
   * Check if cached data is newer than the provided lastUpdated timestamp
   */
  isCacheNewerThan(
    cachedData: CachedMissingMealsData,
    lastUpdated: string
  ): boolean {
    try {
      const cacheDate = new Date(cachedData.lastUpdated);
      const providedDate = new Date(lastUpdated);
      return cacheDate >= providedDate;
    } catch (error) {
      console.error("Error comparing cache dates:", error);
      return false;
    }
  },

  /**
   * Get cache age in hours
   */
  getCacheAge(cachedData: CachedMissingMealsData): number {
    const cacheAge = Date.now() - new Date(cachedData.cachedAt).getTime();
    return cacheAge / (1000 * 60 * 60);
  },
};
