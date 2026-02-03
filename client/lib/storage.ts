import AsyncStorage from "@react-native-async-storage/async-storage";
import { FoodLog, WeightEntry, WorkoutLog, UserStats, DailyProgress, PullUpLog } from "@/types";
import { DEFAULT_USER_STATS } from "@/constants/data";
import { format, startOfDay } from "date-fns";

const STORAGE_KEYS = {
  FOOD_LOGS: "food_logs",
  WEIGHT_ENTRIES: "weight_entries",
  WORKOUT_LOGS: "workout_logs",
  USER_STATS: "user_stats",
  DAILY_PROGRESS: "daily_progress",
  PULLUP_LOGS: "pullup_logs",
};

export async function getFoodLogs(): Promise<FoodLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addFoodLog(log: FoodLog): Promise<void> {
  const logs = await getFoodLogs();
  logs.push(log);
  await AsyncStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(logs));
  await updateDailyProgress(log.calories, log.protein);
}

export async function getWeightEntries(): Promise<WeightEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHT_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addWeightEntry(entry: WeightEntry): Promise<void> {
  const entries = await getWeightEntries();
  entries.push(entry);
  await AsyncStorage.setItem(STORAGE_KEYS.WEIGHT_ENTRIES, JSON.stringify(entries));
  
  const stats = await getUserStats();
  stats.currentWeight = entry.weight;
  await saveUserStats(stats);
}

export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addWorkoutLog(log: WorkoutLog): Promise<void> {
  const logs = await getWorkoutLogs();
  logs.push(log);
  await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));
  
  await updateStreak();
  await markWorkoutComplete();
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    return data ? { ...DEFAULT_USER_STATS, ...JSON.parse(data) } : DEFAULT_USER_STATS;
  } catch {
    return DEFAULT_USER_STATS;
  }
}

export async function saveUserStats(stats: UserStats): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}

export async function useStreakFreeze(): Promise<boolean> {
  const stats = await getUserStats();
  if (stats.streakFreezesAvailable > 0) {
    stats.streakFreezesAvailable -= 1;
    stats.streakFreezesUsed += 1;
    await saveUserStats(stats);
    return true;
  }
  return false;
}

async function updateStreak(): Promise<void> {
  const stats = await getUserStats();
  stats.currentStreak += 1;
  if (stats.currentStreak > stats.recordStreak) {
    stats.recordStreak = stats.currentStreak;
  }
  
  const { TIERS } = await import("@/constants/data");
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (stats.currentStreak >= TIERS[i].minDays) {
      stats.tier = TIERS[i].name;
      break;
    }
  }
  
  await saveUserStats(stats);
}

export async function getTodayProgress(): Promise<DailyProgress> {
  try {
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    const allProgress: Record<string, DailyProgress> = data ? JSON.parse(data) : {};
    
    return allProgress[today] || {
      date: today,
      caloriesConsumed: 0,
      proteinConsumed: 0,
      workoutCompleted: false,
      pullUpsToday: 0,
    };
  } catch {
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    return {
      date: today,
      caloriesConsumed: 0,
      proteinConsumed: 0,
      workoutCompleted: false,
      pullUpsToday: 0,
    };
  }
}

async function updateDailyProgress(calories: number, protein: number): Promise<void> {
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
  const allProgress: Record<string, DailyProgress> = data ? JSON.parse(data) : {};
  
  const currentProgress = allProgress[today] || {
    date: today,
    caloriesConsumed: 0,
    proteinConsumed: 0,
    workoutCompleted: false,
    pullUpsToday: 0,
  };
  
  currentProgress.caloriesConsumed += calories;
  currentProgress.proteinConsumed += protein;
  allProgress[today] = currentProgress;
  
  await AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(allProgress));
}

async function markWorkoutComplete(): Promise<void> {
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
  const allProgress: Record<string, DailyProgress> = data ? JSON.parse(data) : {};
  
  const currentProgress = allProgress[today] || {
    date: today,
    caloriesConsumed: 0,
    proteinConsumed: 0,
    workoutCompleted: false,
    pullUpsToday: 0,
  };
  
  currentProgress.workoutCompleted = true;
  allProgress[today] = currentProgress;
  
  await AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(allProgress));
}

export async function addPullUp(): Promise<number> {
  const today = format(startOfDay(new Date()), "yyyy-MM-dd");
  const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
  const allProgress: Record<string, DailyProgress> = data ? JSON.parse(data) : {};
  
  const currentProgress = allProgress[today] || {
    date: today,
    caloriesConsumed: 0,
    proteinConsumed: 0,
    workoutCompleted: false,
    pullUpsToday: 0,
  };
  
  currentProgress.pullUpsToday += 1;
  allProgress[today] = currentProgress;
  
  await AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(allProgress));
  
  return currentProgress.pullUpsToday;
}

export async function getTodayPullUps(): Promise<number> {
  const progress = await getTodayProgress();
  return progress.pullUpsToday || 0;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
