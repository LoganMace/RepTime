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
  { name: "15s", duration: 15, color: "#ef4444" }, // Red
  { name: "20s", duration: 20, color: "#f97316" }, // Orange
  { name: "30s", duration: 30, color: "#6366f1" }, // Indigo
  { name: "45s", duration: 45, color: "#ec4899" }, // Pink
  { name: "1m", duration: 60, color: "#06b6d4" }, // Cyan
  { name: "90s", duration: 90, color: "#10b981" }, // Emerald
  { name: "2m", duration: 120, color: "#f59e0b" }, // Amber
  { name: "3m", duration: 180, color: "#84cc16" }, // Lime
  { name: "4m", duration: 240, color: "#8b5cf6" }, // Violet
  { name: "5m", duration: 300, color: "#a855f7" }, // Purple
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
    item: { name: string; duration: number; color: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.timerButton,
        { backgroundColor: item.color },
        pressedTimer === item.name && styles.timerButtonPressed,
      ]}
      onPress={() => handleStartTimer(item.duration)}
      onPressIn={() => setPressedTimer(item.name)}
      onPressOut={() => setPressedTimer(null)}
      activeOpacity={0.9}
    >
      <Text style={styles.timerButtonText}>{item.name}</Text>
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
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
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
    paddingHorizontal: 16,
    alignItems: "center",
  },
  timerButton: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 110,
    minWidth: 260,
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
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  timerDurationText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  row: {
    justifyContent: "center",
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
  title: {
    ...tabletStyles.title,
    fontSize: 28,
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
