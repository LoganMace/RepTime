import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Clock from "@/components/Clock";
import { ThemedText } from "@/components/ThemedText";
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

  const renderTimer = ({
    item,
  }: {
    item: {
      name: string;
      duration: number;
      color: string;
      brightColor: string;
    };
  }) => (
    <TouchableOpacity
      style={[
        styles.timerButton,
        {
          borderColor: item.brightColor,
          borderWidth: 4,
        },
        pressedTimer === item.name && styles.timerButtonPressed,
      ]}
      onPress={() => handleStartTimer(item.duration)}
      onPressIn={() => setPressedTimer(item.name)}
      onPressOut={() => setPressedTimer(null)}
      activeOpacity={0.9}
    >
      <Text style={[styles.timerButtonText, { color: item.brightColor }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <ThemedText style={styles.subtitle}>
        Tap a preset time to start instantly
      </ThemedText>
    </View>
  );

  return (
    <>
      <FlatList
        data={PRESET_TIMERS}
        renderItem={renderTimer}
        keyExtractor={(item) => item.name}
        numColumns={isMobile ? 2 : 3}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.row}
      />

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
    </>
  );
}

const tabletStyles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  subtitle: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#A0A0A0",
    fontWeight: "400",
    lineHeight: 22,
  },
  grid: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  timerButton: {
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 16,
    margin: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 140,
    flex: 1,
    maxWidth: 380,
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
  timerDurationText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  row: {
    justifyContent: "space-evenly",
    paddingHorizontal: 8,
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  headerImage: {
    bottom: -30,
    left: -20,
    position: "absolute",
  },
  container: {
    ...tabletStyles.container,
    padding: 15,
  },
  headerContainer: {
    ...tabletStyles.headerContainer,
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
    minWidth: "45%",
    borderRadius: 14,
  },
  timerButtonText: {
    ...tabletStyles.timerButtonText,
    fontSize: 24,
  },
  timerDurationText: {
    ...tabletStyles.timerDurationText,
    fontSize: 12,
  },
  row: {
    ...tabletStyles.row,
    justifyContent: "center",
  },
});
