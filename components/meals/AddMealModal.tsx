import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CATEGORIES, MealEntry } from "./MealConstants";

interface AddMealModalProps {
  visible: boolean;
  selectedCategory: MealEntry["category"] | null;
  newMeal: {
    name: string;
    calories: string;
    protein: string;
  };
  onClose: () => void;
  onAddMeal: () => void;
  onMealChange: (field: string, value: string) => void;
}

export default function AddMealModal({
  visible,
  selectedCategory,
  newMeal,
  onClose,
  onAddMeal,
  onMealChange,
}: AddMealModalProps) {
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
                color={colors.text}
              />
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Food name"
            value={newMeal.name}
            onChangeText={(text) => onMealChange("name", text)}
            placeholderTextColor={colors.placeholder}
          />

          <TextInput
            style={styles.input}
            placeholder="Calories"
            value={newMeal.calories}
            onChangeText={(text) => onMealChange("calories", text)}
            keyboardType="numeric"
            placeholderTextColor={colors.placeholder}
          />

          <TextInput
            style={styles.input}
            placeholder="Protein (g)"
            value={newMeal.protein}
            onChangeText={(text) => onMealChange("protein", text)}
            keyboardType="numeric"
            placeholderTextColor={colors.placeholder}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={onAddMeal}
            >
              <Text style={styles.addButtonText}>Add Food</Text>
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
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: colors.inputText,
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
    backgroundColor: colors.inputBackground,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  addButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
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
    cancelButtonText: {
      ...tablet.cancelButtonText,
      color: colors.textSecondary,
      fontSize: 14,
    },
    input: {
      ...tablet.input,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
    modalButton: {
      ...tablet.modalButton,
      paddingVertical: 12,
    },
  });
};
