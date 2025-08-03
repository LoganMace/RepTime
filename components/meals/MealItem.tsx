import { IconSymbol } from "@/components/ui/IconSymbol";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MealEntry } from "./MealConstants";

interface MealItemProps {
  meal: MealEntry;
  onToggleFavorite: (mealId: string) => void;
  onDelete: (mealId: string) => void;
}

export default function MealItem({
  meal,
  onToggleFavorite,
  onDelete,
}: MealItemProps) {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  return (
    <View style={styles.mealItem}>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealNutrition}>
          {meal.calories} cal • {meal.protein}g protein
        </Text>
      </View>
      <View style={styles.mealActions}>
        <TouchableOpacity onPress={() => onToggleFavorite(meal.id)}>
          <IconSymbol
            name={meal.isFavorite ? "star.fill" : "star"}
            size={16}
            color={meal.isFavorite ? "#fbbf24" : "#666"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(meal.id)}>
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
}

const tabletStyles = StyleSheet.create({
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
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
    gap: 12,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  mealName: {
    ...tabletStyles.mealName,
    fontSize: 15,
  },
  mealNutrition: {
    ...tabletStyles.mealNutrition,
    fontSize: 13,
  },
});
