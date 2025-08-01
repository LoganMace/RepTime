import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
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
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import TimePicker from "@/components/TimePicker";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";

// Utility function to convert minutes and seconds to total seconds
function toTotalSeconds(minutes: string, seconds: string) {
  return parseInt(minutes) * 60 + parseInt(seconds);
}

export default function TimersScreen() {
  const { getStyles, isMobile } = useResponsiveStyles();
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

  const styles = getStyles(mobileStyles, tabletStyles);

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
    setTimerName("");
    setSelectedRounds(1);
    setWorkSeconds(0);
    setRestSeconds(0);
    setSelectedSets(1);
    setSetRestTimeSeconds(0);
    setEditIndex(null);
    router.push("/(drawer)/timers/savedTimers");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={isMobile ? 180 : 310}
          color="lime"
          name="timer.circle"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.centeredContainer}>
        <View style={styles.timerNameContainer}>
          <ThemedText type="subtitle" style={styles.label}>
            Timer Name
          </ThemedText>
          <TextInput
            style={styles.timerNameInput}
            placeholder="Timer Name"
            placeholderTextColor="#999"
            value={timerName}
            onChangeText={setTimerName}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollableContainer}>
          <View style={styles.inputRow}>
            {/* Rounds Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Rounds
                </ThemedText>
                <TouchableOpacity
                  onPress={() => openPickerModal("rounds")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {selectedRounds}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Work Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Work
                </ThemedText>
                <TouchableOpacity
                  onPress={() => openPickerModal("work")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {formatTime(workSeconds)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Rest Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Rest
                </ThemedText>
                <TouchableOpacity
                  onPress={() => openPickerModal("rest")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {formatTime(restSeconds)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            {/* Sets Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Sets
                </ThemedText>
                <TouchableOpacity
                  onPress={() => openPickerModal("sets")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {selectedSets}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Set Rest Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Set Rest
                </ThemedText>
                <TouchableOpacity
                  onPress={() => openPickerModal("setRest")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {formatTime(setRestTimeSeconds)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={handleStart}
          style={[
            styles.sleekStartButton,
            isStartDisabled && styles.disabledButton,
          ]}
          activeOpacity={0.8}
          disabled={isStartDisabled}
        >
          <Text
            style={[
              styles.sleekStartIcon,
              isStartDisabled && styles.disabledButtonText,
            ]}
          >
            ▶ Start
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveTimer}
          style={[styles.saveButton, isSaveDisabled && styles.disabledButton]}
          activeOpacity={0.85}
          disabled={isSaveDisabled}
        >
          <Text
            style={[
              styles.saveButtonText,
              isSaveDisabled && styles.disabledButtonText,
            ]}
          >
            {editIndex !== null ? "Update Timer" : "Save Timer"}
          </Text>
        </TouchableOpacity>
      </View>

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
    </ParallaxScrollView>
  );
}

// Define base styles as plain objects first to avoid referencing 'styles' in its own initializer
const baseButton = {
  height: 60,
  borderRadius: 24,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 8,
  elevation: 2,
} as const;

const baseButtonText = {
  fontSize: 24,
  fontWeight: "bold",
  letterSpacing: 1,
  textTransform: "uppercase",
} as const;

const tabletStyles = StyleSheet.create({
  // Base Styles
  baseButton,
  baseButtonText,
  disabledButton: {
    backgroundColor: "#444",
    borderColor: "#666",
  },
  disabledButtonText: {
    color: "#666",
  },

  // Header
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },

  // Main Container
  centeredContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },

  // Timer Creation Form
  timerNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
  },
  timerNameInput: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    padding: 10,
    fontSize: 24,
    backgroundColor: "#333",
    color: "#fff",
    minWidth: 200,
  },
  scrollableContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  inputRow: {
    flexDirection: "column",
  },
  inputColumn: {
    flexDirection: "column",
  },
  sectionContainer: {
    marginBottom: 20,
    width: "auto",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  label: {
    fontSize: 24,
    fontWeight: "normal",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    backgroundColor: "#333",
    minWidth: 120,
  },
  inputText: {
    paddingTop: 3,
    fontSize: 24,
    color: "#fff",
  },

  // Action Buttons
  sleekStartButton: {
    ...baseButton,
    paddingHorizontal: 24,
    backgroundColor: "lime",
    borderColor: "lime",
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
  },
  sleekStartIcon: {
    ...baseButtonText,
    color: "#222",
    marginLeft: 8,
  },
  saveButton: {
    ...baseButton,
    backgroundColor: "#222",
    borderColor: "#39FF14",
    marginTop: 8,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
  saveButtonText: {
    ...baseButtonText,
    color: "#39FF14",
  },

  // Modal & Picker
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
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
    backgroundColor: "#39FF14",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  confirmButtonText: {
    color: "#222",
    fontSize: 20,
    fontWeight: "bold",
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  headerImage: {
    bottom: -30,
    left: -20,
    position: "absolute",
  },
  centeredContainer: {
    ...tabletStyles.centeredContainer,
    alignItems: "flex-start",
  },
  timerNameContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
    marginBottom: 20,
    width: "100%",
  },
  timerNameInput: {
    ...tabletStyles.timerNameInput,
    width: "100%",
    fontSize: 20,
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  scrollableContainer: {
    ...tabletStyles.scrollableContainer,
    width: "100%",
    justifyContent: "space-between",
    gap: 0,
  },
  inputRow: {
    ...tabletStyles.inputRow,
  },
  sectionContainer: {
    ...tabletStyles.sectionContainer,
    width: "100%",
    marginBottom: 15,
  },
  rowContainer: {
    ...tabletStyles.rowContainer,
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    ...tabletStyles.label,
    fontSize: 20,
  },
  inputContainer: {
    ...tabletStyles.inputContainer,
    minWidth: 70,
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  inputText: {
    ...tabletStyles.inputText,
    fontSize: 20,
    paddingTop: 0,
  },
  sleekStartButton: {
    ...tabletStyles.sleekStartButton,
    width: "100%",
    height: 50,
    marginBottom: 10,
  },
  sleekStartIcon: {
    ...tabletStyles.sleekStartIcon,
    fontSize: 20,
  },
  saveButton: {
    ...tabletStyles.saveButton,
    width: "100%",
    height: 50,
  },
  saveButtonText: {
    ...tabletStyles.saveButtonText,
    fontSize: 20,
  },
});
