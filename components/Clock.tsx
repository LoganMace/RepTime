import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { IconSymbol } from "./ui/IconSymbol";

type ClockProps = {
  visible: boolean;
  rounds: number;
  workTime: number;
  restTime: number;
  sets: number;
  setRestTime: number;
  onClose: () => void;
  skipGetReady?: boolean;
  quickTimer?: boolean;
  onRestart?: () => void;
};

const Clock = ({
  visible,
  rounds,
  workTime,
  restTime,
  sets,
  setRestTime,
  onClose,
  skipGetReady = false,
  quickTimer = false,
  onRestart,
}: ClockProps) => {
  const { colors } = useTheme();
  const { getStyles, isMobile } = useResponsiveStyles();
  const { width } = useWindowDimensions();

  const styles = useMemo(() => {
    return getStyles(mobileStyles(colors), tabletStyles(colors));
  }, [getStyles, colors]);

  const circleSize = useMemo(
    () => (isMobile ? width * 0.85 : 600),
    [isMobile, width]
  );
  const circleStrokeWidth = useMemo(() => (isMobile ? 18 : 24), [isMobile]);

  const {
    currentRound,
    currentSet,
    currentPhase,
    phaseBeforePause,
    timeLeft,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
  } = useTimer({
    visible,
    rounds,
    workTime,
    restTime,
    sets,
    setRestTime,
    skipGetReady,
    quickTimer,
  });

  const handleClose = () => {
    onClose();
  };

  const [hasRun, setHasRun] = useState(false);

  // Track when the timer has actually run (moved past start phase)
  useEffect(() => {
    if (currentPhase !== "start") {
      setHasRun(true);
    }
    if (!visible) {
      setHasRun(false);
    }
  }, [currentPhase, visible]);

  // Auto-close for quick timers when done (only if no onRestart prop)
  useEffect(() => {
    if (
      quickTimer &&
      !onRestart &&
      currentPhase === "start" &&
      visible &&
      hasRun
    ) {
      // Small delay to ensure beep plays
      const timer = setTimeout(() => {
        onClose();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [quickTimer, onRestart, currentPhase, onClose, visible, hasRun]);

  // Helper function to get total time for current phase
  const getTotalTimeForPhase = useCallback(() => {
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
  }, [currentPhase, phaseBeforePause, workTime, restTime, setRestTime]);

  // Helper function to get animation color based on phase
  const getProgressColor = useMemo(() => {
    switch (currentPhase) {
      case "work":
        return colors.workPhase; // Energetic red for work/intensity
      case "rest":
        return colors.restPhase; // Calming teal for rest/recovery
      case "setRest":
        return colors.setRestPhase; // Cool blue for longer set breaks
      case "getReady":
        return colors.getReadyPhase; // Warm orange for preparation/focus
      case "paused":
        return colors.pausedPhase; // Neutral gray for paused state
      default:
        return colors.pausedPhase; // Default to paused color
    }
  }, [currentPhase, colors]);

  // Helper function to get text color based on phase
  const getTextColor = useMemo(() => {
    switch (currentPhase) {
      case "work":
        return colors.workPhaseText; // Deeper red for work text
      case "rest":
        return colors.restPhaseText; // Deeper teal for rest text
      case "setRest":
        return colors.setRestPhaseText; // Deeper blue for set rest text
      case "getReady":
        return colors.getReadyPhaseText; // Deeper orange for get ready text
      case "paused":
        return colors.pausedPhaseText; // Darker gray for paused text
      default:
        return colors.pausedPhaseText; // Default to paused text color
    }
  }, [currentPhase, colors]);

  const phaseLabel = useMemo(() => {
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
  }, [currentPhase]);

  const isPaused = useMemo(() => currentPhase === "paused", [currentPhase]);

  // Create a stable phase identifier for animation component
  const phaseId = useMemo(() => {
    // Generate unique ID for each phase transition
    // Include a timestamp component for phases to ensure uniqueness
    if (currentPhase === "paused") {
      return phaseBeforePause
        ? `${currentSet}-${currentRound}-${phaseBeforePause}`
        : "";
    }
    // For active phases, create a unique ID that changes with each new phase
    return `${currentSet}-${currentRound}-${currentPhase}-${getTotalTimeForPhase()}`;
  }, [
    currentSet,
    currentRound,
    currentPhase,
    phaseBeforePause,
    getTotalTimeForPhase,
  ]);

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
              size={circleSize}
              strokeWidth={circleStrokeWidth}
              duration={getTotalTimeForPhase()}
              isPaused={isPaused}
              timeLeft={timeLeft}
              phaseId={phaseId}
              color={getProgressColor}
              backgroundColor={colors.border}
            />
            <View style={styles.timerContent}>
              {!quickTimer && (
                <Text style={[styles.phaseText, { color: getTextColor }]}>
                  {phaseLabel}
                </Text>
              )}

              <Text style={styles.timeText}>
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timeLeft % 60).toString().padStart(2, "0")}
              </Text>
              {!quickTimer && (
                <>
                  <Text style={styles.roundText}>
                    Round {currentRound} of {rounds}
                  </Text>

                  <Text style={styles.setLevelText}>
                    Set {currentSet} of {sets}
                  </Text>
                </>
              )}
            </View>
          </View>
        )}

        {currentPhase === "done" && !quickTimer && (
          <View style={styles.doneContainer}>
            <Text style={styles.doneText}>Workout Complete!</Text>
            <IconSymbol
              name="party.popper"
              size={isMobile ? 120 : 150}
              color="gold"
              style={styles.doneIcon}
            />
            <Text style={styles.doneSubText}>Great job!</Text>
          </View>
        )}

        {/* Quick Timer Completion Screen */}
        {((quickTimer &&
          currentPhase === "start" &&
          visible &&
          hasRun &&
          onRestart) ||
          (quickTimer && currentPhase === "done")) && (
          <View style={styles.doneContainer}>
            <Text style={styles.doneText}>Timer Complete!</Text>
            <IconSymbol
              name="checkmark.circle"
              size={isMobile ? 100 : 120}
              color={colors.success}
              style={styles.doneIcon}
            />
            <View style={styles.quickTimerButtonContainer}>
              {onRestart && (
                <TouchableOpacity
                  onPress={handleReset}
                  style={[styles.pauseButton, styles.restartButton]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.pauseButtonText, styles.restartButtonText]}
                  >
                    Restart
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.pauseButton, styles.closeTimerButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.pauseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Play button for starting the timer */}
        {currentPhase === "start" && !quickTimer && (
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

        {currentPhase === "done" && !quickTimer && (
          <TouchableOpacity
            onPress={handleClose}
            style={styles.pauseButton}
            activeOpacity={0.8}
          >
            <Text style={styles.pauseButtonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: 40,
      left: 40,
      zIndex: 1000,
    },
    closeButtonText: {
      color: colors.text,
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
      color: colors.gold,
      marginBottom: 10,
    },
    phase: {
      fontSize: 120,
      color: colors.text,
      marginBottom: 10,
      fontWeight: "bold",
    },
    time: {
      fontSize: 400,
      fontWeight: "bold",
    },
    playButton: {
      fontSize: 400,
      color: colors.success,
    },
    sleekPlayButton: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 4,
      borderColor: colors.success,
    },
    sleekPlayIcon: {
      fontSize: 120,
      color: colors.success,
      marginLeft: 10,
      textShadowColor: colors.shadow,
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 8,
    },
    pauseButton: {
      marginTop: 32,
      paddingVertical: 14,
      paddingHorizontal: 36,
      borderRadius: 24,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.text,
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 2,
    },
    pauseButtonText: {
      color: colors.text,
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
      color: colors.text,
      fontFamily: "monospace",
      marginBottom: 12,
      fontVariant: ["tabular-nums"],
    },
    roundText: {
      fontSize: 32,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    setLevelText: {
      fontSize: 30,
      color: colors.textSecondary,
    },
    doneContainer: {
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
    doneText: {
      fontSize: 64,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
    },
    doneSubText: {
      fontSize: 32,
      color: colors.textSecondary,
      textAlign: "center",
    },
    doneIcon: {
      marginVertical: 20,
    },
    quickTimerButtonContainer: {
      flexDirection: "row",
      gap: 16,
      marginTop: 20,
    },
    restartButton: {
      backgroundColor: "gold",
      borderColor: "gold",
    },
    closeTimerButton: {
      backgroundColor: colors.card,
      borderColor: colors.textSecondary,
    },
    restartButtonText: {
      color: colors.textInverse,
    },
  });

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const tablet = tabletStyles(colors);
  return StyleSheet.create({
    ...tablet,
    closeButton: {
      ...tablet.closeButton,
      top: 50,
      left: 20,
      zIndex: 1000,
    },
    closeButtonText: {
      ...tablet.closeButtonText,
      fontSize: 36,
    },
    progressContainer: {
      ...tablet.progressContainer,
      marginBottom: 40,
    },
    phaseText: {
      ...tablet.phaseText,
      fontSize: 44,
      fontWeight: "600",
    },
    timeText: {
      ...tablet.timeText,
      fontSize: 64,
    },
    roundText: {
      ...tablet.roundText,
      fontSize: 24,
    },
    setLevelText: {
      ...tablet.setLevelText,
      fontSize: 22,
    },
    sleekPlayButton: {
      ...tablet.sleekPlayButton,
      width: 150,
      height: 150,
      borderRadius: 75,
    },
    sleekPlayIcon: {
      ...tablet.sleekPlayIcon,
      fontSize: 90,
    },
    pauseButton: {
      ...tablet.pauseButton,
      paddingVertical: 12,
      paddingHorizontal: 30,
      marginTop: 24,
    },
    pauseButtonText: {
      ...tablet.pauseButtonText,
      fontSize: 18,
    },
    doneContainer: {
      ...tablet.doneContainer,
      gap: 15,
      paddingHorizontal: 20,
    },
    doneText: {
      ...tablet.doneText,
      fontSize: 36,
    },
    doneSubText: {
      ...tablet.doneSubText,
      fontSize: 24,
    },
    doneIcon: {
      ...tablet.doneIcon,
      marginVertical: 15,
    },
    quickTimerButtonContainer: {
      ...tablet.quickTimerButtonContainer,
      gap: 12,
      marginTop: 15,
    },
  });
};

export default Clock;
