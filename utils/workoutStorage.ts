import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WorkoutExercise {
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
  workTime: string;
  restTime: string;
  setRest: string;
  warmup: boolean;
  cooldown: boolean;
}

export interface WorkoutPlan {
  name: string;
  exercises: WorkoutExercise[];
  savedAt: string;
}

const WORKOUT_STORAGE_KEY = "workoutPlans";

// Mock workout data - Workout A
export const MOCK_WORKOUT_A: WorkoutPlan = {
  name: "Full Body Dumbbell Workout A",
  exercises: [
    // Warm-Up exercises
    {
      exercise: "Jump rope",
      sets: "3",
      reps: "1",
      weight: "",
      workTime: "30", // 30s on
      restTime: "30", // 30s off
      setRest: "",
      warmup: true,
      cooldown: false,
    },
    {
      exercise: "Arm circles",
      sets: "1",
      reps: "10",
      weight: "",
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: true,
      cooldown: false,
    },
    {
      exercise: "Bodyweight squats",
      sets: "1",
      reps: "10",
      weight: "",
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: true,
      cooldown: false,
    },
    // Main Workout exercises
    {
      exercise: "Goblet Squat",
      sets: "3",
      reps: "10",
      weight: "11.34", // 25 lbs in kg (exact: 11.3398)
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Dumbbell Bench Press",
      sets: "3",
      reps: "10",
      weight: "6.804", // 15 lbs in kg (exact: 6.80389)
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "1-Arm Dumbbell Row (bench-supported)",
      sets: "3",
      reps: "10", // each arm
      weight: "11.34", // 25 lbs in kg (exact: 11.3398)
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Seated Dumbbell Shoulder Press",
      sets: "3",
      reps: "8",
      weight: "6.804", // 15 lbs in kg (exact: 6.80389)
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Incline Dumbbell Curl",
      sets: "2",
      reps: "10",
      weight: "6.804", // 15 lbs in kg (exact: 6.80389)
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Plank",
      sets: "2",
      reps: "1",
      weight: "",
      workTime: "30", // 30-45 sec, using 30s
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: true,
    },
    {
      exercise: "Jump rope",
      sets: "2",
      reps: "1",
      weight: "",
      workTime: "30", // 30s on
      restTime: "30", // 30s off
      setRest: "",
      warmup: false,
      cooldown: true,
    },
  ],
  savedAt: new Date().toISOString(),
};

// Mock workout data - Workout B
export const MOCK_WORKOUT_B: WorkoutPlan = {
  name: "Full Body Dumbbell Workout B",
  exercises: [
    // Warm-Up exercises
    {
      exercise: "Jump rope or march",
      sets: "1",
      reps: "1",
      weight: "",
      workTime: "120", // 2-3 min, using 2 min (120s)
      restTime: "",
      setRest: "",
      warmup: true,
      cooldown: false,
    },
    {
      exercise: "Leg swings + arm crosses",
      sets: "1",
      reps: "10",
      weight: "",
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: true,
      cooldown: false,
    },
    // Main Workout exercises
    {
      exercise: "Dumbbell Reverse Lunge",
      sets: "3",
      reps: "8", // each leg
      weight: "6.804", // 15 lbs in kg
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Dumbbell Romanian Deadlift",
      sets: "3",
      reps: "10",
      weight: "11.34", // 25 lbs in kg
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Incline Dumbbell Chest Press",
      sets: "3",
      reps: "10",
      weight: "6.804", // 15 lbs in kg
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Dumbbell Curl to Arnold Press",
      sets: "3",
      reps: "8",
      weight: "6.804", // 15 lbs in kg
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Russian Twists",
      sets: "2",
      reps: "20", // total
      weight: "4.536", // 10 lbs in kg (optional)
      workTime: "",
      restTime: "30",
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    {
      exercise: "Jump rope",
      sets: "3",
      reps: "1",
      weight: "",
      workTime: "30", // 30s on
      restTime: "30", // 30s off
      setRest: "",
      warmup: false,
      cooldown: false,
    },
    // Cool-Down exercises
    {
      exercise: "Stretch hamstrings, chest, shoulders",
      sets: "1",
      reps: "1",
      weight: "",
      workTime: "120", // 2-3 min, using 2 min (120s)
      restTime: "",
      setRest: "",
      warmup: false,
      cooldown: true,
    },
    {
      exercise: "Deep breathing",
      sets: "1",
      reps: "1",
      weight: "",
      workTime: "60", // 1 min
      restTime: "",
      setRest: "",
      warmup: false,
      cooldown: true,
    },
  ],
  savedAt: new Date().toISOString(),
};

// Initialize mock workout data if needed
export const initializeMockWorkoutData = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(WORKOUT_STORAGE_KEY);
    const workoutPlans = existing ? JSON.parse(existing) : [];

    // Check if our mock workouts already exist
    const mockAExists = workoutPlans.some(
      (plan: WorkoutPlan) => plan.name === MOCK_WORKOUT_A.name
    );
    const mockBExists = workoutPlans.some(
      (plan: WorkoutPlan) => plan.name === MOCK_WORKOUT_B.name
    );

    let updated = false;
    if (!mockAExists) {
      workoutPlans.push(MOCK_WORKOUT_A);
      updated = true;
    }
    if (!mockBExists) {
      workoutPlans.push(MOCK_WORKOUT_B);
      updated = true;
    }

    if (updated) {
      await AsyncStorage.setItem(
        WORKOUT_STORAGE_KEY,
        JSON.stringify(workoutPlans)
      );
      console.log("Mock workout data initialized");
    }
  } catch (error) {
    console.error("Error initializing mock workout data:", error);
  }
};

// Force refresh mock data (removes old and adds new)
export const refreshMockWorkoutData = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(WORKOUT_STORAGE_KEY);
    const workoutPlans = existing ? JSON.parse(existing) : [];

    // Remove any existing mock workouts (both old and new names)
    const filteredPlans = workoutPlans.filter(
      (plan: WorkoutPlan) =>
        plan.name !== MOCK_WORKOUT_A.name &&
        plan.name !== MOCK_WORKOUT_B.name &&
        plan.name !== "Full Body Dumbbell Workout" // Remove old name too
    );

    // Add fresh mock workouts with updated values
    filteredPlans.push(MOCK_WORKOUT_A);
    filteredPlans.push(MOCK_WORKOUT_B);
    await AsyncStorage.setItem(
      WORKOUT_STORAGE_KEY,
      JSON.stringify(filteredPlans)
    );
    console.log("Mock workout data refreshed with new values");
  } catch (error) {
    console.error("Error refreshing mock workout data:", error);
  }
};

// Reset to include mock data
export const addMockWorkoutData = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(WORKOUT_STORAGE_KEY);
    const workoutPlans = existing ? JSON.parse(existing) : [];

    // Remove existing mocks if present
    const filteredPlans = workoutPlans.filter(
      (plan: WorkoutPlan) => 
        plan.name !== MOCK_WORKOUT_A.name &&
        plan.name !== MOCK_WORKOUT_B.name
    );

    // Add fresh mock workouts
    filteredPlans.push(MOCK_WORKOUT_A);
    filteredPlans.push(MOCK_WORKOUT_B);
    await AsyncStorage.setItem(
      WORKOUT_STORAGE_KEY,
      JSON.stringify(filteredPlans)
    );
    console.log("Mock workouts added successfully");
  } catch (error) {
    console.error("Error adding mock workout data:", error);
  }
};
