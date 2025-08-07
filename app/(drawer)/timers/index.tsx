import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";

import Clock from "@/components/Clock";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TimePicker from "@/components/TimePicker";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";

// Utility function to convert minutes and seconds to total seconds
function toTotalSeconds(minutes: string, seconds: string) {
  return parseInt(minutes) * 60 + parseInt(seconds);
}

export default function TimersScreen() {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [timerName, setTimerName] = useState("");
  const [selectedRounds, setSelectedRounds] = useState(1);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [selectedSets, setSelectedSets] = useState(1);
  const [setRestTimeSeconds, setSetRestTimeSeconds] = useState(0);
  const [clockVisible, setClockVisible] = useState(false);
  const [activeTimerData, setActiveTimerData] = useState<{
    rounds: number;
    workTime: number;
    restTime: number;
    sets: number;
    setRestTime: number;
  } | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Modal state
  const [pickerModalVisible, setPickerModalVisible] = useState<
    null | "rounds" | "work" | "rest" | "sets" | "setRest"
  >(null);
  // Temp values for pickers
  const [tempRounds, setTempRounds] = useState(selectedRounds);
  const [tempSets, setTempSets] = useState(selectedSets);
  const [tempWork, setTempWork] = useState(workSeconds);
  const [tempRest, setTempRest] = useState(restSeconds);
  const [tempSetRest, setTempSetRest] = useState(setRestTimeSeconds);

  const isSaveDisabled =
    !timerName.trim() || (workSeconds === 0 && restSeconds === 0);
  const isStartDisabled = workSeconds === 0 && restSeconds === 0;

  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  useEffect(() => {
    if (params.timer) {
      const timerToEdit = JSON.parse(params.timer as string);
      const editIndex = parseInt(params.editIndex as string);
      setTimerName(timerToEdit.name);
      setSelectedRounds(timerToEdit.rounds);
      setWorkSeconds(timerToEdit.workTime);
      setRestSeconds(timerToEdit.restTime);
      setSelectedSets(timerToEdit.sets);
      setSetRestTimeSeconds(timerToEdit.setRestTime);
      setEditIndex(editIndex);
    }
  }, [params]);

  const generateRounds = () => {
    const rounds = [];
    for (let i = 1; i <= 100; i++) {
      rounds.push(i);
    }
    return rounds;
  };
  const roundOptions = generateRounds();
  const setOptions = generateRounds();

  const openPickerModal = (picker: typeof pickerModalVisible) => {
    setPickerModalVisible(picker);
    if (picker === "rounds") setTempRounds(selectedRounds);
    if (picker === "sets") setTempSets(selectedSets);
    if (picker === "work") setTempWork(workSeconds);
    if (picker === "rest") setTempRest(restSeconds);
    if (picker === "setRest") setTempSetRest(setRestTimeSeconds);
  };
  const closePickerModal = () => setPickerModalVisible(null);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setActiveTimerData({
      rounds: selectedRounds,
      workTime: workSeconds,
      restTime: restSeconds,
      sets: selectedSets,
      setRestTime: setRestTimeSeconds,
    });
    setClockVisible(true);
  };

  const saveTimer = async () => {
    if (!timerName.trim()) {
      alert("Please enter a timer name.");
      return;
    }
    const timer = {
      name: timerName,
      rounds: selectedRounds,
      workTime: workSeconds,
      restTime: restSeconds,
      sets: selectedSets,
      setRestTime: setRestTimeSeconds,
      savedAt: new Date().toISOString(),
    };
    const savedTimers = await AsyncStorage.getItem("timers");
    let timers = savedTimers ? JSON.parse(savedTimers) : [];
    if (editIndex !== null) {
      timers[editIndex] = timer;
    } else {
      timers.push(timer);
    }
    await AsyncStorage.setItem("timers", JSON.stringify(timers));
    alert("Timer saved!");
    resetForm();
    router.push("/(drawer)/timers/savedTimers");
  };

  const cancelEdit = () => {
    resetForm();
    router.back();
  };

  const resetForm = () => {
    setTimerName("");
    setSelectedRounds(1);
    setWorkSeconds(0);
    setRestSeconds(0);
    setSelectedSets(1);
    setSetRestTimeSeconds(0);
    setEditIndex(null);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Timer Name Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol size={24} color="lime" name="textformat" />
            <ThemedText style={styles.cardTitle}>Timer Name</ThemedText>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g., HIIT Workout"
            placeholderTextColor={colors.placeholder}
            value={timerName}
            onChangeText={setTimerName}
          />
        </View>

        {/* Timer Settings Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol size={24} color="lime" name="gear" />
            <ThemedText style={styles.cardTitle}>Timer Settings</ThemedText>
          </View>

          <View style={styles.settingsGrid}>
            {/* Rounds */}
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Rounds</ThemedText>
              <TouchableOpacity
                onPress={() => openPickerModal("rounds")}
                style={styles.settingValue}
              >
                <ThemedText style={styles.settingValueText}>
                  {selectedRounds}
                </ThemedText>
                <IconSymbol
                  size={16}
                  color={colors.textSecondary}
                  name="chevron.down"
                />
              </TouchableOpacity>
            </View>

            {/* Work Time */}
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Work Time</ThemedText>
              <TouchableOpacity
                onPress={() => openPickerModal("work")}
                style={styles.settingValue}
              >
                <ThemedText style={styles.settingValueText}>
                  {formatTime(workSeconds)}
                </ThemedText>
                <IconSymbol
                  size={16}
                  color={colors.textSecondary}
                  name="chevron.down"
                />
              </TouchableOpacity>
            </View>

            {/* Rest Time */}
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Rest Time</ThemedText>
              <TouchableOpacity
                onPress={() => openPickerModal("rest")}
                style={styles.settingValue}
              >
                <ThemedText style={styles.settingValueText}>
                  {formatTime(restSeconds)}
                </ThemedText>
                <IconSymbol
                  size={16}
                  color={colors.textSecondary}
                  name="chevron.down"
                />
              </TouchableOpacity>
            </View>

            {/* Sets */}
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Sets</ThemedText>
              <TouchableOpacity
                onPress={() => openPickerModal("sets")}
                style={styles.settingValue}
              >
                <ThemedText style={styles.settingValueText}>
                  {selectedSets}
                </ThemedText>
                <IconSymbol
                  size={16}
                  color={colors.textSecondary}
                  name="chevron.down"
                />
              </TouchableOpacity>
            </View>

            {/* Set Rest */}
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Set Rest</ThemedText>
              <TouchableOpacity
                onPress={() => openPickerModal("setRest")}
                style={styles.settingValue}
              >
                <ThemedText style={styles.settingValueText}>
                  {formatTime(setRestTimeSeconds)}
                </ThemedText>
                <IconSymbol
                  size={16}
                  color={colors.textSecondary}
                  name="chevron.down"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons Card */}
        <View style={styles.card}>
          <TouchableOpacity
            onPress={handleStart}
            style={[
              styles.startButton,
              isStartDisabled && styles.disabledButton,
            ]}
            activeOpacity={0.8}
            disabled={isStartDisabled}
          >
            <IconSymbol
              size={20}
              color={
                isStartDisabled ? colors.textSecondary : colors.textInverse
              }
              name="play.fill"
            />
            <Text
              style={[
                styles.startButtonText,
                isStartDisabled && styles.disabledButtonText,
              ]}
            >
              Start Timer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={saveTimer}
            style={[styles.saveButton, isSaveDisabled && styles.disabledButton]}
            activeOpacity={0.85}
            disabled={isSaveDisabled}
          >
            <IconSymbol
              size={20}
              color={isSaveDisabled ? colors.textSecondary : colors.primary}
              name="square.and.arrow.down"
            />
            <Text
              style={[
                styles.saveButtonText,
                isSaveDisabled && styles.disabledButtonText,
              ]}
            >
              {editIndex !== null ? "Update Timer" : "Save Timer"}
            </Text>
          </TouchableOpacity>

          {editIndex !== null && (
            <TouchableOpacity
              onPress={cancelEdit}
              style={styles.cancelButton}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
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

      {/* Picker Modal */}
      <Modal
        visible={pickerModalVisible !== null}
        transparent
        animationType="slide"
        onRequestClose={closePickerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {pickerModalVisible === "rounds" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Picker
                  selectedValue={tempRounds.toString()}
                  onValueChange={(itemValue: string) =>
                    setTempRounds(parseInt(itemValue))
                  }
                  style={styles.picker}
                  itemStyle={{ color: "white" }}
                >
                  {roundOptions.map((round) => (
                    <Picker.Item
                      key={round}
                      label={round === 1 ? "1 round" : `${round} rounds`}
                      value={round.toString()}
                    />
                  ))}
                </Picker>
              </View>
            )}
            {pickerModalVisible === "sets" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Picker
                  selectedValue={tempSets.toString()}
                  onValueChange={(itemValue: string) =>
                    setTempSets(parseInt(itemValue))
                  }
                  style={styles.picker}
                  itemStyle={{ color: "white" }}
                >
                  {setOptions.map((set) => (
                    <Picker.Item
                      key={set}
                      label={set === 1 ? "1 set" : `${set} sets`}
                      value={set.toString()}
                    />
                  ))}
                </Picker>
              </View>
            )}
            {pickerModalVisible === "work" && (
              <TimePicker
                onValueChange={(minutes, seconds) => {
                  setTempWork(toTotalSeconds(minutes, seconds));
                }}
                initialSeconds={tempWork.toString()}
              />
            )}
            {pickerModalVisible === "rest" && (
              <TimePicker
                onValueChange={(minutes, seconds) => {
                  setTempRest(toTotalSeconds(minutes, seconds));
                }}
                initialSeconds={tempRest.toString()}
              />
            )}
            {pickerModalVisible === "setRest" && (
              <TimePicker
                onValueChange={(minutes, seconds) => {
                  setTempSetRest(toTotalSeconds(minutes, seconds));
                }}
                initialSeconds={tempSetRest.toString()}
              />
            )}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if (pickerModalVisible === "rounds")
                  setSelectedRounds(tempRounds);
                if (pickerModalVisible === "sets") setSelectedSets(tempSets);
                if (pickerModalVisible === "work") setWorkSeconds(tempWork);
                if (pickerModalVisible === "rest") setRestSeconds(tempRest);
                if (pickerModalVisible === "setRest")
                  setSetRestTimeSeconds(tempSetRest);
                closePickerModal();
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
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
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.inputText,
    },
    settingsGrid: {
      gap: 16,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: "500",
    },
    settingValue: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 80,
    },
    settingValueText: {
      fontSize: 14,
      color: colors.inputText,
      fontWeight: "500",
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
      marginBottom: 12,
    },
    startButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: "600",
    },
    saveButton: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    saveButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    disabledButton: {
      backgroundColor: colors.inputBackground,
      borderColor: colors.border,
      opacity: 0.6,
    },
    disabledButtonText: {
      color: colors.textSecondary,
    },
    cancelButton: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 12,
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: 320,
      alignItems: "center",
    },
    picker: {
      flex: 1,
      color: "white",
    },
    confirmButton: {
      marginTop: 24,
      backgroundColor: "lime",
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 32,
    },
    confirmButtonText: {
      color: colors.textInverse,
      fontSize: 20,
      fontWeight: "bold",
    },
  });

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
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
    input: {
      ...tablet.input,
      paddingVertical: 12,
      fontSize: 14,
    },
    settingItem: {
      ...tablet.settingItem,
      gap: 12,
    },
    settingLabel: {
      ...tablet.settingLabel,
      fontSize: 14,
      flex: 1,
    },
    settingValue: {
      ...tablet.settingValue,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    settingValueText: {
      ...tablet.settingValueText,
      fontSize: 13,
    },
    startButton: {
      ...tablet.startButton,
      paddingVertical: 14,
    },
    saveButton: {
      ...tablet.saveButton,
      paddingVertical: 14,
    },
    cancelButton: {
      ...tablet.cancelButton,
      paddingVertical: 14,
    },
    cancelButtonText: {
      ...tablet.cancelButtonText,
      fontSize: 14,
    },
  });
};
