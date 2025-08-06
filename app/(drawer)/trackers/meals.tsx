import MealHistoryModal from "@/components/MealHistoryModal";
import AddMealModal from "@/components/meals/AddMealModal";
import DailySummary from "@/components/meals/DailySummary";
import FavoritesModal from "@/components/meals/FavoritesModal";
import MealCategory from "@/components/meals/MealCategory";
import {
  CATEGORIES,
  DAILY_GOALS,
  MOCK_MEALS,
  type MealEntry,
} from "@/components/meals/MealConstants";
import { ThemedView } from "@/components/ThemedView";
import { useMocksContext } from "@/contexts/MocksContext";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import {
  addMealEntry,
  addToFavorites,
  formatDateForStorage,
  getFavoriteId,
  getMealsForDate,
  loadFavoriteMeals,
  removeFromFavorites,
  removeMealEntry,
  type FavoriteMeal,
  type MealType,
  type MealEntry as StoredMealEntry,
} from "@/utils/mealStorage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MealsScreen() {
  const { getStyles } = useResponsiveStyles();
  const { colors } = useTheme();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));
  const { useMocks } = useMocksContext();

  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<FavoriteMeal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    MealEntry["category"] | null
  >(null);
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
  });
  const [currentDate] = useState(formatDateForStorage());

  const loadMealsFromStorage = useCallback(async () => {
    try {
      // Load favorite meals
      const favorites = await loadFavoriteMeals();
      setFavoriteMeals(favorites);

      if (useMocks) {
        // Use mock data when mocks are enabled
        const mockMealsWithIds = MOCK_MEALS.map((meal, index) => ({
          ...meal,
          id: `mock-${index}`,
        }));
        setMeals(mockMealsWithIds);
      } else {
        // Load from AsyncStorage
        const dayMeals = await getMealsForDate(currentDate);
        const allMeals: MealEntry[] = [];

        // Convert storage format to component format
        for (const [category, categoryMeals] of Object.entries(dayMeals)) {
          for (let index = 0; index < categoryMeals.length; index++) {
            const meal = categoryMeals[index];
            const favoriteId = await getFavoriteId(meal);
            allMeals.push({
              id: `${category}-${index}-${Date.now()}`,
              name: meal.name,
              calories: meal.calories,
              protein: meal.protein,
              category: category as MealEntry["category"],
              isFavorite: favoriteId !== null,
              storageIndex: index,
            });
          }
        }

        setMeals(allMeals);
      }
    } catch (error) {
      console.error("Error loading meals:", error);
      Alert.alert("Error", "Failed to load meals");
    }
  }, [currentDate, useMocks]);

  // Load meals from storage on component mount
  useEffect(() => {
    loadMealsFromStorage();
  }, [loadMealsFromStorage]);

  // Calculate daily totals
  const dailyTotals = meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
    }),
    { calories: 0, protein: 0 }
  );

  const handleAddMeal = async () => {
    if (
      !newMeal.name ||
      !newMeal.calories ||
      !newMeal.protein ||
      !selectedCategory
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      if (useMocks) {
        // For mock mode, just add to local state
        const meal: MealEntry = {
          id: Date.now().toString(),
          name: newMeal.name,
          calories: parseInt(newMeal.calories),
          protein: parseFloat(newMeal.protein),
          category: selectedCategory,
        };
        setMeals([...meals, meal]);
      } else {
        // Save to AsyncStorage
        const mealForStorage: StoredMealEntry = {
          name: newMeal.name,
          calories: parseInt(newMeal.calories),
          protein: parseFloat(newMeal.protein),
        };

        await addMealEntry(
          currentDate,
          selectedCategory as MealType,
          mealForStorage
        );

        // Reload meals to reflect the change
        await loadMealsFromStorage();
      }

      setNewMeal({ name: "", calories: "", protein: "" });
      setShowAddModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error adding meal:", error);
      Alert.alert("Error", "Failed to add meal");
    }
  };

  const handleMealChange = (field: string, value: string) => {
    setNewMeal({ ...newMeal, [field]: value });
  };

  const openAddModal = (category: MealEntry["category"]) => {
    setSelectedCategory(category);
    setShowAddModal(true);
  };

  const openFavoritesModal = (category: MealEntry["category"]) => {
    setSelectedCategory(category);
    setShowFavoritesModal(true);
  };

  const addFromFavorites = async (favorite: FavoriteMeal) => {
    try {
      if (!selectedCategory) return;

      if (useMocks) {
        // For mock mode, just add to local state
        const meal: MealEntry = {
          id: Date.now().toString(),
          name: favorite.name,
          calories: favorite.calories,
          protein: favorite.protein,
          category: selectedCategory,
          isFavorite: true,
        };
        setMeals([...meals, meal]);
      } else {
        // Save to AsyncStorage
        const mealForStorage: StoredMealEntry = {
          name: favorite.name,
          calories: favorite.calories,
          protein: favorite.protein,
        };

        await addMealEntry(
          currentDate,
          selectedCategory as MealType,
          mealForStorage
        );

        // Reload meals to reflect the change
        await loadMealsFromStorage();
      }

      setShowFavoritesModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error adding meal from favorites:", error);
      Alert.alert("Error", "Failed to add meal from favorites");
    }
  };

  const toggleFavorite = async (mealId: string) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      const mealEntry: StoredMealEntry = {
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
      };

      if (meal.isFavorite) {
        // Remove from favorites
        await removeFromFavorites(mealId);
      } else {
        // Add to favorites
        await addToFavorites(mealEntry);
      }

      // Update local state
      setMeals(
        meals.map((m) =>
          m.id === mealId ? { ...m, isFavorite: !m.isFavorite } : m
        )
      );

      // Reload favorites
      const updatedFavorites = await loadFavoriteMeals();
      setFavoriteMeals(updatedFavorites);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorite");
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      // Show confirmation dialog
      Alert.alert(
        "Delete Meal",
        `Are you sure you want to delete "${meal.name}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                if (useMocks) {
                  // For mock mode, just remove from local state
                  setMeals(meals.filter((m) => m.id !== mealId));
                } else {
                  // Remove from AsyncStorage
                  if (meal.storageIndex !== undefined) {
                    await removeMealEntry(
                      currentDate,
                      meal.category as MealType,
                      meal.storageIndex
                    );

                    // Reload meals to reflect the change
                    await loadMealsFromStorage();
                  }
                }
              } catch (error) {
                console.error("Error deleting meal:", error);
                Alert.alert("Error", "Failed to delete meal");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting meal:", error);
      Alert.alert("Error", "Failed to delete meal");
    }
  };

  const viewHistory = () => {
    setShowHistoryModal(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selector */}
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>
            Today, {new Date().toLocaleDateString()}
          </Text>
          <View style={styles.dateActions}>
            <TouchableOpacity style={styles.actionButton} onPress={viewHistory}>
              <Text style={styles.actionButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Summary */}
        <DailySummary dailyTotals={dailyTotals} dailyGoals={DAILY_GOALS} />

        {/* Meal Categories */}
        {CATEGORIES.map((category) => (
          <MealCategory
            key={category.key}
            category={category}
            meals={meals}
            favoriteMeals={favoriteMeals}
            onAddMeal={openAddModal}
            onAddFromFavorites={openFavoritesModal}
            onToggleFavorite={toggleFavorite}
            onDeleteMeal={deleteMeal}
          />
        ))}
      </ScrollView>

      {/* Add Meal Modal */}
      <AddMealModal
        visible={showAddModal}
        selectedCategory={selectedCategory}
        newMeal={newMeal}
        onClose={() => setShowAddModal(false)}
        onAddMeal={handleAddMeal}
        onMealChange={handleMealChange}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        visible={showFavoritesModal}
        selectedCategory={selectedCategory}
        favoriteMeals={favoriteMeals}
        onClose={() => setShowFavoritesModal(false)}
        onAddFromFavorites={addFromFavorites}
      />

      {/* History Modal */}
      <MealHistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </ThemedView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  dateActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    scrollView: {
      ...tablet.scrollView,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    dateSection: {
      ...tablet.dateSection,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 12,
    },
    dateActions: {
      ...tablet.dateActions,
      alignSelf: "stretch",
      justifyContent: "space-between",
    },
    actionButton: {
      ...tablet.actionButton,
      flex: 1,
      alignItems: "center",
    },
  });
};
