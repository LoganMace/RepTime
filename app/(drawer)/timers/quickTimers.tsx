import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Clock from "@/components/Clock";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";

const PRESET_TIMERS = [
  { name: "15s", duration: 15, color: "#dc2626", brightColor: "#ef4444" }, // Red - Fastest/Hottest
  { name: "20s", duration: 20, color: "#ea580c", brightColor: "#f97316" }, // Red-Orange
  { name: "30s", duration: 30, color: "#d97706", brightColor: "#f59e0b" }, // Orange
  { name: "45s", duration: 45, color: "#ca8a04", brightColor: "#eab308" }, // Yellow-Orange
  { name: "1m", duration: 60, color: "#65a30d", brightColor: "#84cc16" }, // Yellow-Green
  { name: "90s", duration: 90, color: "#16a34a", brightColor: "#22c55e" }, // Green
  { name: "2m", duration: 120, color: "#10b981", brightColor: "#10b981" }, // Green-Teal
  { name: "3m", duration: 180, color: "#06b6d4", brightColor: "#06b6d4" }, // Cyan/Teal
  { name: "4m", duration: 240, color: "#3b82f6", brightColor: "#3b82f6" }, // Blue
  { name: "5m", duration: 300, color: "#6366f1", brightColor: "#6366f1" }, // Blue-Purple - Coolest/Slowest
];

export default function QuickTimersScreen() {
  const { getStyles, isMobile } = useResponsiveStyles();
  const styles = getStyles(mobileStyles, tabletStyles);

  const [clockVisible, setClockVisible] = useState(false);
  const [activeTimerData, setActiveTimerData] = useState<{
    workTime: number;
  } | null>(null);
  const [pressedTimer, setPressedTimer] = useState<string | null>(null);

  const handleStartTimer = (duration: number) => {
    setActiveTimerData({ workTime: duration });
    setClockVisible(true);
  };

  const renderTimerButton = (timer: {
    name: string;
    duration: number;
    color: string;
    brightColor: string;
  }) => (
    <TouchableOpacity
      key={timer.name}
      style={[
        styles.timerButton,
        {
          borderColor: timer.brightColor,
          borderWidth: 4,
        },
        pressedTimer === timer.name && styles.timerButtonPressed,
      ]}
      onPress={() => handleStartTimer(timer.duration)}
      onPressIn={() => setPressedTimer(timer.name)}
      onPressOut={() => setPressedTimer(null)}
      activeOpacity={0.9}
    >
      <Text style={[styles.timerButtonText, { color: timer.brightColor }]}>
        {timer.name}
      </Text>
    </TouchableOpacity>
  );

  // Create rows for the grid
  const createRows = () => {
    const rows = [];
    const itemsPerRow = isMobile ? 2 : 3; // 3 per row on tablet for better spacing

    for (let i = 0; i < PRESET_TIMERS.length; i += itemsPerRow) {
      const rowItems = PRESET_TIMERS.slice(i, i + itemsPerRow);
      rows.push(
        <View key={i} style={styles.row}>
          {rowItems.map(renderTimerButton)}
        </View>
      );
    }
    return rows;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.subtitle}>
          Tap a preset time to start instantly
        </ThemedText>
      </View>

      <View style={styles.grid}>{createRows()}</View>

      {activeTimerData && (
        <Clock
          visible={clockVisible}
          onClose={() => {
            setClockVisible(false);
            setActiveTimerData(null);
          }}
          rounds={1}
          workTime={activeTimerData.workTime}
          restTime={0}
          sets={1}
          setRestTime={0}
          skipGetReady={true}
          quickTimer={true}
        />
      )}
    </ThemedView>
  );
}

const tabletStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#A0A0A0",
    fontWeight: "400",
    lineHeight: 22,
  },
  grid: {
    width: "100%",
    maxWidth: 800,
    justifyContent: "center",
    alignItems: "center",
  },
  timerButton: {
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 16,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 140,
    width: "30%",
    backgroundColor: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  timerButtonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  timerButtonText: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 4,
    letterSpacing: -0.3,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 16,
    width: "100%",
    gap: 16,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  container: {
    ...tabletStyles.container,
    padding: 15,
  },
  headerContainer: {
    ...tabletStyles.headerContainer,
    marginBottom: 30,
  },
  subtitle: {
    ...tabletStyles.subtitle,
    fontSize: 14,
  },
  grid: {
    ...tabletStyles.grid,
    paddingHorizontal: 12,
  },
  timerButton: {
    ...tabletStyles.timerButton,
    paddingVertical: 20,
    margin: 6,
    minHeight: 95,
    width: "45%",
    borderRadius: 14,
  },
  timerButtonText: {
    ...tabletStyles.timerButtonText,
    fontSize: 24,
  },
  row: {
    ...tabletStyles.row,
    justifyContent: "space-around",
    marginBottom: 12,
    gap: 12,
  },
});
