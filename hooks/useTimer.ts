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
  quickTimer?: boolean; // Optional prop for quick timers
};

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

  const [currentRound, setCurrentRound] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("start");
  const [phaseBeforePause, setPhaseBeforePause] = useState<Phase>("start");
  const [timeLeft, setTimeLeft] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeRemainingOnPause, setTimeRemainingOnPause] = useState(0);
  const [hasBeepedForCompletion, setHasBeepedForCompletion] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (skipGetReady) {
      if (workTime > 0) {
        setCurrentPhase("work");
        // Add 1 second to endTime to account for the 1-second display delay
        const endTimeValue = Date.now() + (workTime + 1) * 1000;
        setEndTime(endTimeValue);
        setTimeLeft(workTime);
      } else if (restTime > 0) {
        setCurrentPhase("rest");
        const endTimeValue = Date.now() + (restTime + 1) * 1000;
        setEndTime(endTimeValue);
        setTimeLeft(restTime);
      } else {
        setCurrentPhase("done");
        setEndTime(null);
      }
    } else {
      setCurrentPhase("getReady");
      const endTimeValue = Date.now() + 11 * 1000; // 10 seconds + 1 second display delay
      setEndTime(endTimeValue);
      setTimeLeft(10);
    }
  }, [skipGetReady, workTime, restTime]);

  useEffect(() => {
    // --- Speech Announcements ---
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
      !quickTimer &&
      ((currentPhase === "work" && timeLeft === workTime && workTime > 0) ||
        (currentPhase === "rest" && timeLeft === restTime && restTime > 0) ||
        (currentPhase === "setRest" &&
          timeLeft === setRestTime &&
          setRestTime > 0))
    ) {
      highBeep.seekTo(0);
      highBeep.play();
    }

    if (
      !quickTimer &&
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
    quickTimer,
  ]);

  const handlePhaseEnd = useCallback(() => {
    if (currentPhase === "getReady") {
      if (workTime > 0) {
        setCurrentPhase("work");
        const endTimeValue = Date.now() + (workTime + 1) * 1000;
        setEndTime(endTimeValue);
        setTimeLeft(workTime);
      } else if (restTime > 0) {
        setCurrentPhase("rest");
        const endTimeValue = Date.now() + (restTime + 1) * 1000;
        setEndTime(endTimeValue);
        setTimeLeft(restTime);
      } else {
        setCurrentRound((r) => r + 1);
        setCurrentPhase("work");
        const endTimeValue = Date.now() + (workTime + 1) * 1000;
        setEndTime(endTimeValue);
        setTimeLeft(workTime);
      }
    } else if (currentPhase === "work") {
      // Quick timer completion beep
      if (quickTimer && !hasBeepedForCompletion) {
        setHasBeepedForCompletion(true);
        highBeep.seekTo(0);
        highBeep.play();

        // For quick timers, auto-close after beep instead of showing completion screen
        setTimeout(() => {
          setCurrentPhase("start");
        }, 500); // Small delay to let the beep play
        return;
      }

      if (currentRound < rounds) {
        if (restTime > 0) {
          setCurrentPhase("rest");
          const endTimeValue = Date.now() + (restTime + 1) * 1000;
          setEndTime(endTimeValue);
          setTimeLeft(restTime);
        } else {
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          if (workTime > 0) {
            setCurrentPhase("work");
            const endTimeValue = Date.now() + (workTime + 1) * 1000;
            setEndTime(endTimeValue);
            setTimeLeft(workTime);
          } else {
            setCurrentPhase("done");
            setEndTime(null);
          }
        }
      } else {
        // End of a set
        if (currentSet < sets) {
          if (setRestTime > 0) {
            setCurrentPhase("setRest");
            const endTimeValue = Date.now() + (setRestTime + 1) * 1000;
            setEndTime(endTimeValue);
            setTimeLeft(setRestTime);
          } else {
            setCurrentSet((s) => s + 1);
            setCurrentRound(1);
            setCurrentPhase("work");
            const endTimeValue = Date.now() + (workTime + 1) * 1000;
            setEndTime(endTimeValue);
            setTimeLeft(workTime);
          }
        } else {
          setCurrentPhase("done");
          setEndTime(null);
        }
      }
    } else if (currentPhase === "rest") {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      if (nextRound <= rounds) {
        if (workTime > 0) {
          setCurrentPhase("work");
          const endTimeValue = Date.now() + (workTime + 1) * 1000;
          setEndTime(endTimeValue);
          setTimeLeft(workTime);
        } else if (restTime > 0) {
          setCurrentPhase("rest");
          const endTimeValue = Date.now() + (restTime + 1) * 1000;
          setEndTime(endTimeValue);
          setTimeLeft(restTime);
        } else {
          setCurrentPhase("done");
          setEndTime(null);
        }
      } else {
        // This part might be redundant if the logic in "work" phase end is correct
        if (currentSet < sets) {
          if (setRestTime > 0) {
            setCurrentPhase("setRest");
            const endTimeValue = Date.now() + (setRestTime + 1) * 1000;
            setEndTime(endTimeValue);
            setTimeLeft(setRestTime);
          } else {
            setCurrentSet((s) => s + 1);
            setCurrentRound(1);
            setCurrentPhase("work");
            const endTimeValue = Date.now() + (workTime + 1) * 1000;
            setEndTime(endTimeValue);
            setTimeLeft(workTime);
          }
        } else {
          setCurrentPhase("done");
          setEndTime(null);
        }
      }
    } else if (currentPhase === "setRest") {
      setCurrentSet((s) => s + 1);
      setCurrentRound(1);
      if (workTime > 0) {
        setCurrentPhase("work");
        const endTimeValue = Date.now() + (workTime + 1) * 1000;
        setEndTime(endTimeValue);
        setTimeLeft(workTime);
      } else if (restTime > 0) {
        setCurrentPhase("rest");
        const endTimeValue = Date.now() + (restTime + 1) * 1000;
        setEndTime(endTimeValue);
        setTimeLeft(restTime);
      } else {
        setCurrentPhase("done");
        setEndTime(null);
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
    quickTimer,
    highBeep,
    hasBeepedForCompletion,
  ]);

  const handleStart = useCallback(() => {
    startTimer();
  }, [startTimer]);

  const handlePause = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPhaseBeforePause(currentPhase);
      setCurrentPhase("paused");
      if (endTime) {
        setTimeRemainingOnPause(endTime - Date.now());
      }
    }
  };

  const handleResume = () => {
    if (timeRemainingOnPause > 0) {
      setEndTime(Date.now() + timeRemainingOnPause);
      setCurrentPhase(phaseBeforePause);
      setTimeRemainingOnPause(0);
    }
  };

  const handleReset = useCallback(() => {
    setCurrentRound(1);
    setCurrentSet(1);
    setCurrentPhase("start");
    setTimeLeft(0);
    setEndTime(null);
    setTimeRemainingOnPause(0);
    setHasBeepedForCompletion(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (quickTimer) {
      startTimer();
    }
  }, [quickTimer, startTimer]);

  useEffect(() => {
    if (visible) {
      setCurrentRound(1);
      setCurrentSet(1);
      setCurrentPhase("start");
      setTimeLeft(0);
      setEndTime(null);
      setTimeRemainingOnPause(0);
      setHasBeepedForCompletion(false);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (quickTimer) {
        startTimer();
      }
    }
  }, [visible, quickTimer, startTimer]);

  useEffect(() => {
    if (
      currentPhase !== "start" &&
      currentPhase !== "paused" &&
      currentPhase !== "done"
    ) {
      // Delay the first interval by 1 second so the initial number displays for a full second
      const startDelay = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          if (endTime) {
            const remaining = Math.max(
              0,
              Math.floor((endTime - Date.now()) / 1000)
            );
            setTimeLeft(remaining);
            if (remaining <= 0) {
              handlePhaseEnd();
            }
          }
        }, 250); // Reduced frequency for better performance while maintaining smooth updates
      }, 1000); // 1 second delay before starting the countdown

      return () => {
        clearTimeout(startDelay);
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentPhase, endTime, handlePhaseEnd]);

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
