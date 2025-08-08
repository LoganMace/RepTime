import React, { memo, useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

interface AnimatedCircleProgressProps {
  size: number;
  strokeWidth: number;
  duration: number; // The total duration of the animation in seconds
  isPaused: boolean;
  color?: string;
  backgroundColor?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function AnimatedCircleProgress({
  size,
  strokeWidth,
  duration,
  isPaused,
  color = "#3498db",
  backgroundColor = "#eee",
}: AnimatedCircleProgressProps) {
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const progressValue = useSharedValue(0);

  useEffect(() => {
    // Reset animation when duration changes (new phase)
    progressValue.value = 0;
    
    // This effect handles starting, pausing, and resuming the animation.
    if (isPaused) {
      // If paused, cancel any ongoing animation. The progressValue will hold its current state.
      cancelAnimation(progressValue);
    } else {
      // If not paused (i.e., playing or resuming), start the animation from its current value.
      // Calculate the remaining duration based on the current progress.
      const remainingProgress = 1 - progressValue.value;
      const remainingDuration = duration * 1000 * remainingProgress;

      progressValue.value = withTiming(1, {
        duration: remainingDuration,
        easing: Easing.linear,
      });
    }
  }, [isPaused, duration, progressValue]);

  const animatedProps = useAnimatedProps(() => {
    // This maps the animated value (0 to 1) to the strokeDashoffset.
    // As progressValue.value goes from 0 to 1, strokeDashoffset goes from 0 (full) to circumference (empty).
    const strokeDashoffset = circumference * progressValue.value;
    return {
      strokeDashoffset,
    };
  }, [circumference]);

  return (
    <View>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export default memo(AnimatedCircleProgress);
