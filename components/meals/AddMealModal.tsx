import { IconSymbol } from "@/components/ui/IconSymbol";
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
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

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
                color="#fff"
              />
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Food name"
            value={newMeal.name}
            onChangeText={(text) => onMealChange("name", text)}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Calories"
            value={newMeal.calories}
            onChangeText={(text) => onMealChange("calories", text)}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Protein (g)"
            value={newMeal.protein}
            onChangeText={(text) => onMealChange("protein", text)}
            keyboardType="numeric"
            placeholderTextColor="#999"
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

const tabletStyles = StyleSheet.create({
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
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  modalContent: {
    ...tabletStyles.modalContent,
    width: "95%",
    margin: 16,
  },
  modalTitle: {
    ...tabletStyles.modalTitle,
    fontSize: 18,
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
});
