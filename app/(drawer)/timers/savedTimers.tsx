import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import Clock from "@/components/Clock";
import { ThemedText } from "@/components/ThemedText";

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
    const updated = savedTimers.filter((_, i) => i !== idx);
    setSavedTimers(updated);
    await AsyncStorage.setItem("timers", JSON.stringify(updated));
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.centeredContainer}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.timerCardsContainer}>
              {savedTimers.length === 0 ? (
                <ThemedText>No saved timers yet.</ThemedText>
              ) : (
                savedTimers.map((timer, idx) => (
                  <View key={idx} style={styles.timerCard}>
                    <View style={styles.timerCardActions}>
                      <TouchableOpacity
                        onPress={() => handleEdit(timer, idx)}
                        style={styles.iconButton}
                      >
                        <Feather name="edit-2" size={26} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(idx)}
                        style={styles.iconButton}
                      >
                        <Feather name="trash-2" size={26} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.timerCardTitle}>{timer.name}</Text>
                    <Text style={styles.timerCardText}>
                      Rounds: {timer.rounds}
                    </Text>
                    <Text style={styles.timerCardText}>
                      Work: {timer.workTime}s
                    </Text>
                    <Text style={styles.timerCardText}>
                      Rest: {timer.restTime}s
                    </Text>
                    <Text style={styles.timerCardText}>Sets: {timer.sets}</Text>
                    <Text style={styles.timerCardText}>
                      Set Rest: {timer.setRestTime}s
                    </Text>
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
                      style={styles.playButton}
                    >
                      <Feather name="play-circle" size={60} color={colors.success} />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
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
      </View>
    </ScrollView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerImage: {
    color: colors.textSecondary,
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },
  timerCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  timerCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: 320,
    minHeight: 120,
    position: "relative",
    marginHorizontal: 8,
  },
  timerCardActions: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 16,
    minHeight: 44,
    minWidth: 100,
    zIndex: 10,
  },
  timerCardTitle: {
    color: colors.success,
    fontSize: 24,
    fontWeight: "bold",
  },
  timerCardText: {
    color: colors.text,
    fontSize: 18,
  },
  iconButton: {
    width: 44,
    height: 44,
    padding: 0,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mobileStyles = (colors: ReturnType<typeof useTheme>['colors']) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    headerImage: {
      bottom: -30,
      left: -20,
      position: "absolute",
    },
    centeredContainer: {
      ...tablet.centeredContainer,
      alignItems: "stretch",
    },
    timerCardsContainer: {
      ...tablet.timerCardsContainer,
      flexDirection: "column",
      alignItems: "center",
    },
    timerCard: {
      ...tablet.timerCard,
      width: "100%",
      marginHorizontal: 0,
    },
  });
};
