import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SavedTimer {
  name: string;
  rounds: number;
  workTime: number;
  restTime: number;
  sets: number;
  setRestTime: number;
  savedAt: string;
}

const TIMER_STORAGE_KEY = "timers";

// Mock timer data based on the screenshot
export const MOCK_TIMERS: SavedTimer[] = [
  {
    name: "Jump rope (30min, 55min total)",
    rounds: 3,
    workTime: 40,  // 40 seconds
    restTime: 20,  // 20 seconds
    sets: 15,
    setRestTime: 40,  // 40 seconds
    savedAt: new Date().toISOString(),
  },
  // Additional workout-related timers
  {
    name: "Strength Training",
    rounds: 1,
    workTime: 45,  // 45 seconds work
    restTime: 15,  // 15 seconds rest
    sets: 3,
    setRestTime: 60,  // 60 seconds between sets
    savedAt: new Date().toISOString(),
  },
  {
    name: "HIIT Cardio",
    rounds: 4,
    workTime: 30,  // 30 seconds work
    restTime: 30,  // 30 seconds rest
    sets: 1,
    setRestTime: 0,
    savedAt: new Date().toISOString(),
  },
  {
    name: "Plank Hold",
    rounds: 1,
    workTime: 30,  // 30 seconds hold
    restTime: 30,  // 30 seconds rest
    sets: 3,
    setRestTime: 45,  // 45 seconds between sets
    savedAt: new Date().toISOString(),
  },
];

// Initialize mock timer data if needed
export const initializeMockTimerData = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
    const timers = existing ? JSON.parse(existing) : [];

    // Check if mock timers already exist
    const mockTimerNames = MOCK_TIMERS.map(timer => timer.name);
    const hasAllMocks = mockTimerNames.every(name => 
      timers.some((timer: SavedTimer) => timer.name === name)
    );

    if (!hasAllMocks) {
      // Add missing mock timers
      for (const mockTimer of MOCK_TIMERS) {
        const exists = timers.some((timer: SavedTimer) => timer.name === mockTimer.name);
        if (!exists) {
          timers.push(mockTimer);
        }
      }
      
      await AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timers));
      console.log("Mock timer data initialized");
    }
  } catch (error) {
    console.error("Error initializing mock timer data:", error);
  }
};

// Force refresh mock timer data
export const refreshMockTimerData = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
    const timers = existing ? JSON.parse(existing) : [];

    // Remove existing mock timers
    const mockTimerNames = MOCK_TIMERS.map(timer => timer.name);
    const filteredTimers = timers.filter(
      (timer: SavedTimer) => !mockTimerNames.includes(timer.name)
    );

    // Add fresh mock timers
    const updatedTimers = [...filteredTimers, ...MOCK_TIMERS];
    await AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(updatedTimers));
    console.log("Mock timer data refreshed");
  } catch (error) {
    console.error("Error refreshing mock timer data:", error);
  }
};

// Reset to mock timer data only
export const resetToMockTimerData = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(MOCK_TIMERS));
    console.log("Timer data reset to mock data");
  } catch (error) {
    console.error("Error resetting timer data:", error);
  }
};

// Load all saved timers
export const loadTimers = async (): Promise<SavedTimer[]> => {
  try {
    const stored = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SavedTimer[];
    }
    return [];
  } catch (error) {
    console.error("Error loading timers:", error);
    return [];
  }
};

// Clear all timer data
export const clearTimerData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
    console.log("Timer data cleared");
  } catch (error) {
    console.error("Error clearing timer data:", error);
  }
};