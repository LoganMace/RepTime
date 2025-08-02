import AsyncStorage from "@react-native-async-storage/async-storage";

const MEALS_STORAGE_KEY = "meals_data";
const FAVORITES_STORAGE_KEY = "favorite_meals";

export interface MealEntry {
  name: string;
  calories: number;
  protein: number;
}

export interface FavoriteMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  dateAdded: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export interface DayMeals {
  breakfast: MealEntry[];
  lunch: MealEntry[];
  dinner: MealEntry[];
  snacks: MealEntry[];
}

export interface MealsData {
  [date: string]: DayMeals;
}

/**
 * Load all meals data from AsyncStorage
 * @returns Promise<MealsData> - Returns full meals object or empty object if no data
 */
export const loadMeals = async (): Promise<MealsData> => {
  try {
    const mealsJson = await AsyncStorage.getItem(MEALS_STORAGE_KEY);
    if (mealsJson) {
      return JSON.parse(mealsJson);
    }
    return {};
  } catch (error) {
    console.error("Error loading meals from AsyncStorage:", error);
    return {};
  }
};

/**
 * Save the full meals object to AsyncStorage
 * @param mealsObject - The complete meals data structure
 */
export const saveMeals = async (mealsObject: MealsData): Promise<void> => {
  try {
    const mealsJson = JSON.stringify(mealsObject);
    await AsyncStorage.setItem(MEALS_STORAGE_KEY, mealsJson);
  } catch (error) {
    console.error("Error saving meals to AsyncStorage:", error);
    throw error;
  }
};

/**
 * Add a meal entry to a specific date and meal type
 * @param date - Date string in format 'YYYY-MM-DD'
 * @param mealType - Type of meal ('breakfast' | 'lunch' | 'dinner' | 'snacks')
 * @param entry - Meal entry object with name, calories, and protein
 */
export const addMealEntry = async (
  date: string,
  mealType: MealType,
  entry: MealEntry
): Promise<void> => {
  try {
    // Load existing meals data
    const mealsData = await loadMeals();

    // Initialize date if it doesn't exist
    if (!mealsData[date]) {
      mealsData[date] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      };
    }

    // Add the new entry to the specific meal type for this date
    mealsData[date][mealType].push(entry);

    // Save the updated data back to AsyncStorage
    await saveMeals(mealsData);
  } catch (error) {
    console.error("Error adding meal entry:", error);
    throw error;
  }
};

/**
 * Get meals for a specific date
 * @param date - Date string in format 'YYYY-MM-DD'
 * @returns Promise<DayMeals> - Returns meals for the date or empty structure
 */
export const getMealsForDate = async (date: string): Promise<DayMeals> => {
  try {
    const mealsData = await loadMeals();
    return (
      mealsData[date] || {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      }
    );
  } catch (error) {
    console.error("Error getting meals for date:", error);
    return {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    };
  }
};

/**
 * Remove a meal entry from a specific date and meal type
 * @param date - Date string in format 'YYYY-MM-DD'
 * @param mealType - Type of meal ('breakfast' | 'lunch' | 'dinner' | 'snacks')
 * @param entryIndex - Index of the entry to remove
 */
export const removeMealEntry = async (
  date: string,
  mealType: MealType,
  entryIndex: number
): Promise<void> => {
  try {
    const mealsData = await loadMeals();

    if (mealsData[date] && mealsData[date][mealType]) {
      mealsData[date][mealType].splice(entryIndex, 1);
      await saveMeals(mealsData);
    }
  } catch (error) {
    console.error("Error removing meal entry:", error);
    throw error;
  }
};

/**
 * Update a meal entry at a specific date, meal type, and index
 * @param date - Date string in format 'YYYY-MM-DD'
 * @param mealType - Type of meal ('breakfast' | 'lunch' | 'dinner' | 'snacks')
 * @param entryIndex - Index of the entry to update
 * @param updatedEntry - Updated meal entry object
 */
