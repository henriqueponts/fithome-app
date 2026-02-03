export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  icon: string;
  color: string;
}

export interface FoodLog {
  id: string;
  foodItemId: string;
  timestamp: number;
  calories: number;
  protein: number;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  timestamp: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  icon: string;
  type?: "timer" | "counter";
}

export interface WorkoutLog {
  id: string;
  date: string;
  timestamp: number;
  exercisesCompleted: string[];
  totalDuration: number;
}

export interface PullUpLog {
  id: string;
  date: string;
  count: number;
  timestamp: number;
}

export interface UserStats {
  currentStreak: number;
  recordStreak: number;
  streakFreezesAvailable: number;
  streakFreezesUsed: number;
  tier: string;
  currentWeight: number;
  calorieGoal: number;
  workoutTime: string;
  shutdownTime: string;
  mealReminders: boolean;
  postureReminders: boolean;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  proteinConsumed: number;
  workoutCompleted: boolean;
  pullUpsToday: number;
}
