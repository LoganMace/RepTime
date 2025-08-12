import { loadProfileData } from "@/utils/profileStorage";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useCallback, useEffect, useRef, useState } from "react";

export type Phase =
  | "start"
  | "getReady"
  | "work"
  | "rest"
  | "setRest"
  | "paused"
  | "done";

type TimerProps = {
  visible: boolean;
  rounds: number;
  workTime: number;
  restTime: number;
  sets: number;
  setRestTime: number;
  skipGetReady?: boolean;
  quickTimer?: boolean;
};

// High-precision timer state
interface TimerState {
  phase: Phase;
  startTime: number;
  duration: number;
  pausedTime: number;
  totalPausedDuration: number;
}

export const useTimer = ({
  visible,
  rounds,
  workTime,
  restTime,
  sets,
  setRestTime,
  skipGetReady = false,
  quickTimer = false,
}: TimerProps) => {
  // Core state
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("start");
  const [phaseBeforePause, setPhaseBeforePause] = useState<Phase>("start");
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasBeepedForCompletion, setHasBeepedForCompletion] = useState(false);

  // Sound preferences state
  const [muteSounds, setMuteSounds] = useState(false);
  const [muteVoice, setMuteVoice] = useState(false);

  // Track countdown beeps to ensure they only play once per second
  const countdownBeepsRef = useRef<{ [key: number]: boolean }>({});

  // Audio players with error handling
  const lowBeep = useAudioPlayer(require("../assets/sounds/low-beep.mp3"));
  const highBeep = useAudioPlayer(require("../assets/sounds/high-beep.mp3"));

  // Configure audio session for iOS devices to play in silent mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Use expo-audio's native configuration - it DOES support silent mode!
        await setAudioModeAsync({
          playsInSilentMode: true, // This enables audio in silent mode!
        });
        console.log("✅ Audio session configured with expo-audio");
        console.log("✅ Audio will play even when device is in silent mode!");
      } catch (error) {
        console.error("Error configuring audio session:", error);
      }
    };

    setupAudio();
  }, []);

  // Audio utility functions with error handling and haptic fallback
  const playAudio = useCallback(
    (player: typeof lowBeep, name: string, useHaptic: boolean = true) => {
      try {
        // Check if sounds are muted in preferences
        if (!muteSounds) {
          console.log(`Attempting to play ${name}`);
          player.seekTo(0);
          player.play();
          console.log(`${name} played successfully`);
        } else {
          console.log(`Skipping ${name} - sounds are muted in preferences`);
        }

        // Always trigger haptic feedback (even when sounds are muted)
        if (useHaptic) {
          if (name.includes("high")) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          console.log("Haptic feedback triggered");
        }
      } catch (error) {
        console.error(`Error playing ${name}:`, error);
        // Fallback to haptic only
        if (useHaptic) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      }
    },
    [muteSounds]
  );

  // Audio test function (for debugging)
  const testAudio = useCallback(() => {
    console.log("Testing audio playback...");
    playAudio(highBeep, "test high beep");
    setTimeout(() => {
      playAudio(lowBeep, "test low beep");
    }, 1000);
  }, [playAudio, highBeep, lowBeep]);

  // Debug audio loading
  useEffect(() => {
    console.log("Audio players initialized");
    // Test audio playback capability
    if (lowBeep && highBeep) {
      console.log("Audio players are ready");
      // Uncomment the next line to test audio on load:
      // testAudio();
    }
  }, [lowBeep, highBeep, testAudio]);

  // Load sound preferences when timer becomes visible
  useEffect(() => {
    if (visible) {
      loadProfileData()
        .then((profileData) => {
          setMuteSounds(profileData.preferences.muteSounds);
          setMuteVoice(profileData.preferences.muteVoice);
        })
        .catch((error) => {
          console.error("Failed to load sound preferences:", error);
          // Keep default values (false) if loading fails
        });
    }
  }, [visible]);

  // High-precision timing refs
  const animationFrameRef = useRef<number | null>(null);
  const timerStateRef = useRef<TimerState | null>(null);

  // Precise timer update using requestAnimationFrame
  const updateTimer = useCallback(() => {
    const state = timerStateRef.current;

    if (!state || state.phase === "start" || state.phase === "done") {
      return;
    }

    if (state.phase === "paused") {
      // Don't update during pause
      animationFrameRef.current = requestAnimationFrame(updateTimer);
      return;
    }

    const now = Date.now();
    // Calculate elapsed time since phase started (excluding paused time)
    const elapsedSinceStart = now - state.startTime - state.totalPausedDuration;
    const remaining = Math.max(0, state.duration * 1000 - elapsedSinceStart);
    const remainingSeconds = Math.ceil(remaining / 1000);

    // Update time left
    setTimeLeft(remainingSeconds);

    // Check if phase is complete
    if (remaining <= 0) {
      console.log(`Phase ${state.phase} completed`);
      timerStateRef.current = null;
      setTimeLeft(0);
      // Phase end will trigger in useEffect
      return;
    }

    // Continue the loop
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

  // Stop the animation frame loop
  const stopTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Start a new phase with precise timing
  const startPhase = useCallback(
    (phase: Phase, duration: number) => {
      console.log(`Starting phase: ${phase}, duration: ${duration}s`);

      stopTimer();

      // Reset countdown beeps tracker for new phase
      countdownBeepsRef.current = {};

      const now = Date.now();
      timerStateRef.current = {
        phase,
        startTime: now,
        duration,
        pausedTime: 0,
        totalPausedDuration: 0,
      };

      setCurrentPhase(phase);
      setTimeLeft(duration);

      if (duration > 0 && phase !== "paused") {
        // Start the update loop after a brief delay to ensure state is set
        setTimeout(() => {
          animationFrameRef.current = requestAnimationFrame(updateTimer);
        }, 50);
      }
    },
    [stopTimer, updateTimer]
  );

  // Handle phase transitions
  const handlePhaseEnd = useCallback(() => {
    console.log(
      `Phase ended: ${currentPhase}, round: ${currentRound}, set: ${currentSet}`
    );

    if (currentPhase === "getReady") {
      if (workTime > 0) {
        startPhase("work", workTime);
      } else if (restTime > 0) {
        startPhase("rest", restTime);
      } else {
        setCurrentPhase("done");
        stopTimer();
      }
    } else if (currentPhase === "work") {
      // Quick timer completion
      if (quickTimer && !hasBeepedForCompletion) {
        setHasBeepedForCompletion(true);
        playAudio(highBeep, "high beep (completion)");

        setTimeout(() => {
          setCurrentPhase("start");
          stopTimer();
        }, 500);
        return;
      }

      if (currentRound < rounds) {
        if (restTime > 0) {
          startPhase("rest", restTime);
        } else {
          setCurrentRound((prev) => prev + 1);
          startPhase("work", workTime);
        }
      } else {
        // End of rounds in this set
        if (currentSet < sets) {
          if (setRestTime > 0) {
            startPhase("setRest", setRestTime);
          } else {
            setCurrentSet((prev) => prev + 1);
            setCurrentRound(1);
            startPhase("work", workTime);
          }
        } else {
          setCurrentPhase("done");
          stopTimer();
        }
      }
    } else if (currentPhase === "rest") {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);

      if (nextRound <= rounds) {
        if (workTime > 0) {
          startPhase("work", workTime);
        } else {
          setCurrentPhase("done");
          stopTimer();
        }
      } else {
        // End of rounds, check for set rest
        if (currentSet < sets) {
          if (setRestTime > 0) {
            startPhase("setRest", setRestTime);
          } else {
            setCurrentSet((prev) => prev + 1);
            setCurrentRound(1);
            startPhase("work", workTime);
          }
        } else {
          setCurrentPhase("done");
          stopTimer();
        }
      }
    } else if (currentPhase === "setRest") {
      setCurrentSet((prev) => prev + 1);
      setCurrentRound(1);
      if (workTime > 0) {
        startPhase("work", workTime);
      } else {
        setCurrentPhase("done");
        stopTimer();
      }
    }
  }, [
    currentPhase,
    currentRound,
    currentSet,
    rounds,
    sets,
    workTime,
    restTime,
    setRestTime,
    quickTimer,
    hasBeepedForCompletion,
    highBeep,
    playAudio,
    startPhase,
    stopTimer,
  ]);

  // Handle phase end when timeLeft reaches 0
  useEffect(() => {
    if (
      timeLeft === 0 &&
      currentPhase !== "start" &&
      currentPhase !== "paused" &&
      currentPhase !== "done"
    ) {
      // Only handle phase end if timer state is null (meaning the timer completed naturally)
      if (!timerStateRef.current) {
        handlePhaseEnd();
      }
    }
  }, [timeLeft, currentPhase, handlePhaseEnd]);

  // Safe speech function with error handling
  const speakSafely = useCallback(
    async (text: string) => {
      try {
        // Check if voice is muted in preferences
        if (muteVoice) {
          console.log(
            `Skipping speech "${text}" - voice is muted in preferences`
          );
          return;
        }

        // Stop any ongoing speech to prevent queue buildup
        await Speech.stop();

        // Small delay to ensure speech engine is ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Speak with error handling
        await Speech.speak(text, {
          language: "en-US",
          pitch: 1.0,
          rate: 1.0,
          // Add these options to improve reliability
          onDone: () => console.log(`Speech completed: ${text}`),
          onError: (error) => {
            console.error(`Speech error for "${text}":`, error);
            // Fallback to just audio beeps if speech fails
            playAudio(highBeep, "speech fallback beep");
          },
        });
      } catch (error) {
        console.error(`Failed to speak "${text}":`, error);
        // Fallback to audio beep
        playAudio(highBeep, "speech error fallback");
      }
    },
    [highBeep, playAudio, muteVoice]
  );

  // Speech and sound effects
  useEffect(() => {
    if (quickTimer) return;

    if (currentPhase === "getReady" && timeLeft === 10) {
      speakSafely("Get ready!");
    } else if (currentPhase === "work" && timeLeft === workTime) {
      speakSafely(`Round ${currentRound}`);
    } else if (currentPhase === "rest" && timeLeft === restTime) {
      speakSafely("Rest");
    } else if (currentPhase === "setRest" && timeLeft === setRestTime) {
      speakSafely(`Set ${currentSet} complete. Rest.`);
    } else if (currentPhase === "done") {
      speakSafely("Workout complete!");
    }

    // Work phase announcements
    if (currentPhase === "work") {
      if (timeLeft === 10 && workTime > 10) {
        speakSafely("Ten seconds");
      } else if (timeLeft === Math.floor(workTime / 2) && workTime > 20) {
        speakSafely("Half way there");
      } else if (workTime > 60 && timeLeft > 0 && timeLeft % 60 === 0) {
        speakSafely(`${timeLeft / 60} minute${timeLeft / 60 > 1 ? "s" : ""}`);
      }
    }

    // Countdown beeps for all phases (3, 2, 1) - only if phase duration > 9 seconds
    if (
      currentPhase === "work" ||
      currentPhase === "rest" ||
      currentPhase === "setRest" ||
      currentPhase === "getReady"
    ) {
      // Determine the initial phase duration
      let phaseDuration = 0;
      if (currentPhase === "work") phaseDuration = workTime;
      else if (currentPhase === "rest") phaseDuration = restTime;
      else if (currentPhase === "setRest") phaseDuration = setRestTime;
      else if (currentPhase === "getReady") phaseDuration = 10;

      // Only play countdown if phase is longer than 9 seconds
      if (phaseDuration > 9) {
        // Only play each countdown beep once
        if (timeLeft === 3 && !countdownBeepsRef.current[3]) {
          countdownBeepsRef.current[3] = true;
          playAudio(lowBeep, "countdown 3");
        } else if (timeLeft === 2 && !countdownBeepsRef.current[2]) {
          countdownBeepsRef.current[2] = true;
          playAudio(lowBeep, "countdown 2");
        } else if (timeLeft === 1 && !countdownBeepsRef.current[1]) {
          countdownBeepsRef.current[1] = true;
          playAudio(lowBeep, "countdown 1");
        }
      }
    }

    // Sound effects for phase starts
    if (
      (currentPhase === "work" && timeLeft === workTime && workTime > 0) ||
      (currentPhase === "rest" && timeLeft === restTime && restTime > 0) ||
      (currentPhase === "setRest" &&
        timeLeft === setRestTime &&
        setRestTime > 0)
    ) {
      playAudio(highBeep, `high beep (${currentPhase} start)`);
    }

    // Halfway beep for work
    if (
      currentPhase === "work" &&
      timeLeft === Math.floor(workTime / 2) &&
      workTime > 20
    ) {
      playAudio(lowBeep, "low beep (halfway)");
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
    quickTimer,
    playAudio,
    speakSafely,
  ]);

  // Main timer start function
  const handleStart = useCallback(() => {
    if (skipGetReady) {
      if (workTime > 0) {
        startPhase("work", workTime);
      } else if (restTime > 0) {
        startPhase("rest", restTime);
      } else {
        setCurrentPhase("done");
      }
    } else {
      startPhase("getReady", 10);
    }
  }, [skipGetReady, workTime, restTime, startPhase]);

  // Pause function with high precision
  const handlePause = useCallback(() => {
    const state = timerStateRef.current;
    if (!state || state.phase === "paused") return;

    console.log("Pausing timer");
    stopTimer();

    // Stop any ongoing speech
    Speech.stop();

    const now = Date.now();
    state.pausedTime = now;

    setPhaseBeforePause(currentPhase);
    setCurrentPhase("paused");

    // Update timer state to paused
    timerStateRef.current = {
      ...state,
      phase: "paused",
    };
  }, [currentPhase, stopTimer]);

  // Resume function with high precision
  const handleResume = useCallback(() => {
    const state = timerStateRef.current;
    if (!state || state.phase !== "paused" || !state.pausedTime) return;

    console.log("Resuming timer");

    const now = Date.now();
    const pauseDuration = now - state.pausedTime;

    // Update state with accumulated pause time
    timerStateRef.current = {
      ...state,
      phase: phaseBeforePause,
      totalPausedDuration: state.totalPausedDuration + pauseDuration,
      pausedTime: 0,
    };

    setCurrentPhase(phaseBeforePause);

    // Resume the animation loop
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, [phaseBeforePause, updateTimer]);

  // Reset function
  const handleReset = useCallback(() => {
    console.log("Resetting timer");
    stopTimer();

    timerStateRef.current = null;
    setCurrentRound(1);
    setCurrentSet(1);
    setCurrentPhase("start");
    setTimeLeft(0);
    setHasBeepedForCompletion(false);

    if (quickTimer) {
      handleStart();
    }
  }, [stopTimer, quickTimer, handleStart]);

  // Initialize timer when modal becomes visible
  useEffect(() => {
    if (visible) {
      stopTimer();
      timerStateRef.current = null;
      setCurrentRound(1);
      setCurrentSet(1);
      setCurrentPhase("start");
      setTimeLeft(0);
      setHasBeepedForCompletion(false);

      if (quickTimer) {
        handleStart();
      }
    }
  }, [visible, quickTimer, handleStart, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      Speech.stop(); // Stop any ongoing speech
    };
  }, [stopTimer]);

  return {
    currentRound,
    currentSet,
    currentPhase,
    phaseBeforePause,
    timeLeft,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
  };
};