export const updateMealEntry = async (
  date: string,
  mealType: MealType,
  entryIndex: number,
  updatedEntry: MealEntry
): Promise<void> => {
  try {
    const mealsData = await loadMeals();

    if (
      mealsData[date] &&
      mealsData[date][mealType] &&
      mealsData[date][mealType][entryIndex]
    ) {
      mealsData[date][mealType][entryIndex] = updatedEntry;
      await saveMeals(mealsData);
    }
  } catch (error) {
    console.error("Error updating meal entry:", error);
    throw error;
  }
};

/**
 * Clear all meals data from AsyncStorage
 */
export const clearAllMeals = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MEALS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing meals data:", error);
    throw error;
  }
};

/**
 * Format a date to the storage format (YYYY-MM-DD)
 * @param date - Date object or string
 * @returns string - Formatted date string
 */
export const formatDateForStorage = (
  date: Date | string = new Date()
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

/**
 * Load all favorite meals from AsyncStorage
 * @returns Promise<FavoriteMeal[]> - Returns array of favorite meals
 */
export const loadFavoriteMeals = async (): Promise<FavoriteMeal[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (favoritesJson) {
      return JSON.parse(favoritesJson);
    }
    return [];
  } catch (error) {
    console.error("Error loading favorite meals from AsyncStorage:", error);
    return [];
  }
};

/**
 * Save favorite meals to AsyncStorage
 * @param favorites - Array of favorite meals
 */
export const saveFavoriteMeals = async (
  favorites: FavoriteMeal[]
): Promise<void> => {
  try {
    const favoritesJson = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, favoritesJson);
  } catch (error) {
    console.error("Error saving favorite meals to AsyncStorage:", error);
    throw error;
  }
};

/**
 * Add a meal to favorites
 * @param meal - Meal entry to add to favorites
 * @returns Promise<string> - Returns the ID of the favorite meal
 */
export const addToFavorites = async (meal: MealEntry): Promise<string> => {
  try {
    const favorites = await loadFavoriteMeals();

    // Check if meal already exists in favorites
    const existingFavorite = favorites.find(
      (fav) =>
        fav.name.toLowerCase() === meal.name.toLowerCase() &&
        fav.calories === meal.calories &&
        fav.protein === meal.protein
    );

    if (existingFavorite) {
      return existingFavorite.id;
    }

    const favoriteMeal: FavoriteMeal = {
      id: Date.now().toString(),
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      dateAdded: formatDateForStorage(),
    };

    favorites.push(favoriteMeal);
    await saveFavoriteMeals(favorites);

    return favoriteMeal.id;
  } catch (error) {
    console.error("Error adding meal to favorites:", error);
    throw error;
  }
};

/**
 * Remove a meal from favorites
 * @param favoriteId - ID of the favorite meal to remove
 */
export const removeFromFavorites = async (
  favoriteId: string
): Promise<void> => {
  try {
    const favorites = await loadFavoriteMeals();
    const updatedFavorites = favorites.filter((fav) => fav.id !== favoriteId);
    await saveFavoriteMeals(updatedFavorites);
  } catch (error) {
    console.error("Error removing meal from favorites:", error);
    throw error;
  }
};

/**
 * Check if a meal is in favorites
 * @param meal - Meal entry to check
 * @returns Promise<string | null> - Returns favorite ID if found, null otherwise
 */
export const getFavoriteId = async (
  meal: MealEntry
): Promise<string | null> => {
  try {
    const favorites = await loadFavoriteMeals();
    const favorite = favorites.find(
      (fav) =>
        fav.name.toLowerCase() === meal.name.toLowerCase() &&
        fav.calories === meal.calories &&
        fav.protein === meal.protein
    );
    return favorite ? favorite.id : null;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return null;
  }
};

/**
 * Clear all favorite meals
 */
export const clearAllFavorites = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing favorite meals:", error);
    throw error;
  }
};
