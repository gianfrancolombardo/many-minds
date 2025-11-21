import { useState, useEffect } from 'react';
import { AppState, Profile, Habit } from '../types';
import { generateId, getTodayISO, calculateStreak } from '../utils/helpers';

const STORAGE_KEY = 'atomic_daily_v2';

const DEFAULT_PROFILE: Profile = {
  id: 'default-1',
  name: 'Mis Hábitos',
  themeColor: 'teal',
  habits: []
};

export const useAppLogic = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Validate and migrate data structure
        if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
          const migratedProfiles = parsed.profiles.map((p: any) => ({
            ...p,
            // Ensure habits is an array
            habits: Array.isArray(p.habits) ? p.habits : [],
            // Ensure themeColor exists (migration for old data)
            themeColor: p.themeColor || 'teal'
          }));

          // Ensure activeProfileId points to an existing profile
          let activeId = parsed.activeProfileId;
          if (!migratedProfiles.find((p: any) => p.id === activeId)) {
            activeId = migratedProfiles[0].id;
          }

          return {
            profiles: migratedProfiles,
            activeProfileId: activeId
          };
        }
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    
    // Default fallback if storage is empty or invalid
    return {
      profiles: [DEFAULT_PROFILE],
      activeProfileId: DEFAULT_PROFILE.id,
    };
  });

  // Persist to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Safety fallback if state is somehow invalid
  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0] || DEFAULT_PROFILE;

  const setActiveProfile = (id: string) => {
    setState(prev => ({ ...prev, activeProfileId: id }));
  };

  const addProfile = (name: string, color: string) => {
    const newProfile: Profile = {
      id: generateId(),
      name,
      themeColor: color,
      habits: []
    };
    setState(prev => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      activeProfileId: newProfile.id
    }));
  };

  const updateProfile = (id: string, updates: Partial<Profile>) => {
     setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };
  
  const deleteProfile = (id: string) => {
    if (state.profiles.length <= 1) return; // Prevent deleting last profile
    setState(prev => {
      const newProfiles = prev.profiles.filter(p => p.id !== id);
      // If we deleted the active profile, switch to the first one
      const nextActiveId = prev.activeProfileId === id ? newProfiles[0].id : prev.activeProfileId;
      return {
        profiles: newProfiles,
        activeProfileId: nextActiveId
      };
    });
  };

  const addHabit = (title: string, icon: string) => {
    const newHabit: Habit = {
      id: generateId(),
      title,
      icon: icon || '📝',
      streak: 0,
      completedDates: []
    };
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id === prev.activeProfileId) {
          return { ...p, habits: [...p.habits, newHabit] };
        }
        return p;
      })
    }));
  };

  const editHabit = (habitId: string, title: string, icon: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== prev.activeProfileId) return p;
        const updatedHabits = p.habits.map(h => 
          h.id === habitId ? { ...h, title, icon } : h
        );
        return { ...p, habits: updatedHabits };
      })
    }));
  };

  const toggleHabit = (habitId: string) => {
    const today = getTodayISO();
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== prev.activeProfileId) return p;

        const updatedHabits = p.habits.map(h => {
          if (h.id !== habitId) return h;

          const isCompleted = h.completedDates.includes(today);
          let newDates;
          
          if (isCompleted) {
            newDates = h.completedDates.filter(d => d !== today);
          } else {
            newDates = [...h.completedDates, today];
          }

          return {
            ...h,
            completedDates: newDates,
            streak: calculateStreak(newDates)
          };
        });
        return { ...p, habits: updatedHabits };
      })
    }));
  };

  const deleteHabit = (habitId: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== prev.activeProfileId) return p;
        return { ...p, habits: p.habits.filter(h => h.id !== habitId) };
      })
    }));
  };

  const reorderHabits = (newHabits: Habit[]) => {
     setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => {
        if (p.id !== prev.activeProfileId) return p;
        return { ...p, habits: newHabits };
      })
    }));
  };

  return {
    state,
    activeProfile,
    setActiveProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    addHabit,
    editHabit,
    toggleHabit,
    deleteHabit,
    reorderHabits
  };
};