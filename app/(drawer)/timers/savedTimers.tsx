import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect, useRouter } from "expo-router";

import Clock from "@/components/Clock";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function SavedTimersScreen() {
  const { getStyles } = useResponsiveStyles();
  const { colors } = useTheme();
  const router = useRouter();

  const [clockVisible, setClockVisible] = useState(false);
  const [activeTimerData, setActiveTimerData] = useState<{
    rounds: number;
    workTime: number;
    restTime: number;
    sets: number;
    setRestTime: number;
  } | null>(null);
  const [savedTimers, setSavedTimers] = useState<
    {
      name: string;
      rounds: number;
      workTime: number;
      restTime: number;
      sets: number;
      setRestTime: number;
      savedAt: string;
    }[]
  >([]);

  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const loadTimers = async () => {
    try {
      const timers = await AsyncStorage.getItem("timers");
      setSavedTimers(timers ? JSON.parse(timers) : []);
    } catch {
      setSavedTimers([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTimers();
    }, [])
  );

  const handleDelete = async (idx: number) => {
    const timer = savedTimers[idx];
    Alert.alert(
      "Delete Timer",
      `Are you sure you want to delete "${timer.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = savedTimers.filter((_, i) => i !== idx);
            setSavedTimers(updated);
            await AsyncStorage.setItem("timers", JSON.stringify(updated));
          },
        },
      ]
    );
  };

  const handleEdit = (
    timer: {
      name: string;
      rounds: number;
      workTime: number;
      restTime: number;
      sets: number;
      setRestTime: number;
      savedAt: string;
    },
    idx: number
  ) => {
    router.push({
      pathname: "/(drawer)/timers",
      params: { timer: JSON.stringify(timer), editIndex: idx },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {savedTimers.length === 0 ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IconSymbol size={24} color="lime" name="timer" />
              <ThemedText style={styles.cardTitle}>No Saved Timers</ThemedText>
            </View>
            <ThemedText style={styles.emptyText}>
              Create and save your first timer to see it here.
            </ThemedText>
          </View>
        ) : (
          savedTimers.map((timer, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <IconSymbol size={24} color="lime" name="timer" />
                <ThemedText style={styles.cardTitle}>{timer.name}</ThemedText>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(timer, idx)}
                    style={styles.actionButton}
                  >
                    <IconSymbol size={20} color={colors.primary} name="pencil" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(idx)}
                    style={styles.actionButton}
                  >
                    <IconSymbol size={20} color={colors.error} name="trash" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.timerDetails}>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Rounds</ThemedText>
                    <ThemedText style={styles.detailValue}>{timer.rounds}</ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Sets</ThemedText>
                    <ThemedText style={styles.detailValue}>{timer.sets}</ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Work</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {formatTime(timer.workTime)}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Rest</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {formatTime(timer.restTime)}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Set Rest</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {formatTime(timer.setRestTime)}
                    </ThemedText>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setActiveTimerData({
                      rounds: timer.rounds,
                      workTime: timer.workTime,
                      restTime: timer.restTime,
                      sets: timer.sets,
                      setRestTime: timer.setRestTime,
                    });
                    setClockVisible(true);
                  }}
                  style={styles.startButton}
                  activeOpacity={0.8}
                >
                  <IconSymbol size={20} color={colors.textInverse} name="play.fill" />
                  <Text style={styles.startButtonText}>Start Timer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Clock Component */}
      {activeTimerData && (
        <Clock
          visible={clockVisible}
          onClose={() => {
            setClockVisible(false);
            setActiveTimerData(null);
          }}
          rounds={activeTimerData.rounds}
          workTime={activeTimerData.workTime}
          restTime={activeTimerData.restTime}
          sets={activeTimerData.sets}
          setRestTime={activeTimerData.setRestTime}
        />
      )}
    </ThemedView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  timerDetails: {
    gap: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: 100,
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  startButton: {
    backgroundColor: "lime",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  startButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "600",
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    scrollView: {
      ...tablet.scrollView,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    card: {
      ...tablet.card,
      padding: 16,
      marginBottom: 12,
    },
    cardTitle: {
      ...tablet.cardTitle,
      fontSize: 16,
    },
    detailsGrid: {
      ...tablet.detailsGrid,
      gap: 12,
    },
    detailItem: {
      ...tablet.detailItem,
      minWidth: 80,
      padding: 10,
    },
    detailLabel: {
      ...tablet.detailLabel,
      fontSize: 11,
    },
    detailValue: {
      ...tablet.detailValue,
      fontSize: 14,
    },
    startButton: {
      ...tablet.startButton,
      paddingVertical: 14,
    },
    startButtonText: {
      ...tablet.startButtonText,
      fontSize: 14,
    },
  });
};
