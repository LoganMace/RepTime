import { IconSymbol } from "@/components/ui/IconSymbol";
import FormModal, { FormInput } from "@/components/ui/FormModal";
import React from "react";
import { View } from "react-native";
import { CATEGORIES, MealEntry } from "./MealConstants";

interface AddMealModalProps {
  visible: boolean;
  selectedCategory: MealEntry["category"] | null;
  newMeal: {
    name: string;
    calories: string;
    protein: string;
    servings: string;
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
  const categoryInfo = selectedCategory ? CATEGORIES.find(c => c.key === selectedCategory) : null;
  
  const inputs: FormInput[] = [
    {
      key: "name",
      placeholder: "Food name",
      value: newMeal.name,
      onChangeText: (text) => onMealChange("name", text),
    },
    {
      key: "servings",
      placeholder: "Servings",
      value: newMeal.servings,
      onChangeText: (text) => {
        // Only allow positive numbers with up to 2 decimal places
        const numericValue = text.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) return; // Prevent multiple decimal points
        if (parts[1] && parts[1].length > 2) return; // Limit to 2 decimal places
        if (parseFloat(numericValue) > 99) return; // Max 99 servings
        onMealChange("servings", numericValue);
      },
      keyboardType: "decimal-pad",
    },
    {
      key: "calories", 
      placeholder: "Calories (per serving)",
      value: newMeal.calories,
      onChangeText: (text) => {
        // Only allow positive integers, max 9999 calories
        const numericValue = text.replace(/[^0-9]/g, '');
        if (parseInt(numericValue) > 9999) return;
        onMealChange("calories", numericValue);
      },
      keyboardType: "numeric",
    },
    {
      key: "protein",
      placeholder: "Protein (g per serving)", 
      value: newMeal.protein,
      onChangeText: (text) => {
        // Only allow positive numbers with up to 1 decimal place, max 999g
        const numericValue = text.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) return; // Prevent multiple decimal points
        if (parts[1] && parts[1].length > 1) return; // Limit to 1 decimal place
        if (parseFloat(numericValue) > 999) return; // Max 999g protein
        onMealChange("protein", numericValue);
      },
      keyboardType: "decimal-pad",
    },
  ];

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title={`Add ${categoryInfo?.name || "Food"}`}
      inputs={inputs}
      primaryButton={{
        text: "Add Food",
        onPress: onAddMeal,
      }}
      secondaryButton={{
        text: "Cancel",
        onPress: onClose,
      }}
    >
      {categoryInfo && (
        <View style={{ alignItems: "center", marginTop: -8, marginBottom: 8 }}>
          <IconSymbol
            name={categoryInfo.icon as any}
            size={24}
            color={categoryInfo.color}
          />
        </View>
      )}
    </FormModal>
  );
}