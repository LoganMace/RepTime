import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  timestamp: number;
}

const WEIGHT_STORAGE_KEY = "weight_entries";
const WEIGHT_GOAL_KEY = "weight_goal";

// Mock data for testing
export const MOCK_WEIGHT_ENTRIES: WeightEntry[] = [
  {
    id: "10",
    weight: 175.6,
    date: "2025-08-02",
    timestamp: Date.now(),
  },
  {
    id: "9",
    weight: 176.2,
    date: "2025-08-01",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "8",
    weight: 175.8,
    date: "2025-07-31",
    timestamp: Date.now() - 172800000,
  },
  {
    id: "7",
    weight: 178.0,
    date: "2025-07-30",
    timestamp: Date.now() - 259200000,
  },
  {
    id: "6",
    weight: 177.4,
    date: "2025-07-29",
    timestamp: Date.now() - 345600000,
  },
  {
    id: "5",
    weight: 179.1,
    date: "2025-07-28",
    timestamp: Date.now() - 432000000,
  },
  {
    id: "4",
    weight: 178.8,
    date: "2025-07-27",
    timestamp: Date.now() - 518400000,
  },
  {
    id: "3",
    weight: 180.2,
    date: "2025-07-26",
    timestamp: Date.now() - 604800000,
  },
  {
    id: "2",
    weight: 179.6,
    date: "2025-07-25",
    timestamp: Date.now() - 691200000,
  },
  {
    id: "1",
    weight: 181.3,
    date: "2025-07-24",
    timestamp: Date.now() - 777600000,
  },
];

// Helper function to format date for storage (YYYY-MM-DD)
export const formatDateForStorage = (date?: Date): string => {
  const d = date || new Date();
  return d.toISOString().split("T")[0];
};

// Helper function to format date for display
export const formatDateForDisplay = (dateString: string): string => {
  const today = formatDateForStorage();
  const yesterday = formatDateForStorage(new Date(Date.now() - 86400000));

  if (dateString === today) return "Today";
  if (dateString === yesterday) return "Yesterday";

  const date = new Date(dateString);
  const daysDiff = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff <= 7) {
    return `${daysDiff} days ago`;
  }

  return date.toLocaleDateString();
};

// Initialize mock data if needed
export const initializeMockWeightData = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(WEIGHT_STORAGE_KEY);
    if (!existing) {
      await AsyncStorage.setItem(
        WEIGHT_STORAGE_KEY,
        JSON.stringify(MOCK_WEIGHT_ENTRIES)
      );
    }
  } catch (error) {
    console.error("Error initializing mock weight data:", error);
  }
};

// Reset to mock data (useful for testing)
export const resetToMockWeightData = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      WEIGHT_STORAGE_KEY,
      JSON.stringify(MOCK_WEIGHT_ENTRIES)
    );
  } catch (error) {
    console.error("Error resetting to mock weight data:", error);
  }
};

// Load all weight entries
export const loadWeightEntries = async (): Promise<WeightEntry[]> => {
  try {
    const stored = await AsyncStorage.getItem(WEIGHT_STORAGE_KEY);
    if (stored) {
      const entries = JSON.parse(stored) as WeightEntry[];
      // Sort by timestamp descending (newest first)
      return entries.sort((a, b) => b.timestamp - a.timestamp);
    }
    return [];
  } catch (error) {
    console.error("Error loading weight entries:", error);
    return [];
  }
};

// Add or update weight entry for a specific date
export const addWeightEntry = async (
  weight: number,
  date?: string
): Promise<void> => {
  try {
    const entryDate = date || formatDateForStorage();
    const entries = await loadWeightEntries();

    // Check if an entry already exists for this date
    const existingIndex = entries.findIndex(
      (entry) => entry.date === entryDate
    );

    const newEntry: WeightEntry = {
      id:
        existingIndex >= 0 ? entries[existingIndex].id : Date.now().toString(),
      weight,
      date: entryDate,
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      // Update existing entry for this date
      entries[existingIndex] = newEntry;
    } else {
      // Add new entry
      entries.push(newEntry);
    }

    // Sort by timestamp descending and save
    const sortedEntries = entries.sort((a, b) => b.timestamp - a.timestamp);
    await AsyncStorage.setItem(
      WEIGHT_STORAGE_KEY,
      JSON.stringify(sortedEntries)
    );
  } catch (error) {
    console.error("Error adding weight entry:", error);
    throw error;
  }
};

// Delete weight entry
export const deleteWeightEntry = async (entryId: string): Promise<void> => {
  try {
    const entries = await loadWeightEntries();
    const filteredEntries = entries.filter((entry) => entry.id !== entryId);
    await AsyncStorage.setItem(
      WEIGHT_STORAGE_KEY,
      JSON.stringify(filteredEntries)
    );
  } catch (error) {
    console.error("Error deleting weight entry:", error);
    throw error;
  }
};

// Get weight goal
export const getWeightGoal = async (): Promise<number | null> => {
  try {
    const stored = await AsyncStorage.getItem(WEIGHT_GOAL_KEY);
    return stored ? parseFloat(stored) : null;
  } catch (error) {
    console.error("Error loading weight goal:", error);
    return null;
  }
};

// Set weight goal
export const setWeightGoal = async (goal: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(WEIGHT_GOAL_KEY, goal.toString());
  } catch (error) {
    console.error("Error setting weight goal:", error);
    throw error;
  }
};

// Clear all weight data
export const clearWeightData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(WEIGHT_STORAGE_KEY);
    await AsyncStorage.removeItem(WEIGHT_GOAL_KEY);
  } catch (error) {
    console.error("Error clearing weight data:", error);
    throw error;
  }
};
