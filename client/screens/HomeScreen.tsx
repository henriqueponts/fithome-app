import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, AppColors } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { QuickAddButton } from "@/components/QuickAddButton";
import { EnergyBoostButton } from "@/components/EnergyBoostButton";
import { WorkoutCTA } from "@/components/WorkoutCTA";
import { CalorieProgress } from "@/components/CalorieProgress";
import { StreakCard } from "@/components/StreakCard";
import { WeightChart } from "@/components/WeightChart";
import { PostureReminder } from "@/components/PostureReminder";
import { PullUpWidget } from "@/components/PullUpWidget";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { FOOD_ITEMS, ENERGY_BOOST, DEFAULT_USER_STATS } from "@/constants/data";
import {
  getTodayProgress,
  getUserStats,
  addFoodLog,
  getWeightEntries,
  addPullUp,
  generateId,
} from "@/lib/storage";
import { 
  scheduleCalorieGoalNotification, 
  scheduleStreakReminderNotification 
} from "@/lib/notifications";
import { UserStats, WeightEntry, DailyProgress } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<DailyProgress>({
    date: format(new Date(), "yyyy-MM-dd"),
    caloriesConsumed: 0,
    proteinConsumed: 0,
    workoutCompleted: false,
    pullUpsToday: 0,
  });
  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPosture, setShowPosture] = useState(true);

  const loadData = useCallback(async () => {
    const [todayProgress, userStats, weights] = await Promise.all([
      getTodayProgress(),
      getUserStats(),
      getWeightEntries(),
    ]);
    setProgress(todayProgress);
    setStats(userStats);
    setWeightEntries(weights);

    // Verifica se precisa enviar notificações contextuais
    checkAndSendContextualNotifications(todayProgress, userStats);
  }, []);

  const checkAndSendContextualNotifications = async (
    progress: DailyProgress,
    stats: UserStats
  ) => {
    // Notificação de meta calórica (se faltar menos de 500 kcal e for após 17h)
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 17 && currentHour < 22) {
      const caloriesRemaining = stats.calorieGoal - progress.caloriesConsumed;
      if (caloriesRemaining > 0 && caloriesRemaining <= 500) {
        await scheduleCalorieGoalNotification(caloriesRemaining);
      }
    }

    // Notificação de streak em risco (se não completou treino e é após 20h)
    if (currentHour >= 20 && currentHour < 24 && !progress.workoutCompleted) {
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const hoursUntilMidnight = Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      if (hoursUntilMidnight <= 4) {
        await scheduleStreakReminderNotification(hoursUntilMidnight);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleFoodLog = async (foodId: string, name: string, calories: number, protein: number) => {
    await addFoodLog({
      id: generateId(),
      foodItemId: foodId,
      timestamp: Date.now(),
      calories,
      protein,
    });
    setSuccessMessage(`${name} registrado!`);
    setShowSuccess(true);
    await loadData();
  };

  const handleEnergyBoost = async () => {
    await handleFoodLog(
      ENERGY_BOOST.id,
      ENERGY_BOOST.name,
      ENERGY_BOOST.calories,
      ENERGY_BOOST.protein
    );
  };

  const handlePullUpIncrement = async () => {
    const newCount = await addPullUp();
    setProgress((prev) => ({ ...prev, pullUpsToday: newCount }));
  };

  const handleWorkoutPress = () => {
    navigation.navigate("Workout");
  };

  const today = new Date();
  const greeting = `Olá!`;
  const dateString = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>{greeting}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, textTransform: "capitalize" }}>
            {dateString}
          </ThemedText>
        </View>

        {showPosture ? (
          <PostureReminder onDismiss={() => setShowPosture(false)} />
        ) : null}

        <View style={styles.section}>
          <CalorieProgress
            consumed={progress.caloriesConsumed}
            goal={stats.calorieGoal}
            protein={progress.proteinConsumed}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Registro Rápido</ThemedText>
            <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
              Toque para registrar
            </ThemedText>
          </View>
          <View style={styles.quickAddGrid}>
            {FOOD_ITEMS.slice(0, 2).map((item) => (
              <QuickAddButton
                key={item.id}
                title={item.name}
                calories={item.calories}
                protein={item.protein}
                onPress={() =>
                  handleFoodLog(item.id, item.name, item.calories, item.protein)
                }
              />
            ))}
          </View>
          <View style={styles.quickAddGrid}>
            {FOOD_ITEMS.slice(2, 4).map((item) => (
              <QuickAddButton
                key={item.id}
                title={item.name}
                calories={item.calories}
                protein={item.protein}
                variant="primary"
                onPress={() =>
                  handleFoodLog(item.id, item.name, item.calories, item.protein)
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <EnergyBoostButton onPress={handleEnergyBoost} />
        </View>

        <View style={styles.section}>
          <PullUpWidget 
            count={progress.pullUpsToday} 
            onIncrement={handlePullUpIncrement} 
          />
        </View>

        <View style={styles.section}>
          <WorkoutCTA onPress={handleWorkoutPress} />
        </View>

        <View style={styles.section}>
          <StreakCard
            currentStreak={stats.currentStreak}
            recordStreak={stats.recordStreak}
            freezesAvailable={stats.streakFreezesAvailable}
            tier={stats.tier}
          />
        </View>

        <View style={styles.section}>
          <WeightChart entries={weightEntries} currentWeight={stats.currentWeight} />
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
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.gray700,
  },
  quickAddGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
});
