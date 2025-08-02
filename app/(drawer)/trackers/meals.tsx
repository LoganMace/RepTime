import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useMocksContext } from "@/contexts/MocksContext";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
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
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  category: "breakfast" | "lunch" | "dinner" | "snacks";
  isFavorite?: boolean;
  storageIndex?: number; // Index in storage for deletion
}

interface DailyGoals {
  calories: number;
  protein: number;
}

const MOCK_MEALS: MealEntry[] = [
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

const DAILY_GOALS: DailyGoals = {
  calories: 2200,
  protein: 150,
};

const CATEGORIES = [
  { key: "breakfast" as const, name: "Breakfast", icon: "sun.max.fill" },
  { key: "lunch" as const, name: "Lunch", icon: "sun.max" },
  { key: "dinner" as const, name: "Dinner", icon: "moon.fill" },
  { key: "snacks" as const, name: "Snacks", icon: "circle.fill" },
];

export default function MealsScreen() {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);
  const { useMocks } = useMocksContext();

  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<FavoriteMeal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
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
    Alert.alert(
      "View History",
      "This feature would show meal history over time"
    );
  };

  const renderProgressBar = (current: number, goal: number, color: string) => {
    const percentage = Math.min((current / goal) * 100, 100);

    return (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: color, width: `${percentage}%` },
          ]}
        />
      </View>
    );
  };

  const renderMealItem = (meal: MealEntry) => (
    <View key={meal.id} style={styles.mealItem}>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealNutrition}>
          {meal.calories} cal • {meal.protein}g protein
        </Text>
      </View>
      <View style={styles.mealActions}>
        <TouchableOpacity
          onPress={() => toggleFavorite(meal.id)}
          style={styles.favoriteButton}
        >
          <IconSymbol
            name={meal.isFavorite ? "star.fill" : "star"}
            size={16}
            color={meal.isFavorite ? "#fbbf24" : "#666"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteMeal(meal.id)}
          style={styles.favoriteButton}
        >
          <IconSymbol
            name="trash"
            size={16}
            color="#ef4444"
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategory = (category: (typeof CATEGORIES)[0]) => {
    const categoryMeals = meals.filter(
      (meal) => meal.category === category.key
    );

    return (
      <View key={category.key} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleContainer}>
            <IconSymbol
              name={category.icon as any}
              size={18}
              color="#fff"
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryTitle}>{category.name}</Text>
          </View>
          <Text style={styles.categoryCount}>
            {categoryMeals.length} item{categoryMeals.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {categoryMeals.map(renderMealItem)}

        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={[styles.addFoodButton, styles.addFoodButtonPrimary]}
            onPress={() => openAddModal(category.key)}
          >
            <Text style={styles.addFoodButtonText}>+ Add Food</Text>
          </TouchableOpacity>

          {favoriteMeals.length > 0 && (
            <TouchableOpacity
              style={[styles.addFoodButton, styles.addFoodButtonSecondary]}
              onPress={() => openFavoritesModal(category.key)}
            >
              <View style={styles.favoritesButtonContent}>
                <IconSymbol name="star.fill" size={14} color="#A0A0A0" />
                <Text style={styles.addFavoritesButtonText}>
                  From Favorites
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
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
        <View style={styles.summarySection}>
          <ThemedText style={styles.summaryTitle}>Daily Summary</ThemedText>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{dailyTotals.calories}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
              <Text style={styles.summaryGoal}>
                Goal: {DAILY_GOALS.calories}
              </Text>
              {renderProgressBar(
                dailyTotals.calories,
                DAILY_GOALS.calories,
                "#3b82f6"
              )}
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{dailyTotals.protein}g</Text>
              <Text style={styles.summaryLabel}>Protein</Text>
              <Text style={styles.summaryGoal}>
                Goal: {DAILY_GOALS.protein}g
              </Text>
              {renderProgressBar(
                dailyTotals.protein,
                DAILY_GOALS.protein,
                "#10b981"
              )}
            </View>
          </View>
        </View>

        {/* Meal Categories */}
        {CATEGORIES.map(renderCategory)}
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>
                Add to{" "}
                {selectedCategory &&
                  CATEGORIES.find((c) => c.key === selectedCategory)?.name}
              </Text>
              {selectedCategory && (
                <IconSymbol
                  name={
                    CATEGORIES.find((c) => c.key === selectedCategory)
                      ?.icon as any
                  }
                  size={20}
                  color="#fff"
                />
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Food name"
              value={newMeal.name}
              onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Calories"
              value={newMeal.calories}
              onChangeText={(text) =>
                setNewMeal({ ...newMeal, calories: text })
              }
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.input}
              placeholder="Protein (g)"
              value={newMeal.protein}
              onChangeText={(text) => setNewMeal({ ...newMeal, protein: text })}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddMeal}
              >
                <Text style={styles.addButtonText}>Add Food</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Favorites Modal */}
      <Modal
        visible={showFavoritesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFavoritesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>
                Add from Favorites to{" "}
                {selectedCategory &&
                  CATEGORIES.find((c) => c.key === selectedCategory)?.name}
              </Text>
              {selectedCategory && (
                <IconSymbol
                  name={
                    CATEGORIES.find((c) => c.key === selectedCategory)
                      ?.icon as any
                  }
                  size={20}
                  color="#fff"
                />
              )}
            </View>

            <ScrollView
              style={styles.favoritesScrollView}
              showsVerticalScrollIndicator={false}
            >
              {favoriteMeals.length === 0 ? (
                <Text style={styles.noFavoritesText}>
                  No favorite meals yet. Add some meals to favorites by tapping
                  the heart icon!
                </Text>
              ) : (
                favoriteMeals.map((favorite) => (
                  <TouchableOpacity
                    key={favorite.id}
                    style={styles.favoriteItem}
                    onPress={() => addFromFavorites(favorite)}
                  >
                    <View style={styles.favoriteItemInfo}>
                      <Text style={styles.favoriteItemName}>
                        {favorite.name}
                      </Text>
                      <Text style={styles.favoriteItemNutrition}>
                        {favorite.calories} cal • {favorite.protein}g protein
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowFavoritesModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const tabletStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
    color: "#fff",
  },
  dateActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
  summarySection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#A0A0A0",
    marginBottom: 4,
  },
  summaryGoal: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  categorySection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  categoryCount: {
    fontSize: 14,
    color: "#666",
  },
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 4,
  },
  mealNutrition: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  mealActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteButtonText: {
    fontSize: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
  addButtonContainer: {
    marginTop: 12,
    gap: 8,
  },
  addFoodButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
  },
  addFoodButtonPrimary: {
    borderColor: "#3b82f6",
    borderStyle: "dashed",
  },
  addFoodButtonSecondary: {
    borderColor: "#666",
    borderStyle: "dashed",
    backgroundColor: "rgba(102, 102, 102, 0.05)",
  },
  addFoodButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },
  addFavoritesButtonText: {
    color: "#A0A0A0",
    fontSize: 16,
    fontWeight: "500",
  },
  favoritesButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  cancelButtonText: {
    color: "#CCCCCC",
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#3b82f6",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  favoritesScrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  noFavoritesText: {
    color: "#A0A0A0",
    fontSize: 14,
    textAlign: "center",
    padding: 20,
    lineHeight: 20,
  },
  favoriteItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  favoriteItemInfo: {
    flex: 1,
  },
  favoriteItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 4,
  },
  favoriteItemNutrition: {
    fontSize: 14,
    color: "#A0A0A0",
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  scrollView: {
    ...tabletStyles.scrollView,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dateSection: {
    ...tabletStyles.dateSection,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  },
  dateActions: {
    ...tabletStyles.dateActions,
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  actionButton: {
    ...tabletStyles.actionButton,
    flex: 1,
    alignItems: "center",
  },
  summarySection: {
    ...tabletStyles.summarySection,
    padding: 16,
  },
  summaryRow: {
    ...tabletStyles.summaryRow,
    gap: 16,
  },
  summaryValue: {
    ...tabletStyles.summaryValue,
    fontSize: 24,
  },
  categorySection: {
    ...tabletStyles.categorySection,
    padding: 12,
  },
  categoryTitle: {
    ...tabletStyles.categoryTitle,
    fontSize: 16,
  },
  categoryIcon: {
    ...tabletStyles.categoryIcon,
  },
  mealName: {
    ...tabletStyles.mealName,
    fontSize: 15,
  },
  mealNutrition: {
    ...tabletStyles.mealNutrition,
    fontSize: 13,
  },
  modalContent: {
    ...tabletStyles.modalContent,
    width: "95%",
    margin: 16,
  },
  modalTitle: {
    ...tabletStyles.modalTitle,
    fontSize: 18,
  },
  favoriteItemName: {
    ...tabletStyles.favoriteItemName,
    fontSize: 15,
  },
  favoriteItemNutrition: {
    ...tabletStyles.favoriteItemNutrition,
    fontSize: 13,
  },
  addFavoritesButtonText: {
    ...tabletStyles.addFavoritesButtonText,
    fontSize: 14,
    color: "#A0A0A0",
  },
  cancelButtonText: {
    ...tabletStyles.cancelButtonText,
    color: "#CCCCCC",
    fontSize: 14,
  },
  modalButton: {
    ...tabletStyles.modalButton,
    paddingVertical: 12,
  },
  deleteButtonText: {
    ...tabletStyles.deleteButtonText,
    fontSize: 14,
  },
});
