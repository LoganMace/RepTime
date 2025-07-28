import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useTimer } from "../hooks/useTimer";
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

  const {
    currentRound,
    currentSet,
    currentPhase,
    phaseBeforePause,
    timeLeft,
    handleStart,
    handlePause,
    handleResume,
  } = useTimer({
    visible,
    rounds,
    workTime,
    restTime,
    sets,
    setRestTime,
  });

  const handleClose = () => {
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
                    ? styles.rest
                    : currentPhase === "paused"
                    ? styles.paused
                    : styles.getReady,
                ]}
              >
                {phaseLabel}
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
