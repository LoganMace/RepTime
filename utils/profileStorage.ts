import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const USER_INFO_KEY = "user_info";
const GOALS_KEY = "user_goals";
const PREFERENCES_KEY = "user_preferences";

// Interfaces
export interface UserInfo {
  name: string;
  age: number;
  weight: number; // stored in kg
  height: number; // stored in cm
}

export interface Goals {
  weightGoal: number; // in kg
  calorieGoal: number; // daily calories
  proteinGoal: number; // daily grams
}

export interface Preferences {
  weightUnits: "metric" | "imperial";
  workoutUnits: "metric" | "imperial";
  muteSounds: boolean;
  muteVoice: boolean;
}

export interface ProfileData {
  userInfo: UserInfo;
  goals: Goals;
  preferences: Preferences;
}

// Default values
const defaultUserInfo: UserInfo = {
  name: "",
  age: 25,
  weight: 70, // kg
  height: 170, // cm
};

const defaultGoals: Goals = {
  weightGoal: 70, // kg
  calorieGoal: 2000,
  proteinGoal: 100,
};

const defaultPreferences: Preferences = {
  weightUnits: "imperial",
  workoutUnits: "imperial",
  muteSounds: false,
  muteVoice: false,
};

// Unit conversion helpers
export const kgToLbs = (kg: number): number => Math.round(kg * 2.20462 * 10) / 10;
export const lbsToKg = (lbs: number): number => Math.round(lbs / 2.20462 * 10) / 10;
export const cmToInches = (cm: number): number => Math.round(cm / 2.54 * 10) / 10;
export const inchesToCm = (inches: number): number => Math.round(inches * 2.54 * 10) / 10;
export const cmToFeetAndInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};
export const feetAndInchesToCm = (feet: number, inches: number): number => {
  const totalInches = feet * 12 + inches;
  return inchesToCm(totalInches);
};

// Storage functions
export const loadProfileData = async (): Promise<ProfileData> => {
  try {
    const [userInfoStr, goalsStr, preferencesStr] = await Promise.all([
      AsyncStorage.getItem(USER_INFO_KEY),
      AsyncStorage.getItem(GOALS_KEY),
      AsyncStorage.getItem(PREFERENCES_KEY),
    ]);

    // Parse preferences with migration support
    let preferences = preferencesStr ? JSON.parse(preferencesStr) : defaultPreferences;
    
    // Migration: Convert old "units" format to separate weight/workout units
    if (preferences.units && !preferences.weightUnits) {
      preferences = {
        ...preferences,
        weightUnits: preferences.units,
        workoutUnits: preferences.units,
      };
      // Remove old units field
      delete preferences.units;
      // Save migrated preferences
      await savePreferences(preferences);
    }

    return {
      userInfo: userInfoStr ? JSON.parse(userInfoStr) : defaultUserInfo,
      goals: goalsStr ? JSON.parse(goalsStr) : defaultGoals,
      preferences,
    };
  } catch (error) {
    console.error("Error loading profile data:", error);
    return {
      userInfo: defaultUserInfo,
      goals: defaultGoals,
      preferences: defaultPreferences,
    };
  }
};

export const saveUserInfo = async (userInfo: UserInfo): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error("Error saving user info:", error);
    throw error;
  }
};

export const saveGoals = async (goals: Goals): Promise<void> => {
  try {
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error("Error saving goals:", error);
    throw error;
  }
};

export const savePreferences = async (preferences: Preferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
};

export const updateUserInfo = async (updates: Partial<UserInfo>): Promise<UserInfo> => {
  try {
    const current = await loadProfileData();
    const updated = { ...current.userInfo, ...updates };
    await saveUserInfo(updated);
    return updated;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const updateGoals = async (updates: Partial<Goals>): Promise<Goals> => {
  try {
    const current = await loadProfileData();
    const updated = { ...current.goals, ...updates };
    await saveGoals(updated);
    return updated;
  } catch (error) {
    console.error("Error updating goals:", error);
    throw error;
  }
};

export const updatePreferences = async (updates: Partial<Preferences>): Promise<Preferences> => {
  try {
    const current = await loadProfileData();
    const updated = { ...current.preferences, ...updates };
    await savePreferences(updated);
    return updated;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
};

// Clear all profile data
export const clearProfileData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(USER_INFO_KEY),
      AsyncStorage.removeItem(GOALS_KEY),
      AsyncStorage.removeItem(PREFERENCES_KEY),
    ]);
  } catch (error) {
    console.error("Error clearing profile data:", error);
    throw error;
  }
};

// Format display values based on units preference
export const formatWeight = (weightKg: number, units: "metric" | "imperial"): string => {
  if (units === "imperial") {
    return `${kgToLbs(weightKg)} lbs`;
  }
  // Round to 1 decimal place to avoid floating point precision issues
  return `${Math.round(weightKg * 10) / 10} kg`;
};

export const formatHeight = (heightCm: number, units: "metric" | "imperial"): string => {
  if (units === "imperial") {
    const { feet, inches } = cmToFeetAndInches(heightCm);
    return `${feet}'${inches}"`;
  }
  return `${heightCm} cm`;
};