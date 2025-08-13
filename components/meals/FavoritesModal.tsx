import FormModal from "@/components/ui/FormModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { FavoriteMeal } from "@/utils/mealStorage";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CATEGORIES, MealEntry } from "./MealConstants";

interface FavoritesModalProps {
  visible: boolean;
  selectedCategory: MealEntry["category"] | null;
  favoriteMeals: FavoriteMeal[];
  onClose: () => void;
  onAddFromFavorites: (favorite: FavoriteMeal, servings: number) => void;
}

export default function FavoritesModal({
  visible,
  selectedCategory,
  favoriteMeals,
  onClose,
  onAddFromFavorites,
}: FavoritesModalProps) {
  const { colors } = useTheme();
  const categoryInfo = selectedCategory
    ? CATEGORIES.find((c) => c.key === selectedCategory)
    : null;

  // Track servings for each favorite item
  const [servingsMap, setServingsMap] = useState<{ [key: string]: string }>({});

  const styles = createStyles(colors);

  const renderFavoritesList = () => (
    <ScrollView
      style={styles.favoritesScrollView}
      showsVerticalScrollIndicator={false}
    >
      {favoriteMeals.length === 0 ? (
        <View style={styles.noFavoritesContainer}>
          <IconSymbol name="star" size={48} color={colors.textSecondary} />
          <Text style={styles.noFavoritesText}>
            No favorite meals yet. Add some meals to favorites by tapping the
            heart icon!
          </Text>
        </View>
      ) : (
        favoriteMeals.map((favorite) => {
          const servings = parseFloat(servingsMap[favorite.id] || "1") || 1;
          const totalCalories = Math.round(favorite.calories * servings);
          const totalProtein =
            Math.round(favorite.protein * servings * 10) / 10;

          return (
            <View
              key={favorite.id}
              style={[
                styles.favoriteItem,
                categoryInfo && {
                  backgroundColor: `${categoryInfo.lightColor}15`,
                  borderLeftWidth: 3,
                  borderLeftColor: categoryInfo.color,
                },
              ]}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.favoriteItemName}>{favorite.name}</Text>
                  <Text style={styles.nutritionInfo}>
                    {favorite.calories} cal • {favorite.protein}g protein per serving
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => onAddFromFavorites(favorite, servings)}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.servingsRow}>
                <Text style={styles.servingsLabel}>Servings:</Text>
                <TextInput
                  style={styles.servingsInput}
                  value={servingsMap[favorite.id] ?? "1"}
                  onChangeText={(text) => {
                    // Allow empty string for better UX
                    if (text === "") {
                      setServingsMap({
                        ...servingsMap,
                        [favorite.id]: "",
                      });
                      return;
                    }
                    
                    // Only allow positive numbers with up to 2 decimal places
                    const numericValue = text.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    if (parts.length > 2) return; // Prevent multiple decimal points
                    if (parts[1] && parts[1].length > 2) return; // Limit to 2 decimal places
                    if (parseFloat(numericValue) > 99) return; // Max 99 servings
                    setServingsMap({
                      ...servingsMap,
                      [favorite.id]: numericValue,
                    });
                  }}
                  keyboardType="decimal-pad"
                  placeholder="1"
                  placeholderTextColor={colors.placeholder}
                />
                <Text style={styles.totalText}>
                  = {totalCalories} cal, {totalProtein}g protein
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title={`Add from Favorites${
        categoryInfo ? ` to ${categoryInfo.name}` : ""
      }`}
      scrollable={false}
      size="large"
      secondaryButton={{
        text: "Close",
        onPress: onClose,
      }}
    >
      {renderFavoritesList()}
    </FormModal>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    favoritesScrollView: {
      maxHeight: 400,
      marginVertical: 8,
    },
    noFavoritesContainer: {
      alignItems: "center",
      paddingVertical: 40,
    },
    noFavoritesText: {
      marginTop: 16,
      textAlign: "center",
      fontSize: 16,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    favoriteItem: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    itemInfo: {
      flex: 1,
      marginRight: 12,
    },
    favoriteItemName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    nutritionInfo: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    servingsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    servingsLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    servingsInput: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: colors.inputText,
      width: 60,
      textAlign: "center",
    },
    totalText: {
      fontSize: 13,
      color: colors.textSecondary,
      flex: 1,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    addButtonText: {
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: "600",
    },
  });
