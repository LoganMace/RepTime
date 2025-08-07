import { IconSymbol } from "@/components/ui/IconSymbol";
import FormModal from "@/components/ui/FormModal";
import { FavoriteMeal } from "@/utils/mealStorage";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CATEGORIES, MealEntry } from "./MealConstants";

interface FavoritesModalProps {
  visible: boolean;
  selectedCategory: MealEntry["category"] | null;
  favoriteMeals: FavoriteMeal[];
  onClose: () => void;
  onAddFromFavorites: (favorite: FavoriteMeal) => void;
}

export default function FavoritesModal({
  visible,
  selectedCategory,
  favoriteMeals,
  onClose,
  onAddFromFavorites,
}: FavoritesModalProps) {
  const { colors } = useTheme();
  const categoryInfo = selectedCategory ? CATEGORIES.find(c => c.key === selectedCategory) : null;

  const styles = StyleSheet.create({
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
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    favoriteItemContent: {
      flex: 1,
    },
    favoriteItemName: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
      color: colors.text,
    },
    favoriteItemDetails: {
      flexDirection: "row",
      gap: 16,
    },
    favoriteItemDetail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  const renderFavoritesList = () => (
    <ScrollView
      style={styles.favoritesScrollView}
      showsVerticalScrollIndicator={false}
    >
      {favoriteMeals.length === 0 ? (
        <View style={styles.noFavoritesContainer}>
          <IconSymbol name="star" size={48} color={colors.textSecondary} />
          <Text style={styles.noFavoritesText}>
            No favorite meals yet. Add some meals to favorites by tapping the heart icon!
          </Text>
        </View>
      ) : (
        favoriteMeals.map((favorite) => (
          <TouchableOpacity
            key={favorite.id}
            style={[
              styles.favoriteItem,
              categoryInfo && {
                backgroundColor: `${categoryInfo.lightColor}15`,
                borderLeftWidth: 3,
                borderLeftColor: categoryInfo.color,
              },
            ]}
            onPress={() => onAddFromFavorites(favorite)}
          >
            <View style={styles.favoriteItemContent}>
              <Text style={styles.favoriteItemName}>{favorite.name}</Text>
              <View style={styles.favoriteItemDetails}>
                <Text style={styles.favoriteItemDetail}>
                  {favorite.calories} cal
                </Text>
                <Text style={styles.favoriteItemDetail}>
                  {favorite.protein}g protein
                </Text>
              </View>
            </View>
            <IconSymbol name="plus" size={20} color={colors.primary} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title={`Add from Favorites${categoryInfo ? ` to ${categoryInfo.name}` : ""}`}
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