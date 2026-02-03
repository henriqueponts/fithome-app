import { FoodItem, Exercise, UserStats } from "@/types";
import { AppColors } from "@/constants/theme";

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "pao-nutella",
    name: "Pão + Nutella",
    calories: 350,
    protein: 6,
    icon: "bread-slice",
    color: AppColors.gray200,
  },
  {
    id: "iogurte-granola",
    name: "Iogurte + Granola",
    calories: 280,
    protein: 12,
    icon: "bowl-mix",
    color: AppColors.gray200,
  },
  {
    id: "shake-whey",
    name: "Shake Whey",
    calories: 200,
    protein: 25,
    icon: "glass-cocktail",
    color: AppColors.primaryLight,
  },
  {
    id: "burger-blend",
    name: "Burger Blend",
    calories: 550,
    protein: 35,
    icon: "hamburger",
    color: AppColors.primaryLight,
  },
];

export const ENERGY_BOOST = {
  id: "shot-mel",
  name: "Shot de Mel",
  calories: 64,
  protein: 0,
  icon: "beaker",
  color: AppColors.gold,
};

export const EXERCISES: Exercise[] = [
  {
    id: "barra-fixa",
    name: "Barra Fixa",
    description: "Toque para contar cada repetição",
    duration: 0,
    icon: "arrow-up-circle",
    type: "counter",
  },
  {
    id: "prancha",
    name: "Prancha Abdominal",
    description: "Mantenha o corpo reto como uma tábua",
    duration: 60,
    icon: "meditation",
    type: "timer",
  },
  {
    id: "agachamento",
    name: "Agachamento na Parede",
    description: "Costas na parede, joelhos a 90°",
    duration: 45,
    icon: "seat",
    type: "timer",
  },
  {
    id: "panturrilha",
    name: "Elevação de Panturrilha",
    description: "Suba na ponta dos pés e desça devagar",
    duration: 60,
    icon: "foot-print",
    type: "timer",
  },
];

export const DEFAULT_USER_STATS: UserStats = {
  currentStreak: 0,
  recordStreak: 0,
  streakFreezesAvailable: 2,
  streakFreezesUsed: 0,
  tier: "Ectomorfo Sedentário",
  currentWeight: 50,
  calorieGoal: 2500,
  workoutTime: "22:00",
  shutdownTime: "18:00",
  mealReminders: true,
  postureReminders: true,
};

export const TIERS = [
  { name: "Ectomorfo Sedentário", minDays: 0 },
  { name: "Iniciante Ativo", minDays: 7 },
  { name: "Praticante Regular", minDays: 30 },
  { name: "Atleta Home Office", minDays: 90 },
];

export const DYNAMIC_PHRASES = {
  sunny: {
    type: "loss-framed",
    message: "Não perca o progresso de hoje! Seus músculos precisam desse superávit agora.",
  },
  cloudy: {
    type: "gain-framed", 
    message: "Sinta-se mais forte hoje. Hora do seu Burger Blend para bater a meta!",
  },
};
