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
};

export const useTimer = ({
  visible,
  rounds,
  workTime,
  restTime,
  sets,
  setRestTime,
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
        setEndTime(Date.now() + workTime * 1000);
      } else if (restTime > 0) {
        setCurrentPhase("rest");
        setTimeLeft(restTime);
        setEndTime(Date.now() + restTime * 1000);
      } else {
        setCurrentRound((r) => r + 1);
        setCurrentPhase("work");
        setTimeLeft(workTime);
        setEndTime(Date.now() + workTime * 1000);
      }
    } else if (currentPhase === "work") {
      if (currentRound < rounds) {
        if (restTime > 0) {
          setCurrentPhase("rest");
          setTimeLeft(restTime);
          setEndTime(Date.now() + restTime * 1000);
        } else {
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          if (workTime > 0) {
            setCurrentPhase("work");
            setTimeLeft(workTime);
            setEndTime(Date.now() + workTime * 1000);
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
            setTimeLeft(setRestTime);
            setEndTime(Date.now() + setRestTime * 1000);
          } else {
            setCurrentSet((s) => s + 1);
            setCurrentRound(1);
            setCurrentPhase("work");
            setTimeLeft(workTime);
            setEndTime(Date.now() + workTime * 1000);
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
          setTimeLeft(workTime);
          setEndTime(Date.now() + workTime * 1000);
        } else if (restTime > 0) {
          setCurrentPhase("rest");
          setTimeLeft(restTime);
          setEndTime(Date.now() + restTime * 1000);
        } else {
          setCurrentPhase("done");
          setEndTime(null);
        }
      } else {
        // This part might be redundant if the logic in "work" phase end is correct
        if (currentSet < sets) {
          if (setRestTime > 0) {
            setCurrentPhase("setRest");
            setTimeLeft(setRestTime);
            setEndTime(Date.now() + setRestTime * 1000);
          } else {
            setCurrentSet((s) => s + 1);
            setCurrentRound(1);
            setCurrentPhase("work");
            setTimeLeft(workTime);
            setEndTime(Date.now() + workTime * 1000);
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
        setTimeLeft(workTime);
        setEndTime(Date.now() + workTime * 1000);
      } else if (restTime > 0) {
        setCurrentPhase("rest");
        setTimeLeft(restTime);
        setEndTime(Date.now() + restTime * 1000);
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
  ]);

  useEffect(() => {
    if (!visible) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentPhase("start");
      setCurrentRound(1);
      setCurrentSet(1);
      setTimeLeft(0);
      setEndTime(null);
      return;
    }

    if (["start", "paused", "done"].includes(currentPhase) || !endTime) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();

      if (remaining <= 0) {
        setTimeLeft(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        handlePhaseEnd();
      } else {
        setTimeLeft((current) => {
          const newTime = Math.ceil(remaining / 1000);
          if (newTime < current) {
            if ([1, 2, 3].includes(newTime)) {
              lowBeep.seekTo(0);
              lowBeep.play();
            }
          }
          return newTime;
        });
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, currentPhase, endTime, handlePhaseEnd, lowBeep]);

  const handleStart = () => {
    setCurrentPhase("getReady");
    setTimeLeft(10);
    setEndTime(Date.now() + 10 * 1000);
  };

  const handlePause = () => {
    if (endTime) {
      setTimeRemainingOnPause(endTime - Date.now());
    }
    setPhaseBeforePause(currentPhase);
    setCurrentPhase("paused");
  };

  const handleResume = () => {
    setCurrentPhase(phaseBeforePause);
    setEndTime(Date.now() + timeRemainingOnPause);
  };

  return {
    currentRound,
    currentSet,
    currentPhase,
    phaseBeforePause,
    timeLeft,
    handleStart,
    handlePause,
    handleResume,
  };
};
