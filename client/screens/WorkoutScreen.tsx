import React, { useState, useCallback, useMemo, useEffect } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
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
import { ExerciseCard } from "@/components/ExerciseCard";
import { PullUpCounter } from "@/components/PullUpCounter";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { EXERCISES } from "@/constants/data";
import { addWorkoutLog, addPullUp, getTodayPullUps, generateId } from "@/lib/storage";
import { scheduleWorkoutRewardNotification } from "@/lib/notifications";
import { format } from "date-fns";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [matExtended, setMatExtended] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [pullUpCount, setPullUpCount] = useState(0);

  const timerExercises = useMemo(
    () => EXERCISES.filter((ex) => ex.type !== "counter"),
    []
  );

  const totalDuration = useMemo(
    () => timerExercises.reduce((sum, ex) => sum + ex.duration, 0),
    [timerExercises]
  );

  const completedDuration = useMemo(
    () =>
      timerExercises.filter((ex) => completedExercises.includes(ex.id)).reduce(
        (sum, ex) => sum + ex.duration,
        0
      ),
    [completedExercises, timerExercises]
  );

  useEffect(() => {
    getTodayPullUps().then(setPullUpCount);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExtendMat = () => {
    setMatExtended(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePullUpIncrement = async () => {
    const newCount = await addPullUp();
    setPullUpCount(newCount);
  };

  const handleExerciseComplete = useCallback(
    async (exerciseId: string) => {
      const newCompleted = [...completedExercises, exerciseId];
      setCompletedExercises(newCompleted);
      setActiveExercise(null);

      if (newCompleted.length === timerExercises.length) {
        await addWorkoutLog({
          id: generateId(),
          date: format(new Date(), "yyyy-MM-dd"),
          timestamp: Date.now(),
          exercisesCompleted: newCompleted,
          totalDuration,
        });
        setWorkoutComplete(true);
        setShowSuccess(true);
        
        // Envia notificação de recompensa
        await scheduleWorkoutRewardNotification();
      }
    },
    [completedExercises, totalDuration, timerExercises.length]
  );

  const handleExerciseStart = (exerciseId: string) => {
    setActiveExercise(exerciseId);
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
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>Treino Noturno</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            10 minutos para ficar mais forte
          </ThemedText>
        </View>

        <View style={styles.progressRow}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Progresso
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {completedExercises.length}/{timerExercises.length} exercícios
          </ThemedText>
        </View>

        <AnimatedPressable
          onPress={handleExtendMat}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={matExtended}
          style={animatedStyle}
        >
          <LinearGradient
            colors={
              matExtended
                ? [AppColors.success, AppColors.success]
                : [AppColors.primary, "#7C85FF"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.matButton}
          >
            <Feather
              name={matExtended ? "check" : "activity"}
              size={20}
              color="#FFFFFF"
            />
            <ThemedText style={styles.matButtonText}>
              {matExtended ? "Tapete Estendido!" : "Estender o Tapete"}
            </ThemedText>
          </LinearGradient>
        </AnimatedPressable>

        <View style={styles.pullUpSection}>
          <PullUpCounter count={pullUpCount} onIncrement={handlePullUpIncrement} />
        </View>

        <View style={styles.exerciseList}>
          {timerExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isCompleted={completedExercises.includes(exercise.id)}
              isActive={activeExercise === exercise.id}
              onComplete={() => handleExerciseComplete(exercise.id)}
              onStart={() => handleExerciseStart(exercise.id)}
            />
          ))}
        </View>

        <View style={[styles.tipContainer, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="info" size={16} color={AppColors.gold} />
          <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1 }}>
            Dica: Respire fundo entre os exercícios. Qualidade {">"} Quantidade.
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.timerHeader}>
        <Feather name="clock" size={16} color={theme.textSecondary} />
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {formatTime(completedDuration)} /{formatTime(totalDuration)}
        </ThemedText>
      </View>

      <SuccessAnimation
        visible={showSuccess}
        message="Treino Completo!"
        subMessage="Recompensa Liberada: Shot de Mel"
        onClose={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
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
  timerHeader: {
    position: "absolute",
    top: 52,
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  matButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  matButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  pullUpSection: {
    marginBottom: Spacing.lg,
  },
  exerciseList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
});
