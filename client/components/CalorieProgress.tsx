import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { useEffect } from "react";

interface CalorieProgressProps {
  consumed: number;
  goal: number;
  protein: number;
}

export function CalorieProgress({ consumed, goal, protein }: CalorieProgressProps) {
  const { theme } = useTheme();
  const progress = Math.min(consumed / goal, 1);
  const remaining = Math.max(goal - consumed, 0);
  const percentage = Math.round(progress * 100);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progress * 100, { damping: 20, stiffness: 90 });
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="target" size={16} color={AppColors.orange} />
          <ThemedText style={styles.headerTitle}>Calorias Hoje</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <Feather name="flag" size={12} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: 4 }}>
            Meta: {goal}
          </ThemedText>
        </View>
      </View>

      <View style={styles.mainStats}>
        <View style={styles.calorieContainer}>
          <ThemedText style={styles.calorieValue}>{consumed}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>kcal</ThemedText>
        </View>
        <View style={[styles.remainingContainer, { backgroundColor: AppColors.tealLight }]}>
          <ThemedText style={[styles.remainingValue, { color: AppColors.teal }]}>
            {remaining}
          </ThemedText>
          <ThemedText type="tiny" style={{ color: AppColors.teal }}>
            restantes
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSecondary }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: AppColors.teal },
              animatedProgressStyle,
            ]}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{protein}g</ThemedText>
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>Proteína</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{percentage}%</ThemedText>
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>Progresso</ThemedText>
        </View>
        <View style={styles.statItem}>
          <Feather name="target" size={16} color={AppColors.teal} />
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>Meta</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainStats: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  calorieContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
  },
  calorieValue: {
    fontSize: 36,
    fontWeight: "700",
  },
  remainingContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  remainingValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressTrack: {
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
