import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
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
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

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
            color={meal.isFavorite ? colors.warning : colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(meal.id)}>
          <IconSymbol
            name="trash"
            size={16}
            color={colors.error}
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  mealNutrition: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mealActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    mealName: {
      ...tablet.mealName,
      fontSize: 15,
    },
    mealNutrition: {
      ...tablet.mealNutrition,
      fontSize: 13,
    },
  });
};
