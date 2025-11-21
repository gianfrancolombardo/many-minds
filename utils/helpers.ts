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
  const today = getTodayISO();
  const yesterday = getYesterdayISO();
  
  const sortedDates = [...completedDates].sort().reverse();
  if (sortedDates.length === 0) return 0;

  let streak = 0;
  let checkDate = new Date(today);
  
  if (!completedDates.includes(today)) {
     if (!completedDates.includes(yesterday)) {
         return 0; 
     }
     checkDate = new Date(yesterday);
  }

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

// --- Analytics Helpers ---

export const calculateBestStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  // Sort chronologically
  const sorted = [...completedDates].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1]);
    const currDate = new Date(sorted[i]);
    
    // Check if strictly consecutive (diff is 1 day)
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays === 1) {
      currentStreak++;
    } else if (diffDays > 1) {
      // Reset if gap is larger than 1 day (ignoring same-day duplicates if any)
      currentStreak = 1;
    }
    // If diffDays === 0 (same day), do nothing, keep streak count

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
  }

  return maxStreak;
};

export const getWeeklyStats = (habits: Habit[]) => {
  const days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    
    let completedCount = 0;
    habits.forEach(h => {
      if (h.completedDates.includes(iso)) completedCount++;
    });

    days.push({
      date: iso,
      dayName: dayName.charAt(0).toUpperCase(), // L, M, X...
      count: completedCount,
      total: habits.length > 0 ? habits.length : 1 // Avoid division by zero
    });
  }
  return days;
};

export const getConsistencyScore = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;
  
  // Check last 30 days
  let totalPossible = 0;
  let totalCompleted = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) {
     const d = new Date(today);
     d.setDate(d.getDate() - i);
     const iso = d.toISOString().split('T')[0];
     
     // We assume the habit existed (simple logic for now)
     totalPossible += habits.length;
     habits.forEach(h => {
       if (h.completedDates.includes(iso)) totalCompleted++;
     });
  }

  return totalPossible === 0 ? 0 : Math.round((totalCompleted / totalPossible) * 100);
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

export const getAnalyticsQuote = (score: number): string => {
  if (score >= 90) return "Eres el arquitecto de tus hábitos. Dominio total.";
  if (score >= 70) return "Estás construyendo inercia. No te detengas.";
  if (score >= 50) return "Estás en el camino. La consistencia vence a la intensidad.";
  if (score > 0) return "Todo gran roble comienza como una bellota. Sigue regando.";
  return "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor es hoy.";
};

// --- UUID ---
export const generateId = () => Math.random().toString(36).substr(2, 9);