import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Calendar, Zap } from 'lucide-react';
import { Habit } from '../types';
import { calculateBestStreak, getWeeklyStats, getConsistencyScore, getAnalyticsQuote } from '../utils/helpers';
import clsx from 'clsx';

interface Props {
  habits: Habit[];
  themeColor: string;
}

export const AnalyticsView: React.FC<Props> = ({ habits, themeColor }) => {
  const weeklyStats = getWeeklyStats(habits);
  const consistencyScore = getConsistencyScore(habits);
  const quote = getAnalyticsQuote(consistencyScore);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className={`w-16 h-16 rounded-full bg-${themeColor}-50 flex items-center justify-center mb-4`}>
          <Target className={`text-${themeColor}-500`} size={32} />
        </div>
        <h3 className="text-slate-900 font-bold text-lg mb-2">Sin datos suficientes</h3>
        <p className="text-slate-500 max-w-xs">
          Añade hábitos y empieza a marcarlos para desbloquear tus estadísticas de identidad.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 pb-24"
    >
      {/* Identity Score Card */}
      <motion.div variants={item} className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${themeColor}-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10`}></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Puntuación de Identidad</span>
                <Target size={20} className={`text-${themeColor}-400`} />
            </div>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">{consistencyScore}%</span>
                <span className="text-slate-400 text-sm">últimos 30 días</span>
            </div>
            <p className="text-slate-300 text-sm font-medium italic border-l-2 border-slate-700 pl-3">
                "{quote}"
            </p>
        </div>
      </motion.div>

      {/* Weekly Trend */}
      <motion.div variants={item}>
        <h3 className="text-slate-800 font-bold text-lg mb-4 px-1">Tendencia Semanal</h3>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-end h-32 gap-2">
            {weeklyStats.map((day, i) => {
                const percentage = day.total > 0 ? (day.count / day.total) * 100 : 0;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-slate-100 rounded-lg relative h-full overflow-hidden flex items-end">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${percentage}%` }}
                                transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                                className={clsx(
                                    `w-full rounded-lg min-h-[4px]`,
                                    percentage === 100 ? `bg-${themeColor}-500` : 
                                    percentage > 0 ? `bg-${themeColor}-300` : "bg-slate-200"
                                )}
                            />
                        </div>
                        <span className={clsx(
                            "text-xs font-bold",
                            day.date === new Date().toISOString().split('T')[0] ? "text-slate-900" : "text-slate-400"
                        )}>
                            {day.dayName}
                        </span>
                    </div>
                );
            })}
          </div>
        </div>
      </motion.div>

      {/* Habit Breakdown */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <h3 className="text-slate-800 font-bold text-lg mb-1 px-1">Desglose de Hábitos</h3>
        {habits.map(habit => {
            const bestStreak = calculateBestStreak(habit.completedDates);
            const totalReps = habit.completedDates.length;
            
            return (
                <div key={habit.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl">{habit.icon || '📝'}</span>
                        <span className="font-semibold text-slate-800">{habit.title}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-50 rounded-lg p-2 flex flex-col items-center text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Racha</span>
                            <span className={`text-lg font-bold text-${themeColor}-600`}>{habit.streak}</span>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 flex flex-col items-center text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Mejor</span>
                            <div className="flex items-center gap-1">
                                <Trophy size={12} className="text-yellow-500" />
                                <span className="text-lg font-bold text-slate-700">{bestStreak}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2 flex flex-col items-center text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                            <span className="text-lg font-bold text-slate-700">{totalReps}</span>
                        </div>
                    </div>
                </div>
            );
        })}
      </motion.div>
    </motion.div>
  );
};