import React, { useState, useEffect } from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { ProfileSwitcher } from './components/ProfileSwitcher';
import { HabitList } from './components/HabitList';
import { HabitModal } from './components/AddHabitModal';
import { Confetti } from './components/Confetti';
import { isHabitCompletedToday, getTodayISO } from './utils/helpers';
import { Habit } from './types';
import clsx from 'clsx';

const App: React.FC = () => {
  const {
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
  } = useAppLogic();

  const [showConfetti, setShowConfetti] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Check for all complete trigger
  useEffect(() => {
    const total = activeProfile.habits.length;
    if (total === 0) return;
    
    const completed = activeProfile.habits.filter(isHabitCompletedToday).length;
    if (completed === total && total > 0) {
      // Simple debounce to prevent spamming confetti on reload
      const hasSeenCelebration = sessionStorage.getItem(`celebrated-${activeProfile.id}-${getTodayISO()}`);
      if (!hasSeenCelebration) {
        setShowConfetti(true);
        sessionStorage.setItem(`celebrated-${activeProfile.id}-${getTodayISO()}`, 'true');
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [activeProfile.habits, activeProfile.id]);

  const handleSaveHabit = (title: string, icon: string) => {
    if (editingHabit) {
      editHabit(editingHabit.id, title, icon);
    } else {
      addHabit(title, icon);
    }
    setEditingHabit(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <Confetti active={showConfetti} />
      
      {/* Header - Full width background, centered content */}
      <header className={clsx(
        "pt-12 pb-6 transition-colors duration-500",
        `bg-${activeProfile.themeColor}-50/50`
      )}>
        <div className="max-w-3xl mx-auto px-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hola, <span className={`text-${activeProfile.themeColor}-600`}>{activeProfile.name}</span>
            </h1>
            <div className="text-xs font-mono text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm capitalize">
              {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
            </div>
          </div>
          
          <ProfileSwitcher 
            profiles={state.profiles} 
            activeProfileId={state.activeProfileId}
            onSwitch={setActiveProfile}
            onAdd={addProfile}
            onUpdate={updateProfile}
            onDelete={deleteProfile}
          />
        </div>
      </header>

      {/* Main Content - Responsive width */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 flex flex-col">
        <HabitList 
          habits={activeProfile.habits}
          themeColor={activeProfile.themeColor}
          onToggle={toggleHabit}
          onEdit={setEditingHabit}
          onDelete={deleteHabit}
          onReorder={reorderHabits}
        />
      </main>

      {/* Floating Action Button & Modal */}
      <HabitModal 
        themeColor={activeProfile.themeColor}
        habitToEdit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={handleSaveHabit}
      />
      
    </div>
  );
};

export default App;