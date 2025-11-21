import React from 'react';
import { Reorder, useDragControls, motion } from 'framer-motion';
import { Check, GripVertical, Trash2, Flame, Pencil } from 'lucide-react';
import { Habit } from '../types';
import { isHabitCompletedToday } from '../utils/helpers';
import clsx from 'clsx';

interface Props {
  habit: Habit;
  themeColor: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const HabitItem: React.FC<Props> = ({ habit, themeColor, onToggle, onEdit, onDelete }) => {
  const dragControls = useDragControls();
  const isCompleted = isHabitCompletedToday(habit);

  return (
    <Reorder.Item
      value={habit}
      id={habit.id}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="relative group"
    >
      <motion.div
        layout
        className={clsx(
          "bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 select-none",
          isCompleted && "bg-slate-50/50"
        )}
      >
        {/* Drag Handle */}
        <div
          className="touch-none p-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical size={18} />
        </div>

        {/* Checkbox Area */}
        <button
          onClick={onToggle}
          className="relative outline-none group/check"
          aria-label={`Mark ${habit.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
        >
          <motion.div
            className={clsx(
              "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
              isCompleted 
                ? `bg-${themeColor}-500 border-${themeColor}-500` 
                : "border-slate-200 bg-white group-hover/check:border-slate-300"
            )}
            animate={{ scale: isCompleted ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check size={16} className="text-white stroke-[3]" />
              </motion.div>
            )}
          </motion.div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{habit.icon}</span>
            <motion.h3 
              className={clsx(
                "font-medium text-base truncate transition-colors",
                isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-800"
              )}
            >
              {habit.title}
            </motion.h3>
          </div>
          
          {/* Streak Indicator */}
          {habit.streak > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Flame size={12} className={clsx(isCompleted ? `text-${themeColor}-400` : "text-orange-400")} />
              <span className={clsx("text-xs font-bold", isCompleted ? `text-${themeColor}-400` : "text-slate-500")}>
                {habit.streak} día(s) racha
              </span>
            </div>
          )}
        </div>

        {/* Actions - Visible now */}
        <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <Trash2 size={16} />
            </button>
        </div>

      </motion.div>
    </Reorder.Item>
  );
};