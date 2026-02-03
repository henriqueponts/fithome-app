import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";

interface PostureReminderProps {
  onDismiss?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PostureReminder({ onDismiss }: PostureReminderProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onDismiss}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: AppColors.purpleLight },
        animatedStyle,
      ]}
    >
      <View style={styles.iconContainer}>
        <Feather name="alert-circle" size={18} color={AppColors.purple} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>Queixo paralelo ao chão?</ThemedText>
        <ThemedText type="tiny" style={[styles.subtitle, { color: AppColors.purple }]}>
          Ombros longe das orelhas!
        </ThemedText>
      </View>
      <Feather name="x" size={18} color={AppColors.purple} style={styles.closeIcon} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(124, 77, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.purple,
  },
  subtitle: {
    opacity: 0.8,
  },
  closeIcon: {
    opacity: 0.6,
  },
});
