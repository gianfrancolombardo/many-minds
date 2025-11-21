export interface Habit {
  id: string;
  title: string;
  icon?: string; // Emoji
  streak: number;
  completedDates: string[]; // ISO Date strings (YYYY-MM-DD)
}

export interface Profile {
  id: string;
  name: string;
  themeColor: string; // Tailwind color class prefix (e.g., 'blue', 'rose')
  habits: Habit[];
}

export interface AppState {
  profiles: Profile[];
  activeProfileId: string;
}

export const THEME_COLORS = [
  { name: 'Verde Azulado', value: 'teal', hex: '#14b8a6' },
  { name: 'Pizarra', value: 'slate', hex: '#64748b' },
  { name: 'Rosa', value: 'rose', hex: '#e11d48' },
  { name: 'Naranja', value: 'orange', hex: '#ea580c' },
  { name: 'Azul', value: 'blue', hex: '#2563eb' },
  { name: 'Violeta', value: 'violet', hex: '#7c3aed' },
];