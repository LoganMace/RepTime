import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useMemo } from "react";
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

  const styles = useMemo(() => {
    return getStyles(mobileStyles(colors), tabletStyles(colors));
  }, [getStyles, colors]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Calculate total duration for a saved timer
  const calculateTimerDuration = (timer: any, includeRest: boolean = true) => {
    const workTimePerRound = timer.workTime;
    const restTimePerRound = includeRest ? timer.restTime : 0;
    const timePerRound = workTimePerRound + restTimePerRound;
    
    // Total time for all rounds in all sets
    const totalRoundTime = timePerRound * timer.rounds * timer.sets;
    
    // Add set rest time (applied between sets, so sets - 1)
    const totalSetRestTime = includeRest ? timer.setRestTime * (timer.sets - 1) : 0;
    
    return totalRoundTime + totalSetRestTime;
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

                {/* Duration Summary */}
                <View style={styles.durationSummary}>
                  <View style={styles.durationRow}>
                    <View style={styles.durationHeader}>
                      <IconSymbol size={14} color="lime" name="clock" />
                      <ThemedText style={styles.durationTitle}>Duration:</ThemedText>
                    </View>
                    <View style={styles.durationValues}>
                      <ThemedText style={styles.durationLabel}>Work: </ThemedText>
                      <ThemedText style={styles.durationValue}>
                        {formatDuration(calculateTimerDuration(timer, false))}
                      </ThemedText>
                      <ThemedText style={styles.durationSeparator}> • </ThemedText>
                      <ThemedText style={styles.durationLabel}>Total: </ThemedText>
                      <ThemedText style={styles.durationValue}>
                        {formatDuration(calculateTimerDuration(timer, true))}
                      </ThemedText>
                    </View>
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
  durationSummary: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  durationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  durationTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationValues: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  durationValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  durationSeparator: {
    fontSize: 12,
    color: colors.textSecondary,
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
    durationSummary: {
      ...tablet.durationSummary,
      paddingTop: 10,
    },
    durationTitle: {
      ...tablet.durationTitle,
      fontSize: 11,
    },
    durationLabel: {
      ...tablet.durationLabel,
      fontSize: 11,
    },
    durationValue: {
      ...tablet.durationValue,
      fontSize: 11,
    },
    durationSeparator: {
      ...tablet.durationSeparator,
      fontSize: 11,
    },
  });
};
