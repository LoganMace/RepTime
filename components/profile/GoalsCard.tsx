import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { Goals, formatWeight, kgToLbs, lbsToKg } from "@/utils/profileStorage";

interface GoalsCardProps {
  goals: Goals;
  units: "metric" | "imperial";
  currentWeight: number;
  onUpdate: (goals: Goals) => void;
}

export const GoalsCard: React.FC<GoalsCardProps> = ({ 
  goals, 
  units, 
  currentWeight,
  onUpdate 
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [editing, setEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field: keyof Goals) => {
    setEditing(field);
    // If editing weight goal and using imperial, convert kg to lbs for display
    if (field === "weightGoal" && units === "imperial") {
      setTempValue(kgToLbs(goals[field]).toString());
    } else {
      setTempValue(goals[field].toString());
    }
  };

  const handleSave = () => {
    if (editing) {
      let value = parseFloat(tempValue) || 0;
      
      // If saving weight goal and using imperial, convert lbs to kg for storage
      if (editing === "weightGoal" && units === "imperial") {
        value = lbsToKg(value);
      }
      
      onUpdate({
        ...goals,
        [editing]: value,
      });
      setEditing(null);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setTempValue("");
  };

  // Calculate weight progress in the correct units
  const calculateWeightProgress = () => {
    if (currentWeight <= 0 || goals.weightGoal <= 0) return 0;
    
    const differenceKg = Math.abs(currentWeight - goals.weightGoal);
    
    // Convert to appropriate units for display
    if (units === "imperial") {
      return kgToLbs(differenceKg);
    }
    return differenceKg;
  };
  
  const weightProgress = calculateWeightProgress();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <IconSymbol name="target" size={24} color={colors.primary} />
          <ThemedText style={styles.cardTitle}>Goals</ThemedText>
        </View>
      </View>

      <View style={styles.goalsList}>
        {/* Weight Goal */}
        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <ThemedText style={styles.goalLabel}>Weight Goal</ThemedText>
            <TouchableOpacity onPress={() => handleEdit("weightGoal")}>
              <IconSymbol name="pencil" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {editing === "weightGoal" ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={tempValue}
                onChangeText={(text) => {
                  // Only allow positive numbers with up to 1 decimal place
                  const numericValue = text.replace(/[^0-9.]/g, '');
                  const parts = numericValue.split('.');
                  if (parts.length > 2) return; // Prevent multiple decimal points
                  if (parts[1] && parts[1].length > 1) return; // Limit to 1 decimal place
                  // Set reasonable weight limits: 50-1000 lbs or 25-500 kg
                  const maxWeight = units === "imperial" ? 1000 : 500;
                  if (parseFloat(numericValue) > maxWeight) return;
                  setTempValue(numericValue);
                }}
                keyboardType="decimal-pad"
                autoFocus
                placeholder={`Enter weight in ${units === "imperial" ? "lbs" : "kg"}`}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <IconSymbol name="checkmark" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <IconSymbol name="xmark" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <ThemedText style={styles.goalValue}>
                {formatWeight(goals.weightGoal, units)}
              </ThemedText>
              {currentWeight > 0 && (
                <ThemedText style={styles.goalProgress}>
                  {weightProgress.toFixed(1)} {units === "imperial" ? "lbs" : "kg"} to go
                </ThemedText>
              )}
            </View>
          )}
        </View>

        {/* Calorie Goal */}
        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <ThemedText style={styles.goalLabel}>Daily Calories</ThemedText>
            <TouchableOpacity onPress={() => handleEdit("calorieGoal")}>
              <IconSymbol name="pencil" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {editing === "calorieGoal" ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={tempValue}
                onChangeText={(text) => {
                  // Only allow positive integers, max 9999 calories
                  const numericValue = text.replace(/[^0-9]/g, '');
                  if (parseInt(numericValue) > 9999) return;
                  setTempValue(numericValue);
                }}
                keyboardType="numeric"
                autoFocus
                placeholder="Enter calories"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <IconSymbol name="checkmark" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <IconSymbol name="xmark" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          ) : (
            <ThemedText style={styles.goalValue}>
              {goals.calorieGoal} cal
            </ThemedText>
          )}
        </View>

        {/* Protein Goal */}
        <View style={styles.goalItem}>
          <View style={styles.goalHeader}>
            <ThemedText style={styles.goalLabel}>Daily Protein</ThemedText>
            <TouchableOpacity onPress={() => handleEdit("proteinGoal")}>
              <IconSymbol name="pencil" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {editing === "proteinGoal" ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.input}
                value={tempValue}
                onChangeText={(text) => {
                  // Only allow positive integers, max 999 grams protein
                  const numericValue = text.replace(/[^0-9]/g, '');
                  if (parseInt(numericValue) > 999) return;
                  setTempValue(numericValue);
                }}
                keyboardType="numeric"
                autoFocus
                placeholder="Enter grams"
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <IconSymbol name="checkmark" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <IconSymbol name="xmark" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          ) : (
            <ThemedText style={styles.goalValue}>
              {goals.proteinGoal}g
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    goalsList: {
      gap: 16,
    },
    goalItem: {
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    goalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    goalLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    goalValue: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.primary,
    },
    goalProgress: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    editRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      color: colors.inputText,
    },
    saveButton: {
      backgroundColor: "gold",
      borderRadius: 8,
      padding: 8,
    },
    cancelButton: {
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 8,
    },
  });