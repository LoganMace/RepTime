import React, { memo, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  cancelAnimation,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

interface AnimatedCircleProgressProps {
  size: number;
  strokeWidth: number;
  duration: number; // Total phase duration in seconds
  timeLeft: number; // Current time remaining in seconds
  isPaused: boolean;
  phaseId?: string; // Unique identifier for phase changes
  color?: string;
  backgroundColor?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function AnimatedCircleProgress({
  size,
  strokeWidth,
  duration,
  timeLeft,
  isPaused,
  phaseId,
  color = "#3498db",
  backgroundColor = "#eee",
}: AnimatedCircleProgressProps) {
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  
  // Internal animation progress (always running)
  const animationProgress = useSharedValue(0);
  
  // Shared values for pause state
  const isPausedValue = useSharedValue(isPaused);
  const pausedAtValue = useSharedValue(0);
  
  // Track phase changes
  const lastPhaseIdRef = useRef<string>("");
  
  // Update pause state
  useEffect(() => {
    isPausedValue.value = isPaused;
  }, [isPaused, isPausedValue]);
  
  // Handle phase changes
  useEffect(() => {
    const currentPhaseId = phaseId || `${duration}`;
    const isNewPhase = currentPhaseId !== lastPhaseIdRef.current && currentPhaseId !== "";
    
    if (isNewPhase && duration > 0) {
      lastPhaseIdRef.current = currentPhaseId;
      
      // Reset animation for new phase
      cancelAnimation(animationProgress);
      animationProgress.value = 0;
      pausedAtValue.value = 0;
      
      // Start continuous animation
      animationProgress.value = withTiming(1, {
        duration: duration * 1000,
        easing: Easing.linear,
      });
    }
  }, [phaseId, duration, animationProgress, pausedAtValue]);
  
  // Handle pause by storing current position
  useEffect(() => {
    if (isPaused) {
      // Store current animation position when pausing
      pausedAtValue.value = animationProgress.value;
    } else {
      // When resuming, continue animation from where we left off
      if (pausedAtValue.value > 0 && duration > 0) {
        // Calculate exact remaining duration based on animation progress
        const remainingProgress = 1 - pausedAtValue.value;
        const remainingDuration = remainingProgress * duration * 1000;
        
        if (remainingDuration > 0) {
          cancelAnimation(animationProgress);
          // Set to paused position first
          animationProgress.value = pausedAtValue.value;
          // Then animate to completion with exact timing
          animationProgress.value = withTiming(1, {
            duration: remainingDuration,
            easing: Easing.linear,
          });
        } else {
          // If no time remaining, complete immediately
          animationProgress.value = 1;
        }
      }
    }
  }, [isPaused, duration, animationProgress, pausedAtValue]);
  
  // Derived value that handles pause logic
  const displayProgress = useDerivedValue(() => {
    if (isPausedValue.value) {
      // When paused, show the paused position
      return pausedAtValue.value;
    } else {
      // When not paused, show current animation progress
      return animationProgress.value;
    }
  }, []);
  
  // Animated props using the display progress
  const animatedProps = useAnimatedProps(() => {
    // For SVG circle: strokeDashoffset starts at circumference (empty) and goes to 0 (full)
    // Our progress goes from 0 (start) to 1 (complete)
    // So we need to invert: offset = circumference - (progress * circumference)
    const offset = circumference - (circumference * displayProgress.value);
    return {
      strokeDashoffset: offset,
    };
  }, [circumference]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimation(animationProgress);
    };
  }, [animationProgress]);
  
  return (
    <View>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress circle */}
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

export default memo(AnimatedCircleProgress, (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size &&
    prevProps.strokeWidth === nextProps.strokeWidth &&
    prevProps.duration === nextProps.duration &&
    prevProps.isPaused === nextProps.isPaused &&
    prevProps.phaseId === nextProps.phaseId &&
    prevProps.color === nextProps.color &&
    prevProps.backgroundColor === nextProps.backgroundColor
  );
});