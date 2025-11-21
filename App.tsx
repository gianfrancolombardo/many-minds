import React, { useState, useEffect } from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { ProfileSwitcher } from './components/ProfileSwitcher';
import { HabitList } from './components/HabitList';
import { AnalyticsView } from './components/AnalyticsView';
import { HabitModal } from './components/AddHabitModal';
import { Confetti } from './components/Confetti';
import { isHabitCompletedToday, getTodayISO } from './utils/helpers';
import { Habit } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ListTodo, BarChart3 } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');

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
      
      {/* Header */}
      <header className={clsx(
        "pt-12 pb-4 transition-colors duration-500",
        `bg-${activeProfile.themeColor}-50/50`
      )}>
        <div className="max-w-3xl mx-auto px-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Hola, <span className={`text-${activeProfile.themeColor}-600`}>{activeProfile.name}</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  "p-2 rounded-lg transition-all relative",
                  viewMode === 'list' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {viewMode === 'list' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-slate-100 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <ListTodo size={20} className="relative z-10" />
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={clsx(
                  "p-2 rounded-lg transition-all relative",
                  viewMode === 'stats' ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                )}
              >
                 {viewMode === 'stats' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-slate-100 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <BarChart3 size={20} className="relative z-10" />
              </button>
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

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-6 flex flex-col">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <HabitList 
                habits={activeProfile.habits}
                themeColor={activeProfile.themeColor}
                onToggle={toggleHabit}
                onEdit={setEditingHabit}
                onDelete={deleteHabit}
                onReorder={reorderHabits}
              />
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyticsView 
                habits={activeProfile.habits}
                themeColor={activeProfile.themeColor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button - Only visible in list mode */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <HabitModal 
            themeColor={activeProfile.themeColor}
            habitToEdit={editingHabit}
            onClose={() => setEditingHabit(null)}
            onSave={handleSaveHabit}
          />
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default App;