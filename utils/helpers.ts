import { Habit } from '../types';

// --- Date Helpers ---

export const getTodayISO = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayISO = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isHabitCompletedToday = (habit: Habit): boolean => {
  return habit.completedDates.includes(getTodayISO());
};

export const calculateStreak = (completedDates: string[]): number => {
  // Simple consecutive day check backwards from today/yesterday
  const today = getTodayISO();
  const yesterday = getYesterdayISO();
  
  const sortedDates = [...completedDates].sort().reverse();
  if (sortedDates.length === 0) return 0;

  let streak = 0;
  let checkDate = new Date(today);
  
  // If not done today, start checking from yesterday
  if (!completedDates.includes(today)) {
     if (!completedDates.includes(yesterday)) {
         return 0; 
     }
     checkDate = new Date(yesterday);
  }

  // Check backwards
  while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const iso = `${year}-${month}-${day}`;

      if (completedDates.includes(iso)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
      } else {
          break;
      }
  }
  return streak;
};

// --- Atomic Habits Microcopy (Spanish) ---

const ENCOURAGEMENT_QUOTES = [
  "Cada acción es un voto por la persona en la que deseas convertirte.",
  "Los hábitos son el interés compuesto de la superación personal.",
  "Hoy cumpliste. Eso importa.",
  "1% mejor cada día.",
  "El éxito es producto de hábitos diarios, no de transformaciones únicas.",
  "Pequeñas victorias, grandes diferencias.",
  "Identidad primero: Soy la clase de persona que...",
  "¡No rompas la cadena!",
  "Pequeños cambios. Resultados notables."
];

const EMPTY_STATE_QUOTES = [
  "Empieza pequeño. ¿Qué es lo único que puedes hacer hoy?",
  "Hazlo obvio. Hazlo atractivo. Hazlo fácil.",
  "El peso más grande en el gimnasio es la puerta de entrada. Añade un hábito para empezar.",
];

export const getMicrocopy = (state: 'empty' | 'progress' | 'completed' | 'streak_broken'): string => {
  if (state === 'empty') {
    return EMPTY_STATE_QUOTES[Math.floor(Math.random() * EMPTY_STATE_QUOTES.length)];
  }
  if (state === 'completed') {
    return "¡Todo listo! Estás construyendo una obra maestra, un día a la vez.";
  }
  if (state === 'streak_broken') {
    return "¿Perdiste un día? No hay problema. Solo retómalo hoy.";
  }
  return ENCOURAGEMENT_QUOTES[Math.floor(Math.random() * ENCOURAGEMENT_QUOTES.length)];
};

// --- UUID ---
export const generateId = () => Math.random().toString(36).substr(2, 9);