import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Pencil } from 'lucide-react';
import clsx from 'clsx';
import { Habit } from '../types';

interface Props {
  themeColor: string;
  habitToEdit?: Habit | null;
  onClose?: () => void;
  onSave: (title: string, icon: string) => void;
}

const EMOJI_PRESETS = ['📚', '💧', '🏃', '🧘', '🥦', '💊', '✍️', '💡', '🎸', '💰', '🧹', '🛌'];

export const HabitModal: React.FC<Props> = ({ themeColor, habitToEdit, onClose, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState(EMOJI_PRESETS[0]);

  useEffect(() => {
    if (habitToEdit) {
      setIsOpen(true);
      setTitle(habitToEdit.title);
      setIcon(habitToEdit.icon || EMOJI_PRESETS[0]);
    }
  }, [habitToEdit]);

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setIcon(EMOJI_PRESETS[0]);
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title, icon);
      handleClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 z-50"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  {habitToEdit ? 'Editar Hábito' : 'Nuevo Hábito'}
                </h3>
                <button onClick={handleClose} className="p-1 bg-slate-100 rounded-full">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Icono</label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {EMOJI_PRESETS.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setIcon(e)}
                        className={clsx(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all flex-shrink-0",
                          icon === e ? `bg-${themeColor}-100 border-2 border-${themeColor}-500` : "bg-slate-50 border border-slate-100"
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Título del Hábito</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Leer 10 páginas"
                    className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-slate-200 outline-none"
                    autoFocus={!habitToEdit}
                  />
                </div>

                <button 
                  type="submit"
                  className={`w-full py-4 mt-2 rounded-xl font-bold text-white shadow-lg shadow-${themeColor}-500/20 active:scale-95 transition-transform bg-${themeColor}-600`}
                >
                  {habitToEdit ? 'Guardar Cambios' : 'Crear Hábito'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!habitToEdit && (
        <motion.button
          layout
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white z-30 bg-${themeColor}-600 hover:brightness-110 active:scale-90 transition-all`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      )}
    </>
  );
};