import React from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { HabitItem } from './HabitItem';
import { Habit } from '../types';
import { getMicrocopy } from '../utils/helpers';

interface Props {
  habits: Habit[];
  themeColor: string;
  onToggle: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onReorder: (habits: Habit[]) => void;
}

export const HabitList: React.FC<Props> = ({ habits, themeColor, onToggle, onEdit, onDelete, onReorder }) => {
  const today = new Date().toISOString().split('T')[0]; 
  const completedCount = habits.filter(h => h.completedDates.some(d => d.startsWith(today))).length;
  const totalCount = habits.length;
  const isAllDone = totalCount > 0 && completedCount === totalCount;
  
  const progressState = totalCount === 0 
    ? 'empty' 
    : isAllDone 
      ? 'completed' 
      : 'progress';

  return (
    <div className="flex-1 flex flex-col gap-4">
      
      {/* Progress Bar (Moved to Top) */}
      {totalCount > 0 && (
        <div className="mb-2">
          <div className="flex justify-between items-end mb-2 px-1">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tu Progreso</span>
             <span className={`text-xs font-bold text-${themeColor}-600`}>
                {Math.round((completedCount / totalCount) * 100)}%
             </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className={`h-full bg-${themeColor}-500`}
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>
        </div>
      )}

      {/* Atomic Copy Header */}
      <motion.div 
        key={progressState}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[40px] flex items-center justify-center text-center px-4"
      >
        <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
          "{getMicrocopy(progressState)}"
        </p>
      </motion.div>

      {/* Empty State */}
      {totalCount === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-300">
          <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-3xl">🌱</span>
          </div>
          <p className="text-slate-400 font-medium">Sin hábitos aún.</p>
        </div>
      )}

      {/* Draggable List */}
      <Reorder.Group axis="y" values={habits} onReorder={onReorder} className="flex flex-col gap-3 pb-24">
        <AnimatePresence mode='popLayout'>
          {habits.map((habit) => (
            <HabitItem 
              key={habit.id}
              habit={habit}
              themeColor={themeColor}
              onToggle={() => onToggle(habit.id)}
              onEdit={() => onEdit(habit)}
              onDelete={() => onDelete(habit.id)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
};