import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useMocksContext } from "@/contexts/MocksContext";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import React, { useState } from "react";
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
  { key: "breakfast" as const, name: "Breakfast", icon: "🥐" },
  { key: "lunch" as const, name: "Lunch", icon: "🥗" },
  { key: "dinner" as const, name: "Dinner", icon: "🍽️" },
  { key: "snacks" as const, name: "Snacks", icon: "🍎" },
];

export default function MealsScreen() {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);
  const { useMocks } = useMocksContext();

  const [meals, setMeals] = useState<MealEntry[]>(useMocks ? MOCK_MEALS : []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    MealEntry["category"] | null
  >(null);
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
  });

  // Calculate daily totals
  const dailyTotals = meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
    }),
    { calories: 0, protein: 0 }
  );

  const handleAddMeal = () => {
    if (
      !newMeal.name ||
      !newMeal.calories ||
      !newMeal.protein ||
      !selectedCategory
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const meal: MealEntry = {
      id: Date.now().toString(),
      name: newMeal.name,
      calories: parseInt(newMeal.calories),
      protein: parseFloat(newMeal.protein),
      category: selectedCategory,
    };

    setMeals([...meals, meal]);
    setNewMeal({ name: "", calories: "", protein: "" });
    setShowAddModal(false);
    setSelectedCategory(null);
  };

  const openAddModal = (category: MealEntry["category"]) => {
    setSelectedCategory(category);
    setShowAddModal(true);
  };

  const toggleFavorite = (mealId: string) => {
    setMeals(
      meals.map((meal) =>
        meal.id === mealId ? { ...meal, isFavorite: !meal.isFavorite } : meal
      )
    );
  };

  const copyFromYesterday = () => {
    Alert.alert(
      "Copy from Yesterday",
      "This feature would copy meals from the previous day"
    );
  };

  const viewTrends = () => {
    Alert.alert(
      "View Trends",
      "This feature would show nutrition trends over time"
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
        <Text style={styles.mealName}>
          {meal.name} {meal.isFavorite && "⭐"}
        </Text>
        <Text style={styles.mealNutrition}>
          {meal.calories} cal • {meal.protein}g protein
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => toggleFavorite(meal.id)}
        style={styles.favoriteButton}
      >
        <Text style={styles.favoriteButtonText}>
          {meal.isFavorite ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategory = (category: (typeof CATEGORIES)[0]) => {
    const categoryMeals = meals.filter(
      (meal) => meal.category === category.key
    );

    return (
      <View key={category.key} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>
            {category.icon} {category.name}
          </Text>
          <Text style={styles.categoryCount}>
            {categoryMeals.length} item{categoryMeals.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {categoryMeals.map(renderMealItem)}

        <TouchableOpacity
          style={styles.addFoodButton}
          onPress={() => openAddModal(category.key)}
        >
          <Text style={styles.addFoodButtonText}>+ Add Food</Text>
        </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={copyFromYesterday}
            >
              <Text style={styles.actionButtonText}>Copy Yesterday</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={viewTrends}>
              <Text style={styles.actionButtonText}>View Trends</Text>
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
            <Text style={styles.modalTitle}>
              Add to{" "}
              {selectedCategory &&
                CATEGORIES.find((c) => c.key === selectedCategory)?.name}
            </Text>

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
  favoriteButton: {
    padding: 8,
  },
  favoriteButtonText: {
    fontSize: 16,
  },
  addFoodButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#3b82f6",
    borderStyle: "dashed",
    alignItems: "center",
  },
  addFoodButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
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
    color: "#A0A0A0",
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
});
