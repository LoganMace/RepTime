import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import AnimatedCircleProgress from "./AnimatedCircleProgress";

type ClockProps = {
  visible: boolean;
  rounds: number;
  workTime: number;
  restTime: number;
  sets: number;
  setRestTime: number;
  onClose: () => void;
};

type Phase =
  | "start"
  | "getReady"
  | "work"
  | "rest"
  | "setRest"
  | "paused"
  | "done";

const Clock = ({
  visible,
  rounds,
  workTime,
  restTime,
  sets,
  setRestTime,
  onClose,
}: ClockProps) => {
  const { isMobile } = useResponsiveStyles();
  const { width } = useWindowDimensions();

  const styles = isMobile ? mobileStyles : tabletStyles;

  const circleSize = isMobile ? width * 0.85 : 600;
  const circleStrokeWidth = isMobile ? 18 : 24;

  const lowBeep = useAudioPlayer(require("../assets/sounds/low-beep.mp3"));
  const highBeep = useAudioPlayer(require("../assets/sounds/high-beep.mp3"));

  const [currentRound, setCurrentRound] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("start");
  const [phaseBeforePause, setPhaseBeforePause] = useState<Phase>("start");
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // --- Speech Announcements ---
    if (currentPhase === "getReady" && timeLeft === 10) {
      Speech.speak("Get ready!");
    } else if (currentPhase === "work" && timeLeft === workTime) {
      Speech.speak(`Round ${currentRound}`);
    } else if (currentPhase === "rest" && timeLeft === restTime) {
      Speech.speak("Rest");
    } else if (currentPhase === "setRest" && timeLeft === setRestTime) {
      Speech.speak(`Set ${currentSet} complete. Rest.`);
    } else if (currentPhase === "done") {
      Speech.speak("Workout complete!");
    }

    if (currentPhase === "work") {
      if (timeLeft === 10 && workTime > 10) {
        Speech.speak("Ten seconds");
      } else if (timeLeft === Math.floor(workTime / 2) && workTime > 20) {
        Speech.speak("Half way there");
      } else if (workTime > 60 && timeLeft > 0 && timeLeft % 60 === 0) {
        Speech.speak(`${timeLeft / 60} minute${timeLeft / 60 > 1 ? "s" : ""}`);
      }
    }

    // --- Sound Effects ---
    if (
      (currentPhase === "work" && timeLeft === workTime && workTime > 0) ||
      (currentPhase === "rest" && timeLeft === restTime && restTime > 0) ||
      (currentPhase === "setRest" &&
        timeLeft === setRestTime &&
        setRestTime > 0)
    ) {
      highBeep.seekTo(0);
      highBeep.play();
    }

    if (
      currentPhase === "work" &&
      timeLeft === Math.floor(workTime / 2) &&
      workTime > 20
    ) {
      lowBeep.seekTo(0);
      lowBeep.play();
    }
  }, [
    currentPhase,
    currentRound,
    currentSet,
    timeLeft,
    workTime,
    restTime,
    setRestTime,
    highBeep,
    lowBeep,
  ]);

  const handlePhaseEnd = useCallback(() => {
    if (currentPhase === "getReady") {
      if (workTime > 0) {
        setCurrentPhase("work");
        setTimeLeft(workTime);
      } else if (restTime > 0) {
        setCurrentPhase("rest");
        setTimeLeft(restTime);
      } else {
        setCurrentRound((r) => r + 1);
        setCurrentPhase("work");
        setTimeLeft(workTime);
      }
    } else if (currentPhase === "work") {
      if (currentRound < rounds) {
        if (restTime > 0) {
          setCurrentPhase("rest");
          setTimeLeft(restTime);
        } else {
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          if (workTime > 0) {
            setCurrentPhase("work");
            setTimeLeft(workTime);
          } else {
            setCurrentPhase("done");
          }
        }
      } else {
        // End of a set
        if (currentSet < sets) {
          if (setRestTime > 0) {
            setCurrentPhase("setRest");
            setTimeLeft(setRestTime);
          } else {
            setCurrentSet((s) => s + 1);
            setCurrentRound(1);
            setCurrentPhase("work");
            setTimeLeft(workTime);
          }
        } else {
          setCurrentPhase("done");
        }
      }
    } else if (currentPhase === "rest") {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      if (nextRound <= rounds) {
        if (workTime > 0) {
          setCurrentPhase("work");
          setTimeLeft(workTime);
        } else if (restTime > 0) {
          setCurrentPhase("rest");
          setTimeLeft(restTime);
        } else {
          setCurrentPhase("done");
        }
      } else {
        // This part might be redundant if the logic in "work" phase end is correct
        if (currentSet < sets) {
          if (setRestTime > 0) {
            setCurrentPhase("setRest");
            setTimeLeft(setRestTime);
          } else {
            setCurrentSet((s) => s + 1);
            setCurrentRound(1);
            setCurrentPhase("work");
            setTimeLeft(workTime);
          }
        } else {
          setCurrentPhase("done");
        }
      }
    } else if (currentPhase === "setRest") {
      setCurrentSet((s) => s + 1);
      setCurrentRound(1);
      if (workTime > 0) {
        setCurrentPhase("work");
        setTimeLeft(workTime);
      } else if (restTime > 0) {
        setCurrentPhase("rest");
        setTimeLeft(restTime);
      } else {
        setCurrentPhase("done");
      }
    }
  }, [
    currentPhase,
    currentRound,
    rounds,
    workTime,
    restTime,
    currentSet,
    sets,
    setRestTime,
  ]);

  const handleTimerTick = useCallback(
    (prevTime: number) => {
      if (prevTime <= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        handlePhaseEnd();
        return 0;
      }

      const newTime = prevTime - 1;

      // Play countdown beep for the last 3 seconds
      if ([1, 2, 3].includes(newTime)) {
        lowBeep.seekTo(0);
        lowBeep.play();
      }

      return newTime;
    },
    [handlePhaseEnd, lowBeep]
  );

  useEffect(() => {
    if (!visible) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentPhase("start");
      setCurrentRound(1);
      setCurrentSet(1);
      setTimeLeft(0);
      return;
    }

    if (["start", "paused", "done"].includes(currentPhase)) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    let expected = Date.now() + 1000;
    intervalRef.current = setInterval(() => {
      const drift = Date.now() - expected;
      if (drift > 1000) {
        // If the drift is too large, we can simply reset the timer
        // or adjust timeLeft, but for now, we'll just log it.
        console.warn("Timer drift detected:", drift);
      }
      setTimeLeft(handleTimerTick);
      expected += 1000;
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, currentPhase, handleTimerTick]);

  const handleStart = () => {
    setCurrentPhase("getReady");
    setTimeLeft(10);
  };

  const handlePause = () => {
    setPhaseBeforePause(currentPhase);
    setCurrentPhase("paused");
  };

  const handleResume = () => {
    setCurrentPhase(phaseBeforePause);
  };

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onClose();
  };

  // Helper function to get total time for current phase
  const getTotalTimeForPhase = () => {
    const phase = currentPhase === "paused" ? phaseBeforePause : currentPhase;
    switch (phase) {
      case "getReady":
        return 10;
      case "work":
        return workTime;
      case "rest":
        return restTime;
      case "setRest":
        return setRestTime;
      default:
        return 0;
    }
  };

  // Helper function to get color based on phase
  const getProgressColor = () => {
    switch (currentPhase) {
      case "work":
        return "#e74c3c"; // Red for work
      case "rest":
        return "#2ecc71"; // Green for rest
      case "setRest":
        return "#3498db"; // Blue for set rest
      case "getReady":
        return "#f39c12"; // Orange for get ready
      default:
        return "#95a5a6"; // Gray for other phases
    }
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case "start":
        return "";
      case "work":
        return "Work";
      case "rest":
        return "Rest";
      case "setRest":
        return "Set Rest";
      case "getReady":
        return "Get Ready!";
      case "paused":
        return "Paused";
      case "done":
        return "Workout Complete!";
      default:
        return currentPhase;
    }
  };
  const phaseLabel = getPhaseLabel();
  const isPaused = currentPhase === "paused";
  const phaseIdentifier =
    currentPhase === "paused" ? phaseBeforePause : currentPhase;
  const animationKey = `${currentSet}-${currentRound}-${phaseIdentifier}`;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Progress Circle */}
        {currentPhase !== "start" && currentPhase !== "done" && (
          <View style={styles.progressContainer}>
            <AnimatedCircleProgress
              key={animationKey}
              size={circleSize}
              strokeWidth={circleStrokeWidth}
              duration={getTotalTimeForPhase()}
              isPaused={isPaused}
              color={getProgressColor()}
              backgroundColor="#2c2c2c"
            />
            <View style={styles.timerContent}>
              <Text
                style={[
                  styles.phaseText,
                  currentPhase === "work"
                    ? styles.work
                    : currentPhase === "rest"
                    ? styles.rest
                    : currentPhase === "setRest"
                    ? styles.rest // Or a new style for set rest
                    : currentPhase === "paused"
                    ? styles.paused
                    : styles.getReady,
                ]}
              >
                {phaseLabel}
                {/* {currentPhase === "done" && "Complete!"}
                {currentPhase === "start" && "Ready"} */}
              </Text>

              <Text style={styles.timeText}>
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timeLeft % 60).toString().padStart(2, "0")}
              </Text>

              <Text style={styles.roundText}>
                Round {currentRound} of {rounds}
              </Text>

              <Text style={styles.setLevelText}>
                Set {currentSet} of {sets}
              </Text>
            </View>
          </View>
        )}

        {/* Play button for starting the timer */}
        {currentPhase === "start" && (
          <TouchableOpacity
            onPress={handleStart}
            style={styles.sleekPlayButton}
            activeOpacity={0.8}
          >
            <Text style={styles.sleekPlayIcon}>▶</Text>
          </TouchableOpacity>
        )}

        {/* Tap to pause/resume button */}
        {currentPhase !== "start" && currentPhase !== "done" && (
          <TouchableOpacity
            onPress={isPaused ? handleResume : handlePause}
            style={styles.pauseButton}
            activeOpacity={0.8}
          >
            <Text style={styles.pauseButtonText}>
              {isPaused ? "resume" : "tap to pause"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const tabletStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 40,
    zIndex: 1000,
  },
  closeButtonText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  label: {
    position: "absolute",
    top: 50,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
  roundContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 40,
  },
  round: {
    fontSize: 60,
    color: "yellow",
    marginBottom: 10,
  },
  phase: {
    fontSize: 120,
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
  },
  time: {
    fontSize: 400,
    fontWeight: "bold",
  },
  work: {
    color: "lime",
  },
  rest: {
    color: "cyan",
  },
  getReady: {
    color: "white",
  },
  paused: {
    color: "gray",
  },
  playButton: {
    fontSize: 400,
    color: "lime",
  },
  sleekPlayButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: "lime",
  },
  sleekPlayIcon: {
    fontSize: 120,
    color: "lime",
    marginLeft: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  pauseButton: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 24,
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  pauseButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  progressContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  timerContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  phaseText: {
    fontSize: 64,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  timeText: {
    fontSize: 120,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "monospace",
    marginBottom: 12,
    fontVariant: ["tabular-nums"],
  },
  roundText: {
    fontSize: 32,
    color: "#ccc",
    marginBottom: 4,
  },
  setLevelText: {
    fontSize: 30,
    color: "#999",
  },
});

const mobileStyles = StyleSheet.create({
  ...tabletStyles,
  closeButton: {
    ...tabletStyles.closeButton,
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  closeButtonText: {
    ...tabletStyles.closeButtonText,
    fontSize: 36,
  },
  progressContainer: {
    ...tabletStyles.progressContainer,
    marginBottom: 40,
  },
  phaseText: {
    ...tabletStyles.phaseText,
    fontSize: 44,
    fontWeight: "600",
  },
  timeText: {
    ...tabletStyles.timeText,
    fontSize: 80,
  },
  roundText: {
    ...tabletStyles.roundText,
    fontSize: 24,
  },
  setLevelText: {
    ...tabletStyles.setLevelText,
    fontSize: 22,
  },
  sleekPlayButton: {
    ...tabletStyles.sleekPlayButton,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  sleekPlayIcon: {
    ...tabletStyles.sleekPlayIcon,
    fontSize: 90,
  },
  pauseButton: {
    ...tabletStyles.pauseButton,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 24,
  },
  pauseButtonText: {
    ...tabletStyles.pauseButtonText,
    fontSize: 18,
  },
});

export default Clock;
