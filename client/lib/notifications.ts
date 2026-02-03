import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getUserStats } from './storage';

// Configuração do comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationSchedule {
  id: string;
  title: string;
  body: string;
  trigger: {
    hour: number;
    minute: number;
    repeats: boolean;
  };
}

/**
 * Solicita permissão para enviar notificações
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permissão de notificação negada');
    return false;
  }

  // Configurar canal de notificação para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes FitHome',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5B67F5',
      sound: 'default',
    });
  }

  return true;
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Agenda notificações diárias baseadas nas configurações do usuário
 */
export async function scheduleUserNotifications(): Promise<void> {
  // Cancela notificações antigas
  await cancelAllNotifications();

  const stats = await getUserStats();

  // Verifica permissões
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.warn('Sem permissão para agendar notificações');
    return;
  }

  const schedules: NotificationSchedule[] = [];

  // Lembrete de postura durante horário comercial
  if (stats.postureReminders) {
    schedules.push(
      {
        id: 'posture-morning',
        title: '🧘 Correção de Postura',
        body: 'Ombros longe das orelhas! Respire fundo e alongue.',
        trigger: { hour: 10, minute: 30, repeats: true },
      },
      {
        id: 'posture-afternoon',
        title: '🧘 Lembrete de Postura',
        body: 'Costas retas, pés no chão. Seu corpo agradece!',
        trigger: { hour: 15, minute: 0, repeats: true },
      }
    );
  }

  // Lembretes de refeição
  if (stats.mealReminders) {
    // Determinar se é dia ensolarado ou nublado (simulação baseada em dia da semana)
    const today = new Date().getDay();
    const isSunny = today % 2 === 0;

    const mealMessage = isSunny
      ? 'Não perca o progresso de hoje! Seus músculos precisam desse superávit agora.'
      : 'Sinta-se mais forte hoje. Hora do seu Burger Blend para bater a meta!';

    schedules.push(
      {
        id: 'meal-midmorning',
        title: '🍯 Shot de Mel',
        body: 'Hora do boost de energia para o home office!',
        trigger: { hour: 10, minute: 0, repeats: true },
      },
      {
        id: 'meal-lunch',
        title: '🥗 Hora do Almoço',
        body: mealMessage,
        trigger: { hour: 12, minute: 30, repeats: true },
      },
      {
        id: 'meal-afternoon',
        title: '💪 Lanche da Tarde',
        body: 'Iogurte + Granola para manter a energia!',
        trigger: { hour: 16, minute: 0, repeats: true },
      }
    );
  }

  // Shutdown Ritual - lembrete de treino noturno
  const [shutdownHour, shutdownMinute] = stats.shutdownTime.split(':').map(Number);
  schedules.push({
    id: 'workout-reminder',
    title: '🌙 Shutdown Ritual',
    body: 'Hora de fechar o laptop e fazer os 10 minutos de treino!',
    trigger: { hour: shutdownHour, minute: shutdownMinute, repeats: true },
  });

  // Agenda cada notificação
  for (const schedule of schedules) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: schedule.title,
          body: schedule.body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: schedule.trigger.hour,
          minute: schedule.trigger.minute,
          repeats: schedule.trigger.repeats,
        },
      });
    } catch (error) {
      console.error(`Erro ao agendar notificação ${schedule.id}:`, error);
    }
  }

  console.log(`${schedules.length} notificações agendadas com sucesso`);
}

/**
 * Envia uma notificação imediata
 */
export async function sendImmediateNotification(
  title: string,
  body: string
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null, // Enviar imediatamente
    });
  } catch (error) {
    console.error('Erro ao enviar notificação imediata:', error);
  }
}

/**
 * Agenda lembrete de treino completo (recompensa)
 */
export async function scheduleWorkoutRewardNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Treino Completo!',
        body: 'Recompensa Liberada: Shot de Mel ou Shake de Whey',
        sound: 'default',
      },
      trigger: {
        seconds: 2,
      },
    });
  } catch (error) {
    console.error('Erro ao agendar notificação de recompensa:', error);
  }
}

/**
 * Lista todas as notificações agendadas (debug)
 */
export async function listScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Agenda lembrete de streak em risco
 */
export async function scheduleStreakReminderNotification(hoursUntilMidnight: number): Promise<void> {
  if (hoursUntilMidnight <= 0 || hoursUntilMidnight > 24) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Seu Streak está em Risco!',
        body: `Faltam ${hoursUntilMidnight}h para meia-noite. Complete seu treino hoje!`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: 10,
      },
    });
  } catch (error) {
    console.error('Erro ao agendar lembrete de streak:', error);
  }
}

/**
 * Agenda lembrete de meta calórica
 */
export async function scheduleCalorieGoalNotification(
  caloriesRemaining: number
): Promise<void> {
  if (caloriesRemaining <= 0) return;

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Meta Calórica',
        body: `Faltam ${caloriesRemaining} kcal para atingir sua meta de hoje!`,
        sound: 'default',
      },
      trigger: {
        seconds: 5,
      },
    });
  } catch (error) {
    console.error('Erro ao agendar lembrete de meta:', error);
  }
}

/**
 * Inicializa o sistema de notificações
 */
export async function initializeNotifications(): Promise<void> {
  const hasPermission = await requestNotificationPermissions();
  if (hasPermission) {
    await scheduleUserNotifications();
  }
}
