import { ThemedText } from "@/components/ThemedText";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
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
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

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
                  ? "#ef4444"
                  : isOverGoal && category === "protein"
                  ? "#f59e0b"
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
            "#6366f1",
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
            "#10b981",
            "protein"
          )}
        </View>
      </View>
    </View>
  );
}

const tabletStyles = StyleSheet.create({
  summarySection: {
    backgroundColor: "#1a1a1a",
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
    color: "#fff",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#A0A0A0",
    marginBottom: 4,
  },
  summaryGoal: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  summarySection: {
    ...tabletStyles.summarySection,
    padding: 16,
  },
  summaryRow: {
    ...tabletStyles.summaryRow,
    gap: 16,
  },
  summaryValue: {
    ...tabletStyles.summaryValue,
    fontSize: 24,
  },
});
