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

interface PullUpCounterProps {
  count: number;
  onIncrement: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PullUpCounter({ count, onIncrement }: PullUpCounterProps) {
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
      withSpring(1.3, { damping: 8, stiffness: 400 }),
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
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: AppColors.purple + "20" },
        ]}
      >
        <Feather name="arrow-up-circle" size={28} color={AppColors.purple} />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.name}>Barra Fixa</ThemedText>
        <ThemedText type="small" style={[styles.description, { color: theme.textSecondary }]}>
          Toque para contar cada repetição
        </ThemedText>
      </View>

      <View style={styles.counterSection}>
        <Animated.View style={countAnimatedStyle}>
          <ThemedText style={[styles.counter, { color: AppColors.purple }]}>
            {count}
          </ThemedText>
        </Animated.View>
        <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
          hoje
        </ThemedText>
      </View>

      <View style={[styles.tapIndicator, { backgroundColor: AppColors.purple }]}>
        <Feather name="plus" size={16} color="#FFFFFF" />
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
    borderWidth: 2,
    borderColor: AppColors.purple + "30",
    borderStyle: "dashed",
  },
  iconContainer: {
    width: 52,
    height: 52,
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
  counterSection: {
    alignItems: "center",
    marginRight: Spacing.md,
  },
  counter: {
    fontSize: 32,
    fontWeight: "700",
  },
  tapIndicator: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
