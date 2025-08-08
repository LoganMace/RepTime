import { useAudioPlayer } from "expo-audio";
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
  const lowBeep = useAudioPlayer(require("../assets/sounds/low-beep.mp3"));
  const highBeep = useAudioPlayer(require("../assets/sounds/high-beep.mp3"));

  // Core state
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("start");
  const [phaseBeforePause, setPhaseBeforePause] = useState<Phase>("start");
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasBeepedForCompletion, setHasBeepedForCompletion] = useState(false);
  
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
  const startPhase = useCallback((phase: Phase, duration: number) => {
    console.log(`Starting phase: ${phase}, duration: ${duration}s`);
    
    stopTimer();
    
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
  }, [stopTimer, updateTimer]);
  
  // Handle phase transitions
  const handlePhaseEnd = useCallback(() => {
    console.log(`Phase ended: ${currentPhase}, round: ${currentRound}, set: ${currentSet}`);

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
        highBeep.seekTo(0);
        highBeep.play();
        
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
          setCurrentRound(prev => prev + 1);
          startPhase("work", workTime);
        }
      } else {
        // End of rounds in this set
        if (currentSet < sets) {
          if (setRestTime > 0) {
            startPhase("setRest", setRestTime);
          } else {
            setCurrentSet(prev => prev + 1);
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
            setCurrentSet(prev => prev + 1);
            setCurrentRound(1);
            startPhase("work", workTime);
          }
        } else {
          setCurrentPhase("done");
          stopTimer();
        }
      }
    } else if (currentPhase === "setRest") {
      setCurrentSet(prev => prev + 1);
      setCurrentRound(1);
      if (workTime > 0) {
        startPhase("work", workTime);
      } else {
        setCurrentPhase("done");
        stopTimer();
      }
    }
  }, [currentPhase, currentRound, currentSet, rounds, sets, workTime, restTime, setRestTime, quickTimer, hasBeepedForCompletion, highBeep, startPhase, stopTimer]);

  // Handle phase end when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && currentPhase !== "start" && currentPhase !== "paused" && currentPhase !== "done") {
      // Only handle phase end if timer state is null (meaning the timer completed naturally)
      if (!timerStateRef.current) {
        handlePhaseEnd();
      }
    }
  }, [timeLeft, currentPhase, handlePhaseEnd]);

  // Speech and sound effects
  useEffect(() => {
    if (quickTimer) return;

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

    // Work phase announcements
    if (currentPhase === "work") {
      if (timeLeft === 10 && workTime > 10) {
        Speech.speak("Ten seconds");
      } else if (timeLeft === Math.floor(workTime / 2) && workTime > 20) {
        Speech.speak("Half way there");
      } else if (workTime > 60 && timeLeft > 0 && timeLeft % 60 === 0) {
        Speech.speak(`${timeLeft / 60} minute${timeLeft / 60 > 1 ? "s" : ""}`);
      }
    }

    // Sound effects for phase starts
    if (
      ((currentPhase === "work" && timeLeft === workTime && workTime > 0) ||
        (currentPhase === "rest" && timeLeft === restTime && restTime > 0) ||
        (currentPhase === "setRest" && timeLeft === setRestTime && setRestTime > 0))
    ) {
      highBeep.seekTo(0);
      highBeep.play();
    }

    // Halfway beep for work
    if (currentPhase === "work" && timeLeft === Math.floor(workTime / 2) && workTime > 20) {
      lowBeep.seekTo(0);
      lowBeep.play();
    }
  }, [currentPhase, currentRound, currentSet, timeLeft, workTime, restTime, setRestTime, highBeep, lowBeep, quickTimer]);

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