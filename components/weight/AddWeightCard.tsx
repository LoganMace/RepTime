import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useResponsiveStyles } from "../../hooks/useResponsiveStyles";
import { ThemedText } from "../ThemedText";

interface AddWeightCardProps {
  newWeight: string;
  onWeightChange: (weight: string) => void;
  onAddWeight: () => void;
}

export default function AddWeightCard({
  newWeight,
  onWeightChange,
  onAddWeight,
}: AddWeightCardProps) {
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  return (
    <View style={styles.addWeightCard}>
      <ThemedText style={styles.cardTitle}>Quick Add Weight</ThemedText>
      <View style={styles.addWeightForm}>
        <TextInput
          style={styles.weightInput}
          placeholder="Enter weight (lbs)"
          placeholderTextColor="#9CA3AF"
          value={newWeight}
          onChangeText={onWeightChange}
          keyboardType="decimal-pad"
        />
        <TouchableOpacity style={styles.addButton} onPress={onAddWeight}>
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const tabletStyles = StyleSheet.create({
  addWeightCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  addWeightForm: {
    flexDirection: "row",
    gap: 12,
  },
  weightInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  addButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  addWeightForm: {
    ...tabletStyles.addWeightForm,
    flexDirection: "column",
    gap: 12,
  },
  addButton: {
    ...tabletStyles.addButton,
    alignSelf: "stretch",
  },
});
