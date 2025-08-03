import { IconSymbol } from "@/components/ui/IconSymbol";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { FavoriteMeal } from "@/utils/mealStorage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CATEGORIES, MealEntry } from "./MealConstants";
import MealItem from "./MealItem";

interface MealCategoryProps {
  category: (typeof CATEGORIES)[number];
  meals: MealEntry[];
  favoriteMeals: FavoriteMeal[];
  onAddMeal: (category: MealEntry["category"]) => void;
  onAddFromFavorites: (category: MealEntry["category"]) => void;
  onToggleFavorite: (mealId: string) => void;
  onDeleteMeal: (mealId: string) => void;
}

export default function MealCategory({
  category,
  meals,
  favoriteMeals,
  onAddMeal,
  onAddFromFavorites,
  onToggleFavorite,
  onDeleteMeal,
}: MealCategoryProps) {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  const categoryMeals = meals.filter((meal) => meal.category === category.key);

  return (
    <View
      style={[
        styles.categorySection,
        { borderLeftWidth: 4, borderLeftColor: category.color },
      ]}
    >
      <View style={styles.categoryHeader}>
        <View style={styles.categoryTitleContainer}>
          <View
            style={[
              styles.categoryIconContainer,
              { backgroundColor: category.color },
            ]}
          >
            <IconSymbol
              name={category.icon as any}
              size={22}
              color="#fff"
              style={styles.categoryIcon}
            />
          </View>
          <Text style={styles.categoryTitle}>{category.name}</Text>
        </View>
        <View
          style={[
            styles.categoryCountBadge,
            { backgroundColor: category.color },
          ]}
        >
          <Text style={styles.categoryCount}>{categoryMeals.length}</Text>
        </View>
      </View>

      {categoryMeals.map((meal) => (
        <MealItem
          key={meal.id}
          meal={meal}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDeleteMeal}
        />
      ))}

      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[
            styles.addFoodButton,
            styles.addFoodButtonPrimary,
            { borderColor: category.color },
          ]}
          onPress={() => onAddMeal(category.key)}
        >
          <View style={styles.addButtonContent}>
            <IconSymbol name="plus" size={16} color={category.color} />
            <Text style={[styles.addFoodButtonText, { color: category.color }]}>
              Add Food
            </Text>
          </View>
        </TouchableOpacity>

        {favoriteMeals.length > 0 && (
          <TouchableOpacity
            style={[styles.addFoodButton, styles.addFoodButtonSecondary]}
            onPress={() => onAddFromFavorites(category.key)}
          >
            <View style={styles.favoritesButtonContent}>
              <IconSymbol name="star.fill" size={14} color="#A0A0A0" />
              <Text style={styles.addFavoritesButtonText}>From Favorites</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const tabletStyles = StyleSheet.create({
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
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIcon: {
    marginRight: 0,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  categoryCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
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
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addFoodButtonPrimary: {
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
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
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
  addFavoritesButtonText: {
    ...tabletStyles.addFavoritesButtonText,
    fontSize: 14,
    color: "#A0A0A0",
  },
});
