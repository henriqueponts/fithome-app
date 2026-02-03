import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { Exercise } from "@/types";

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  isActive: boolean;
  onComplete: () => void;
  onStart: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ExerciseCard({
  exercise,
  isCompleted,
  isActive,
  onComplete,
  onStart,
}: ExerciseCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && !isCompleted && !isRunning) {
      setTimeRemaining(exercise.duration);
    }
  }, [isActive, exercise.duration, isCompleted, isRunning]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onComplete]);

  const handlePress = () => {
    if (isCompleted) return;

    if (!isRunning) {
      setIsRunning(true);
      onStart();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handlePressIn = () => {
    if (!isCompleted) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getIcon = () => {
    switch (exercise.id) {
      case "prancha":
        return "activity";
      case "agachamento":
        return "square";
      case "panturrilha":
        return "arrow-up";
      default:
        return "activity";
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: isCompleted
            ? AppColors.successLight
            : theme.backgroundDefault,
          borderColor: isActive && !isCompleted ? AppColors.primary : "transparent",
          borderWidth: isActive && !isCompleted ? 2 : 0,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isCompleted
              ? AppColors.success + "30"
              : AppColors.orangeGradientStart + "20",
          },
        ]}
      >
        {isCompleted ? (
          <Feather name="check" size={24} color={AppColors.success} />
        ) : (
          <Feather name={getIcon()} size={24} color={AppColors.orangeGradientStart} />
        )}
      </View>

      <View style={styles.content}>
        <ThemedText
          style={[styles.name, isCompleted && { color: AppColors.success }]}
        >
          {exercise.name}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.description, { color: theme.textSecondary }]}
        >
          {exercise.description}
        </ThemedText>
      </View>

      <View style={styles.timerSection}>
        <ThemedText
          style={[
            styles.timer,
            isRunning && { color: AppColors.primary },
            isCompleted && { color: AppColors.success },
          ]}
        >
          {formatTime(timeRemaining)}
        </ThemedText>
        <View
          style={[
            styles.playButton,
            {
              backgroundColor: isCompleted
                ? AppColors.success
                : isRunning
                ? AppColors.primary
                : theme.text,
            },
          ]}
        >
          <Feather
            name={isCompleted ? "check" : isRunning ? "pause" : "play"}
            size={14}
            color="#FFFFFF"
          />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
  },
  timerSection: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  timer: {
    fontSize: 20,
    fontWeight: "700",
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
