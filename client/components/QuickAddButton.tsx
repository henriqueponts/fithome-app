import React from "react";
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

interface QuickAddButtonProps {
  title: string;
  calories: number;
  protein: number;
  onPress: () => void;
  variant?: "default" | "primary";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuickAddButton({
  title,
  calories,
  protein,
  onPress,
  variant = "default",
}: QuickAddButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 400 }),
      withSpring(1.05, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    runOnJS(triggerHaptic)();
    runOnJS(onPress)();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundColor = variant === "primary" ? AppColors.primaryLight : theme.backgroundDefault;
  const iconName = variant === "primary" ? "zap" : "coffee";

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor },
        animatedStyle,
      ]}
    >
      <View style={styles.iconContainer}>
        <Feather name={iconName} size={24} color={AppColors.primary} />
      </View>
      <ThemedText style={styles.title} numberOfLines={1}>
        {title}
      </ThemedText>
      <ThemedText type="tiny" style={[styles.subtitle, { color: theme.textSecondary }]}>
        {calories} kcal · {protein}g prot
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    minHeight: 100,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(91, 103, 245, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
  },
});
