import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView, TextInput, Pressable, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { WeightChart } from "@/components/WeightChart";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { getWeightEntries, addWeightEntry, getUserStats, generateId } from "@/lib/storage";
import { WeightEntry, UserStats } from "@/types";
import { DEFAULT_USER_STATS } from "@/constants/data";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WeightScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [stats, setStats] = useState<UserStats>(DEFAULT_USER_STATS);
  const [showInput, setShowInput] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadData = useCallback(async () => {
    const [weightEntries, userStats] = await Promise.all([
      getWeightEntries(),
      getUserStats(),
    ]);
    setEntries(weightEntries);
    setStats(userStats);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddWeight = async () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) return;

    await addWeightEntry({
      id: generateId(),
      weight,
      date: format(new Date(), "yyyy-MM-dd"),
      timestamp: Date.now(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccess(true);
    setNewWeight("");
    setShowInput(false);
    await loadData();
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

  const recentEntries = [...entries].reverse().slice(0, 7);

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
          <View style={styles.headerLeft}>
            <Feather name="bar-chart-2" size={24} color={AppColors.teal} />
            <ThemedText style={styles.title}>Peso</ThemedText>
          </View>
          <AnimatedPressable
            onPress={() => setShowInput(!showInput)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.addButton,
              { backgroundColor: AppColors.teal },
              animatedStyle,
            ]}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <ThemedText style={styles.addButtonText}>Registrar</ThemedText>
          </AnimatedPressable>
        </View>

        <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.lg }}>
          Acompanhe sua evolução com médias semanais
        </ThemedText>

        {showInput ? (
          <View style={[styles.inputContainer, { backgroundColor: theme.backgroundDefault }]}>
            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundSecondary }]}
              placeholder="Peso (kg)"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              value={newWeight}
              onChangeText={setNewWeight}
            />
            <Pressable
              onPress={handleAddWeight}
              style={[styles.saveButton, { backgroundColor: AppColors.teal }]}
            >
              <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>Salvar</ThemedText>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.section}>
          <WeightChart entries={entries} currentWeight={stats.currentWeight} />
        </View>

        <View style={[styles.ctmInfo, { backgroundColor: AppColors.tealLight }]}>
          <View style={styles.ctmHeader}>
            <Feather name="book-open" size={18} color={AppColors.teal} />
            <ThemedText style={[styles.ctmTitle, { color: AppColors.teal }]}>
              Método CTM
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: AppColors.gray700 }}>
            A linha verde mostra sua <ThemedText type="small" style={{ fontWeight: "700", color: AppColors.gray700 }}>média móvel de 7 dias</ThemedText>. 
            Isso suaviza as flutuações diárias (água, comida) e mostra sua tendência real. 
            Foque nela, não no peso diário!
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Registros Recentes</ThemedText>
          {recentEntries.length > 0 ? (
            recentEntries.map((entry) => (
              <View
                key={entry.id}
                style={[styles.entryItem, { backgroundColor: theme.backgroundDefault }]}
              >
                <View>
                  <ThemedText style={styles.entryWeight}>{entry.weight} kg</ThemedText>
                  <ThemedText type="tiny" style={{ color: theme.textSecondary }}>
                    {format(new Date(entry.timestamp), "d 'de' MMMM, HH:mm", { locale: ptBR })}
                  </ThemedText>
                </View>
                <Feather name="check-circle" size={20} color={AppColors.teal} />
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="trending-up" size={48} color={theme.textSecondary} />
              <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.md }}>
                Nenhum registro ainda.{"\n"}Toque em "Registrar" para começar!
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      <SuccessAnimation
        visible={showSuccess}
        message="Peso registrado!"
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  ctmInfo: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  ctmHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  ctmTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  entryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  entryWeight: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
  },
});
