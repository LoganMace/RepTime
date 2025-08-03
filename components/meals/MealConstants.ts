export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  category: "breakfast" | "lunch" | "dinner" | "snacks";
  isFavorite?: boolean;
  storageIndex?: number; // Index in storage for deletion
}

export interface DailyGoals {
  calories: number;
  protein: number;
}

export const MOCK_MEALS: MealEntry[] = [
  {
    id: "1",
    name: "Greek Yogurt with Berries",
    calories: 180,
    protein: 15,
    category: "breakfast",
    isFavorite: true,
  },
  {
    id: "2",
    name: "2 Scrambled Eggs",
    calories: 140,
    protein: 12,
    category: "breakfast",
  },
  {
    id: "3",
    name: "Grilled Chicken Salad",
    calories: 350,
    protein: 35,
    category: "lunch",
    isFavorite: true,
  },
  {
    id: "4",
    name: "Brown Rice (1 cup)",
    calories: 220,
    protein: 5,
    category: "lunch",
  },
  {
    id: "5",
    name: "Salmon with Vegetables",
    calories: 420,
    protein: 38,
    category: "dinner",
  },
  {
    id: "6",
    name: "Sweet Potato",
    calories: 180,
    protein: 4,
    category: "dinner",
  },
  {
    id: "7",
    name: "Protein Shake",
    calories: 160,
    protein: 25,
    category: "snacks",
    isFavorite: true,
  },
  {
    id: "8",
    name: "Mixed Nuts (1 oz)",
    calories: 170,
    protein: 6,
    category: "snacks",
  },
];

export const DAILY_GOALS: DailyGoals = {
  calories: 2200,
  protein: 150,
};

export const CATEGORIES = [
  {
    key: "breakfast" as const,
    name: "Breakfast",
    icon: "sunrise.fill",
    color: "#ff6b6b",
    lightColor: "#ffe0e0",
  },
  {
    key: "lunch" as const,
    name: "Lunch",
    icon: "sun.max.fill",
    color: "#4ecdc4",
    lightColor: "#e0f7f6",
  },
  {
    key: "dinner" as const,
    name: "Dinner",
    icon: "sunset.fill",
    color: "#45b7d1",
    lightColor: "#e0f1f8",
  },
  {
    key: "snacks" as const,
    name: "Snacks",
    icon: "sparkles",
    color: "#96ceb4",
    lightColor: "#f0f9f5",
  },
] as const;
