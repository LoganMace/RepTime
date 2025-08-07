import { ThemedText } from "@/components/ThemedText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, Text, View } from "react-native";
import { DailyGoals } from "./MealConstants";

interface DailySummaryProps {
  dailyTotals: {
    calories: number;
    protein: number;
  };
  dailyGoals: DailyGoals;
}

export default function DailySummary({
  dailyTotals,
  dailyGoals,
}: DailySummaryProps) {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  const renderProgressBar = (
    current: number,
    goal: number,
    color: string,
    category: string
  ) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const isOverGoal = current > goal;

    return (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor:
                isOverGoal && category === "calories"
                  ? colors.error
                  : isOverGoal && category === "protein"
                  ? colors.info
                  : color,
              width: `${Math.min(percentage, 100)}%`,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.summarySection}>
      <ThemedText style={styles.summaryTitle}>Daily Summary</ThemedText>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{dailyTotals.calories}</Text>
          <Text style={styles.summaryLabel}>Calories</Text>
          <Text style={styles.summaryGoal}>Goal: {dailyGoals.calories}</Text>
          {renderProgressBar(
            dailyTotals.calories,
            dailyGoals.calories,
            colors.primary,
            "calories"
          )}
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{dailyTotals.protein}g</Text>
          <Text style={styles.summaryLabel}>Protein</Text>
          <Text style={styles.summaryGoal}>Goal: {dailyGoals.protein}g</Text>
          {renderProgressBar(
            dailyTotals.protein,
            dailyGoals.protein,
            colors.success,
            "protein"
          )}
        </View>
      </View>
    </View>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    summarySection: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    summaryTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 16,
      textAlign: "center",
    },
    summaryRow: {
      flexDirection: "row",
      gap: 20,
    },
    summaryItem: {
      flex: 1,
      alignItems: "center",
    },
    summaryValue: {
      fontSize: 28,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    summaryGoal: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    progressBarContainer: {
      width: "100%",
      height: 8,
      backgroundColor: colors.borderLight,
      borderRadius: 4,
      overflow: "hidden",
      position: "relative",
    },
    progressBar: {
      height: "100%",
      borderRadius: 4,
    },
  });

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    summarySection: {
      ...tablet.summarySection,
      padding: 16,
    },
    summaryRow: {
      ...tablet.summaryRow,
      gap: 16,
    },
    summaryValue: {
      ...tablet.summaryValue,
      fontSize: 24,
    },
  });
};
