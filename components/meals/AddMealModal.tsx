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
      key: "calories", 
      placeholder: "Calories",
      value: newMeal.calories,
      onChangeText: (text) => onMealChange("calories", text),
      keyboardType: "numeric",
    },
    {
      key: "protein",
      placeholder: "Protein (g)", 
      value: newMeal.protein,
      onChangeText: (text) => onMealChange("protein", text),
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