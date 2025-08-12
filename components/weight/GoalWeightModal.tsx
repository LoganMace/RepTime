import React from "react";
import FormModal, { FormInput } from "../ui/FormModal";

interface GoalWeightModalProps {
  visible: boolean;
  goalWeight: number;
  newGoalWeight: string;
  units: "metric" | "imperial";
  onClose: () => void;
  onSave: () => void;
  onGoalWeightChange: (weight: string) => void;
}

export default function GoalWeightModal({
  visible,
  goalWeight,
  newGoalWeight,
  units,
  onClose,
  onSave,
  onGoalWeightChange,
}: GoalWeightModalProps) {
  const inputs: FormInput[] = [
    {
      key: "goalWeight",
      placeholder: `Goal weight (${units === "imperial" ? "lbs" : "kg"})`,
      value: newGoalWeight,
      onChangeText: onGoalWeightChange,
      keyboardType: "decimal-pad",
      textAlign: "center",
    },
  ];

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title="Set Goal Weight"
      subtitle="Enter your target weight to track your progress"
      inputs={inputs}
      primaryButton={{
        text: "Save Goal",
        onPress: onSave,
      }}
      secondaryButton={{
        text: "Cancel",
        onPress: onClose,
      }}
      size="small"
    />
  );
}