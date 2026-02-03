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

interface PullUpWidgetProps {
  count: number;
  onIncrement: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PullUpWidget({ count, onIncrement }: PullUpWidgetProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const countScale = useSharedValue(1);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    countScale.value = withSequence(
      withSpring(1.4, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    runOnJS(triggerHaptic)();
    runOnJS(onIncrement)();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const countAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countScale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: AppColors.purple + "15" },
        animatedStyle,
      ]}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: AppColors.purple + "25" }]}>
          <Feather name="arrow-up-circle" size={22} color={AppColors.purple} />
        </View>
        <View>
          <ThemedText style={styles.title}>Barra Fixa</ThemedText>
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
            Toque para +1
          </ThemedText>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Animated.View style={countAnimatedStyle}>
          <ThemedText style={[styles.counter, { color: AppColors.purple }]}>
            {count}
          </ThemedText>
        </Animated.View>
        <View style={[styles.addButton, { backgroundColor: AppColors.purple }]}>
          <Feather name="plus" size={16} color="#FFFFFF" />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  counter: {
    fontSize: 28,
    fontWeight: "700",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
