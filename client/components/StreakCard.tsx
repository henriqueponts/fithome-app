import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";

interface StreakCardProps {
  currentStreak: number;
  recordStreak: number;
  freezesAvailable: number;
  tier: string;
}

export function StreakCard({
  currentStreak,
  recordStreak,
  freezesAvailable,
  tier,
}: StreakCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Ofensiva Atual</ThemedText>
        <View style={styles.fireIcon}>
          <Feather name="zap" size={20} color={AppColors.orange} />
        </View>
      </View>

      <View style={styles.streakDisplay}>
        <ThemedText style={styles.streakNumber}>{currentStreak}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>dias</ThemedText>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Feather name="award" size={16} color={AppColors.primary} />
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>Recorde</ThemedText>
          <ThemedText style={styles.statValue}>{recordStreak}</ThemedText>
        </View>
        <View style={styles.statBox}>
          <Feather name="shield" size={16} color={AppColors.teal} />
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>Freezes</ThemedText>
          <ThemedText style={styles.statValue}>{freezesAvailable}/2</ThemedText>
        </View>
      </View>

      <View style={[styles.tierBadge, { backgroundColor: AppColors.tealLight }]}>
        <Feather name="star" size={14} color={AppColors.teal} />
        <ThemedText style={[styles.tierText, { color: AppColors.teal }]}>
          Seu Tier: {tier}
        </ThemedText>
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
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
  },
  fireIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.orange + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  streakDisplay: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  tierText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
