import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useState } from "react";

import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TimePicker from "@/components/TimePicker";
import Clock from "@/components/Clock";

// Utility function to convert minutes and seconds to total seconds
function toTotalSeconds(minutes: string, seconds: string) {
  return parseInt(minutes) * 60 + parseInt(seconds);
}

export default function TimersScreen() {
  const [selectedRounds, setSelectedRounds] = useState(1);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [selectedSets, setSelectedSets] = useState(1);
  const [setRestTimeSeconds, setSetRestTimeSeconds] = useState(0);
  const [showRoundsPicker, setShowRoundsPicker] = useState(false);
  const [showWorkPicker, setShowWorkPicker] = useState(false);
  const [showRestPicker, setShowRestPicker] = useState(false);
  const [showSetsPicker, setShowSetsPicker] = useState(false);
  const [showSetRestPicker, setShowSetRestPicker] = useState(false);
  const [clockVisible, setClockVisible] = useState(false);

  const generateRounds = () => {
    const rounds = [];
    for (let i = 1; i <= 100; i++) {
      rounds.push(i);
    }
    return rounds;
  };
  const roundOptions = generateRounds();
  const setOptions = generateRounds();

  const togglePicker = (
    picker: "rounds" | "work" | "rest" | "sets" | "setRest"
  ) => {
    setShowRoundsPicker(picker === "rounds" ? !showRoundsPicker : false);
    setShowWorkPicker(picker === "work" ? !showWorkPicker : false);
    setShowRestPicker(picker === "rest" ? !showRestPicker : false);
    setShowSetsPicker(picker === "sets" ? !showSetsPicker : false);
    setShowSetRestPicker(picker === "setRest" ? !showSetRestPicker : false);
  };

  const handleWorkTimeChange = (minutes: string, seconds: string) => {
    setWorkSeconds(toTotalSeconds(minutes, seconds));
  };

  const handleRestTimeChange = (minutes: string, seconds: string) => {
    setRestSeconds(toTotalSeconds(minutes, seconds));
  };

  const handleSetRestTimeChange = (minutes: string, seconds: string) => {
    setSetRestTimeSeconds(toTotalSeconds(minutes, seconds));
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setClockVisible(true);
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

        <ScrollView contentContainerStyle={styles.scrollableContainer}>
          <View>
            {/* Rounds Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Rounds
                </ThemedText>
                <TouchableOpacity
                  onPress={() => togglePicker("rounds")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {selectedRounds}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {showRoundsPicker && (
                <Picker
                  selectedValue={selectedRounds.toString()}
                  onValueChange={(itemValue: string) =>
                    setSelectedRounds(parseInt(itemValue))
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
              )}
            </View>

            {/* Work Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Work
                </ThemedText>
                <TouchableOpacity
                  onPress={() => togglePicker("work")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {formatTime(workSeconds)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {showWorkPicker && (
                <TimePicker
                  onValueChange={(minutes, seconds) => {
                    handleWorkTimeChange(minutes, seconds);
                  }}
                />
              )}
            </View>

            {/* Rest Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Rest
                </ThemedText>
                <TouchableOpacity
                  onPress={() => togglePicker("rest")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {formatTime(restSeconds)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {showRestPicker && (
                <TimePicker
                  onValueChange={(minutes, seconds) => {
                    handleRestTimeChange(minutes, seconds);
                  }}
                />
              )}
            </View>
          </View>

          <View>
            {/* Sets Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Sets
                </ThemedText>
                <TouchableOpacity
                  onPress={() => togglePicker("sets")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {selectedSets}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {showSetsPicker && (
                <Picker
                  selectedValue={selectedSets.toString()}
                  onValueChange={(itemValue: string) =>
                    setSelectedSets(parseInt(itemValue))
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
              )}
            </View>

            {/* Set Rest Picker */}
            <View style={styles.sectionContainer}>
              <View style={styles.rowContainer}>
                <ThemedText type="subtitle" style={styles.label}>
                  Set Rest
                </ThemedText>
                <TouchableOpacity
                  onPress={() => togglePicker("setRest")}
                  style={[styles.inputContainer]}
                >
                  <ThemedText style={styles.inputText}>
                    {formatTime(setRestTimeSeconds)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {showSetRestPicker && (
                <TimePicker
                  onValueChange={(minutes, seconds) => {
                    handleSetRestTimeChange(minutes, seconds);
                  }}
                />
              )}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            handleStart();
            setShowRoundsPicker(false);
            setShowWorkPicker(false);
            setShowRestPicker(false);
            setShowSetsPicker(false);
            setShowSetRestPicker(false);
          }}
          style={styles.sleekStartButton}
          activeOpacity={0.8}
        >
          <Text style={styles.sleekStartIcon}>▶ Start</Text>
        </TouchableOpacity>
      </View>
      <Clock
        visible={clockVisible}
        onClose={() => setClockVisible(false)}
        rounds={selectedRounds}
        workTime={workSeconds}
        restTime={restSeconds}
        sets={selectedSets}
        setRestTime={setRestTimeSeconds}
      />
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
  scrollableContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 100,
  },
  sectionContainer: {
    marginBottom: 20,
    width: 250,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: 100,
  },
  inputText: {
    paddingTop: 3,
    fontSize: 24,
    color: "#333",
  },
  picker: {
    margin: 0,
    padding: 0,
  },
  sleekStartButton: {
    width: 220,
    height: 60,
    borderRadius: 24,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "lime",
    marginTop: 30,
    marginBottom: 20,
    flexDirection: "row",
  },
  sleekStartIcon: {
    textTransform: "uppercase",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "lime",
    marginLeft: 8,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
});
