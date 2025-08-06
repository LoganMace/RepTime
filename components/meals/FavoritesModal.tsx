import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { FavoriteMeal } from "@/utils/mealStorage";
import React from "react";
import {
  Modal,
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
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            selectedCategory && {
              borderWidth: 2,
              borderColor:
                CATEGORIES.find((c) => c.key === selectedCategory)?.color ||
                colors.border,
            },
          ]}
        >
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>
              Add from Favorites to{" "}
              {selectedCategory &&
                CATEGORIES.find((c) => c.key === selectedCategory)?.name}
            </Text>
            {selectedCategory && (
              <View
                style={[
                  styles.categoryIconContainer,
                  {
                    backgroundColor:
                      CATEGORIES.find((c) => c.key === selectedCategory)
                        ?.color || colors.border,
                  },
                ]}
              >
                <IconSymbol
                  name={
                    CATEGORIES.find((c) => c.key === selectedCategory)
                      ?.icon as any
                  }
                  size={18}
                  color={colors.textInverse}
                />
              </View>
            )}
          </View>

          <ScrollView
            style={styles.favoritesScrollView}
            showsVerticalScrollIndicator={false}
          >
            {favoriteMeals.length === 0 ? (
              <View style={styles.noFavoritesContainer}>
                <IconSymbol name="star" size={48} color={colors.textSecondary} />
                <Text style={styles.noFavoritesText}>
                  No favorite meals yet. Add some meals to favorites by tapping
                  the heart icon!
                </Text>
              </View>
            ) : (
              favoriteMeals.map((favorite) => (
                <TouchableOpacity
                  key={favorite.id}
                  style={[
                    styles.favoriteItem,
                    selectedCategory && {
                      backgroundColor: `${
                        CATEGORIES.find((c) => c.key === selectedCategory)
                          ?.lightColor || colors.inputBackground
                      }15`,
                      borderLeftWidth: 3,
                      borderLeftColor:
                        CATEGORIES.find((c) => c.key === selectedCategory)
                          ?.color || colors.border,
                      borderRadius: 8,
                      marginVertical: 2,
                      paddingHorizontal: 12,
                    },
                  ]}
                  onPress={() => onAddFromFavorites(favorite)}
                >
                  <View style={styles.favoriteItemInfo}>
                    <Text style={styles.favoriteItemName}>{favorite.name}</Text>
                    <Text style={styles.favoriteItemNutrition}>
                      {favorite.calories} cal • {favorite.protein}g protein
                    </Text>
                  </View>
                  <View style={styles.favoriteItemAction}>
                    <IconSymbol
                      name="plus.circle.fill"
                      size={20}
                      color={
                        selectedCategory
                          ? CATEGORIES.find((c) => c.key === selectedCategory)
                              ?.color || colors.primary
                          : colors.primary
                      }
                    />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  favoritesScrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  noFavoritesContainer: {
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  noFavoritesText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  favoriteItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteItemInfo: {
    flex: 1,
  },
  favoriteItemAction: {
    paddingLeft: 8,
  },
  favoriteItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  favoriteItemNutrition: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.inputBackground,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    modalContent: {
      ...tablet.modalContent,
      width: "95%",
      margin: 16,
    },
    modalTitle: {
      ...tablet.modalTitle,
      fontSize: 18,
    },
    favoriteItemName: {
      ...tablet.favoriteItemName,
      fontSize: 15,
    },
    favoriteItemNutrition: {
      ...tablet.favoriteItemNutrition,
      fontSize: 13,
    },
    cancelButtonText: {
      ...tablet.cancelButtonText,
      color: colors.textSecondary,
      fontSize: 14,
    },
    modalButton: {
      ...tablet.modalButton,
      paddingVertical: 12,
    },
  });
};
