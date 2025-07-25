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

import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";

import Clock from "@/components/Clock";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TimePicker from "@/components/TimePicker";
import { IconSymbol } from "@/components/ui/IconSymbol";

// Utility function to convert minutes and seconds to total seconds
function toTotalSeconds(minutes: string, seconds: string) {
  return parseInt(minutes) * 60 + parseInt(seconds);
}

export default function TimersScreen() {
  const [timerName, setTimerName] = useState("");
  const [selectedRounds, setSelectedRounds] = useState(1);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [selectedSets, setSelectedSets] = useState(1);
  const [setRestTimeSeconds, setSetRestTimeSeconds] = useState(0);
  const [clockVisible, setClockVisible] = useState(false);
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

  const loadTimers = async () => {
    try {
      const timers = await AsyncStorage.getItem("timers");
      setSavedTimers(timers ? JSON.parse(timers) : []);
    } catch (e) {
      setSavedTimers([]);
    }
  };

  useEffect(() => {
    loadTimers();
  }, []);

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
    setTimerName(timer.name);
    setSelectedRounds(timer.rounds);
    setWorkSeconds(timer.workTime);
    setRestSeconds(timer.restTime);
    setSelectedSets(timer.sets);
    setSetRestTimeSeconds(timer.setRestTime);
    setEditIndex(idx);
  };

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
    let timers = savedTimers.slice();
    if (editIndex !== null) {
      timers[editIndex] = timer;
    } else {
      timers.push(timer);
    }
    await AsyncStorage.setItem("timers", JSON.stringify(timers));
    setSavedTimers(timers);
    alert("Timer saved!");
    setTimerName("");
    setSelectedRounds(1);
    setWorkSeconds(0);
    setRestSeconds(0);
    setSelectedSets(1);
    setSetRestTimeSeconds(0);
    setEditIndex(null);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="lime"
          name="timer.circle"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.centeredContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Create a Timer</ThemedText>
        </ThemedView>
        <View style={styles.timerNameContainer}>
          <ThemedText type="subtitle" style={styles.label}>
            Timer Name
          </ThemedText>
          <TextInput
            style={styles.timerNameInput}
            placeholder="Timer Name"
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
          onPress={() => {
            handleStart();
          }}
          style={styles.sleekStartButton}
          activeOpacity={0.8}
        >
          <Text style={styles.sleekStartIcon}>▶ Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveTimer}
          style={styles.saveButton}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>Save Timer</Text>
        </TouchableOpacity>

        {/* Saved Timers Section */}
        <View style={{ marginTop: 40, width: "100%", alignItems: "center" }}>
          <ThemedText type="title" style={{ marginBottom: 12 }}>
            Saved Timers
          </ThemedText>
          <View style={styles.timerCardsContainer}>
            {savedTimers.length === 0 ? (
              <ThemedText>No saved timers yet.</ThemedText>
            ) : (
              savedTimers.map((timer, idx) => (
                <View key={idx} style={styles.timerCard}>
                  <View style={styles.timerCardActions}>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Edit pressed", idx);
                        handleEdit(timer, idx);
                      }}
                      style={styles.iconButton}
                    >
                      <Feather name="edit-2" size={26} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Delete pressed", idx);
                        handleDelete(idx);
                      }}
                      style={styles.iconButton}
                    >
                      <Feather name="trash-2" size={26} color="#d9534f" />
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
                      setSelectedRounds(timer.rounds);
                      setWorkSeconds(timer.workTime);
                      setRestSeconds(timer.restTime);
                      setSelectedSets(timer.sets);
                      setSetRestTimeSeconds(timer.setRestTime);
                      setClockVisible(true);
                    }}
                    style={styles.playButton}
                  >
                    <Feather name="play-circle" size={60} color="#39FF14" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </View>

      {/* Clock Component */}
      <Clock
        visible={clockVisible}
        onClose={() => setClockVisible(false)}
        rounds={selectedRounds}
        workTime={workSeconds}
        restTime={restSeconds}
        sets={selectedSets}
        setRestTime={setRestTimeSeconds}
      />

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

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
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
  titleContainer: {
    marginBottom: 40,
  },
  timerNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
  },
  timerNameInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 24,
    backgroundColor: "#fff",
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
    fontSize: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    minWidth: 120,
  },
  inputText: {
    paddingTop: 3,
    fontSize: 24,
    color: "#333",
  },
  picker: {
    flex: 1,
  },
  sleekStartButton: {
    width: 220,
    height: 60,
    borderRadius: 24,
    backgroundColor: "lime",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "lime",
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
  },
  sleekStartIcon: {
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#222",
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#39FF14",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
    width: 300,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#39FF14",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  timerCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  timerCard: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: 320,
    minHeight: 120,
    position: "relative",
    marginHorizontal: 8,
    marginTop: 8,
  },
  timerCardActions: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 16,
    minHeight: 44, // Ensure enough height for icons
    minWidth: 100, // Ensure enough width for both icons
    zIndex: 10, // Make sure it's above other content
  },
  timerCardTitle: {
    color: "#39FF14",
    fontSize: 24,
    fontWeight: "bold",
  },
  timerCardText: {
    color: "#fff",
    fontSize: 18,
  },
  iconButton: {
    width: 44,
    height: 44,
    padding: 0,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
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
