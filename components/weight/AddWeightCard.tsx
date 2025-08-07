import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
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
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  return (
    <View style={styles.addWeightCard}>
      <ThemedText style={styles.cardTitle}>Quick Add Weight</ThemedText>
      <View style={styles.addWeightForm}>
        <TextInput
          style={styles.weightInput}
          placeholder="Enter weight (lbs)"
          placeholderTextColor={colors.placeholder}
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

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  addWeightCard: {
    backgroundColor: colors.card,
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
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: colors.inputText,
  },
  addButton: {
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "center",
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
    addWeightForm: {
      ...tablet.addWeightForm,
      flexDirection: "column",
      gap: 12,
    },
    addButton: {
      ...tablet.addButton,
      alignSelf: "stretch",
      alignItems: "center",
    },
    weightInput: {
      ...tablet.weightInput,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
  });
};
