import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView, TextInput, Pressable, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { getUserStats, saveUserStats, useStreakFreeze } from "@/lib/storage";
import { scheduleUserNotifications } from "@/lib/notifications";
import { UserStats } from "@/types";
import { DEFAULT_USER_STATS, DYNAMIC_PHRASES } from "@/constants/data";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [calorieGoal, setCalorieGoal] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = useCallback(async () => {
    const userStats = await getUserStats();
    setStats(userStats);
    setCalorieGoal(userStats.calorieGoal.toString());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveGoal = async () => {
    const goal = parseInt(calorieGoal);
    if (isNaN(goal) || goal <= 0) return;

    const newStats = { ...stats, calorieGoal: goal };
    await saveUserStats(newStats);
    setStats(newStats);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSuccessMessage("Meta atualizada!");
    setShowSuccess(true);
  };

  const handleUseFreeze = async () => {
    const success = await useStreakFreeze();
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccessMessage("Freeze usado!");
      setShowSuccess(true);
      await loadData();
    }
  };

  const handleToggle = async (key: "mealReminders" | "postureReminders", value: boolean) => {
    const newStats = { ...stats, [key]: value };
    await saveUserStats(newStats);
    setStats(newStats);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Reagendar notificações com as novas configurações
    await scheduleUserNotifications();
  };

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
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.pageTitle}>Configurações</ThemedText>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: AppColors.orange + "20" }]}>
              <Feather name="target" size={18} color={AppColors.orange} />
            </View>
            <ThemedText style={styles.cardTitle}>Meta Calórica Diária</ThemedText>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundSecondary }]}
              keyboardType="number-pad"
              value={calorieGoal}
              onChangeText={setCalorieGoal}
            />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>kcal</ThemedText>
            <Pressable
              onPress={handleSaveGoal}
              style={[styles.saveButton, { backgroundColor: AppColors.gray800 }]}
            >
              <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>Salvar</ThemedText>
            </Pressable>
          </View>
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
            Recomendado para ganho de peso: 2.300 - 2.800 kcal
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: AppColors.tealLight }]}>
              <Feather name="shield" size={18} color={AppColors.teal} />
            </View>
            <View style={styles.cardHeaderText}>
              <ThemedText style={styles.cardTitle}>Streak Freezes</ThemedText>
              <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
                Proteja sua ofensiva
              </ThemedText>
            </View>
            <ThemedText style={[styles.freezeCount, { color: AppColors.teal }]}>
              {stats.streakFreezesAvailable}
            </ThemedText>
            <ThemedText type="tiny" style={{ color: theme.textSecondary }}>disponíveis</ThemedText>
          </View>
          <AnimatedPressable
            onPress={handleUseFreeze}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={stats.streakFreezesAvailable === 0}
            style={[
              styles.freezeButton,
              { 
                backgroundColor: stats.streakFreezesAvailable > 0 
                  ? AppColors.tealLight 
                  : theme.backgroundSecondary,
                opacity: stats.streakFreezesAvailable > 0 ? 1 : 0.5,
              },
              animatedStyle,
            ]}
          >
            <ThemedText style={[styles.freezeButtonText, { color: AppColors.teal }]}>
              Usar Freeze (dia difícil de trabalho)
            </ThemedText>
          </AnimatedPressable>
          <ThemedText type="tiny" style={{ color: theme.textSecondary, textAlign: "center" }}>
            Você ganha 2 freezes por mês. Use quando não conseguir treinar.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: AppColors.primaryLight }]}>
              <Feather name="bell" size={18} color={AppColors.primary} />
            </View>
            <ThemedText style={styles.cardTitle}>Notificações</ThemedText>
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Feather name="sun" size={16} color={theme.textSecondary} />
              <ThemedText type="small">Lembretes de refeição</ThemedText>
            </View>
            <Switch
              value={stats.mealReminders}
              onValueChange={(value) => handleToggle("mealReminders", value)}
              trackColor={{ false: theme.backgroundSecondary, true: AppColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Feather name="user" size={16} color={theme.textSecondary} />
              <ThemedText type="small">Correção de postura</ThemedText>
            </View>
            <Switch
              value={stats.postureReminders}
              onValueChange={(value) => handleToggle("postureReminders", value)}
              trackColor={{ false: theme.backgroundSecondary, true: AppColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: AppColors.purpleLight }]}>
              <Feather name="link" size={18} color={AppColors.purple} />
            </View>
            <View style={styles.cardHeaderText}>
              <ThemedText style={styles.cardTitle}>Gatilhos de Hábito</ThemedText>
              <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
                Habit Stacking
              </ThemedText>
            </View>
          </View>
          <View style={styles.habitItem}>
            <Feather name="moon" size={16} color={theme.textSecondary} />
            <ThemedText type="small" style={styles.habitLabel}>Horário do treino noturno</ThemedText>
          </View>
          <View style={[styles.habitValue, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText>{stats.workoutTime}</ThemedText>
            <Feather name="clock" size={16} color={theme.textSecondary} />
          </View>
          <ThemedText type="tiny" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
            "Ao fechar o laptop → Hora do Treino"
          </ThemedText>

          <View style={styles.habitItem}>
            <Feather name="log-out" size={16} color={theme.textSecondary} />
            <ThemedText type="small" style={styles.habitLabel}>Shutdown Ritual</ThemedText>
          </View>
          <View style={[styles.habitValue, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText>{stats.shutdownTime}</ThemedText>
            <Feather name="clock" size={16} color={theme.textSecondary} />
          </View>
          <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
            Lembrete de fim de expediente
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: AppColors.purpleLight }]}>
          <View style={styles.cardHeader}>
            <Feather name="message-circle" size={18} color={AppColors.purple} />
            <ThemedText style={[styles.cardTitle, { color: AppColors.purple }]}>
              Frases Dinâmicas
            </ThemedText>
          </View>
          <View style={styles.phraseItem}>
            <View style={[styles.phraseBadge, { backgroundColor: AppColors.gold + "30" }]}>
              <Feather name="sun" size={14} color={AppColors.gold} />
            </View>
            <View style={styles.phraseText}>
              <ThemedText type="small" style={{ fontWeight: "600", color: AppColors.gray800 }}>
                Dia ensolarado:
              </ThemedText>
              <ThemedText type="tiny" style={{ color: AppColors.gray700, fontStyle: "italic" }}>
                "{DYNAMIC_PHRASES.sunny.message}"
              </ThemedText>
            </View>
          </View>
          <View style={styles.phraseItem}>
            <View style={[styles.phraseBadge, { backgroundColor: AppColors.gray400 + "50" }]}>
              <Feather name="cloud" size={14} color={AppColors.gray600} />
            </View>
            <View style={styles.phraseText}>
              <ThemedText type="small" style={{ fontWeight: "600", color: AppColors.gray800 }}>
                Dia nublado:
              </ThemedText>
              <ThemedText type="tiny" style={{ color: AppColors.gray700, fontStyle: "italic" }}>
                "{DYNAMIC_PHRASES.cloudy.message}"
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      <SuccessAnimation
        visible={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  freezeCount: {
    fontSize: 24,
    fontWeight: "700",
  },
  freezeButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  freezeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  habitLabel: {
    flex: 1,
  },
  habitValue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  phraseItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  phraseBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  phraseText: {
    flex: 1,
  },
});
