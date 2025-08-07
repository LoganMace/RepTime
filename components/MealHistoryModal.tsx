import { loadMeals, type DayMeals } from "@/utils/mealStorage";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

interface MealHistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

interface DayData {
  date: string;
  displayDate: string;
  meals: DayMeals;
  totalCalories: number;
  totalProtein: number;
}

const CATEGORIES = [
  {
    key: "breakfast" as const,
    name: "Breakfast",
    icon: "sunrise.fill",
    color: "#ff6b6b",
  },
  {
    key: "lunch" as const,
    name: "Lunch",
    icon: "sun.max.fill",
    color: "#4ecdc4",
  },
  {
    key: "dinner" as const,
    name: "Dinner",
    icon: "sunset.fill",
    color: "#45b7d1",
  },
  {
    key: "snacks" as const,
    name: "Snacks",
    icon: "sparkles",
    color: "#96ceb4",
  },
];

export default function MealHistoryModal({
  visible,
  onClose,
}: MealHistoryModalProps) {
  const { colors } = useTheme();
  const [historyData, setHistoryData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(false);

  const styles = simpleStyles(colors);

  const loadHistoryData = useCallback(async () => {
    setLoading(true);
    try {
      const mealsData = await loadMeals();
      const sortedDays = Object.entries(mealsData)
        .map(([date, meals]) => {
          const totalCalories = Object.values(meals).reduce(
            (total, categoryMeals) =>
              total +
              categoryMeals.reduce(
                (sum: number, meal: any) => sum + meal.calories,
                0
              ),
            0
          );
          const totalProtein = Object.values(meals).reduce(
            (total, categoryMeals) =>
              total +
              categoryMeals.reduce(
                (sum: number, meal: any) => sum + meal.protein,
                0
              ),
            0
          );

          return {
            date,
            displayDate: formatDisplayDate(date),
            meals,
            totalCalories,
            totalProtein,
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30); // Show last 30 days

      setHistoryData(sortedDays);
    } catch (error) {
      console.error("Error loading history data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadHistoryData();
    }
  }, [visible, loadHistoryData]);

  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today";
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderDayCard = (dayData: DayData) => {
    const hasMeals = Object.values(dayData.meals).some(
      (categoryMeals) => categoryMeals.length > 0
    );

    if (!hasMeals) return null;

    return (
      <View key={dayData.date} style={styles.dayCard}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayDate}>{dayData.displayDate}</Text>
          <View style={styles.dayTotals}>
            <Text style={styles.dayTotal}>
              {dayData.totalCalories} cal • {dayData.totalProtein}g protein
            </Text>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((category) => {
            const categoryMeals = dayData.meals[category.key];
            if (categoryMeals.length === 0) return null;

            return (
              <View key={category.key} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: category.color },
                    ]}
                  >
                    <IconSymbol
                      name={category.icon as any}
                      size={14}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    ({categoryMeals.length})
                  </Text>
                </View>
                <View style={styles.categoryMeals}>
                  {categoryMeals.slice(0, 2).map((meal, index) => (
                    <Text key={index} style={styles.mealText}>
                      {meal.name}
                    </Text>
                  ))}
                  {categoryMeals.length > 2 && (
                    <Text style={styles.moreText}>
                      +{categoryMeals.length - 2} more
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Meal History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading history...</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {historyData.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <IconSymbol name="calendar" size={48} color="#666" />
                    <View style={styles.emptyIconOverlay}>
                      <IconSymbol name="heart.fill" size={16} color="#ff6b6b" />
                    </View>
                  </View>
                  <Text style={styles.emptyTitle}>No Meal History Yet</Text>
                  <Text style={styles.emptyText}>
                    Start tracking your meals to see your daily nutrition
                    history here. Your journey to better health starts with the
                    first meal!
                  </Text>
                  <View style={styles.emptySteps}>
                    <View style={styles.emptyStep}>
                      <View style={styles.emptyStepIcon}>
                        <IconSymbol
                          name="plus.circle.fill"
                          size={20}
                          color="#4ecdc4"
                        />
                      </View>
                      <Text style={styles.emptyStepText}>
                        Add your first meal
                      </Text>
                    </View>
                    <View style={styles.emptyStep}>
                      <View style={styles.emptyStepIcon}>
                        <IconSymbol
                          name="star.fill"
                          size={20}
                          color="#fbbf24"
                        />
                      </View>
                      <Text style={styles.emptyStepText}>
                        Save favorites for quick logging
                      </Text>
                    </View>
                    <View style={styles.emptyStep}>
                      <View style={styles.emptyStepIcon}>
                        <IconSymbol
                          name="chart.line.uptrend.xyaxis"
                          size={20}
                          color="#96ceb4"
                        />
                      </View>
                      <Text style={styles.emptyStepText}>
                        Track your progress over time
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <ScrollView
                  style={styles.historyScroll}
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                  showsVerticalScrollIndicator={false}
                >
                  {historyData.map(renderDayCard)}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const simpleStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "100%",
    maxWidth: 600,
    height: "85%",
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  emptyIconOverlay: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  emptySteps: {
    width: "100%",
    gap: 16,
  },
  emptyStep: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  emptyStepIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.background,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStepText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
    flex: 1,
  },
  historyScroll: {
    flex: 1,
    width: "100%",
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayDate: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  dayTotals: {
    alignItems: "flex-end",
  },
  dayTotal: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  categoriesContainer: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 120,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryMeals: {
    flex: 1,
    gap: 2,
  },
  mealText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  moreText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  bottomPadding: {
    height: 20,
  },
});
