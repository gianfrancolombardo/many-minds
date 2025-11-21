import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Trash2, Pencil, Check, X } from 'lucide-react';
import { Profile, THEME_COLORS } from '../types';
import clsx from 'clsx';

interface Props {
  profiles: Profile[];
  activeProfileId: string;
  onSwitch: (id: string) => void;
  onAdd: (name: string, color: string) => void;
  onUpdate: (id: string, updates: Partial<Profile>) => void;
  onDelete: (id: string) => void;
}

export const ProfileSwitcher: React.FC<Props> = ({ profiles, activeProfileId, onSwitch, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  
  // State for creating/editing
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState('teal');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const resetForm = () => {
    setFormName('');
    setFormColor('teal');
    setEditingProfileId(null);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (profile: Profile) => {
    setFormName(profile.name);
    setFormColor(profile.themeColor);
    setEditingProfileId(profile.id);
    setIsAdding(true); // Reuse the add form UI
  };

  const handleSubmit = () => {
    if (!formName.trim()) return;

    if (editingProfileId) {
      onUpdate(editingProfileId, { name: formName, themeColor: formColor });
    } else {
      onAdd(formName, formColor);
    }
    resetForm();
  };

  return (
    <div className="flex flex-col gap-4 mb-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Perfiles</h2>
        <button 
          onClick={() => setIsEditingList(!isEditingList)}
          className={clsx(
            "p-1 transition-colors rounded-full",
            isEditingList ? "text-slate-800 bg-slate-200" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Settings size={16} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar py-4 -mx-6 px-6 items-center">
        <AnimatePresence>
          {profiles.map(profile => {
            const isActive = profile.id === activeProfileId;
            const colorClass = `bg-${profile.themeColor}-500`;
            const ringClass = `ring-${profile.themeColor}-500`;

            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="relative group flex-shrink-0"
              >
                <button
                  onClick={() => {
                    if (isEditingList) {
                      handleStartEdit(profile);
                    } else {
                      onSwitch(profile.id);
                    }
                  }}
                  className={clsx(
                    "flex flex-col items-center gap-2 transition-all duration-200 p-2 rounded-xl min-w-[72px]",
                    isActive ? `bg-white shadow-lg ring-2 ${ringClass} scale-105` : "hover:bg-white/50 opacity-70 hover:opacity-100"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm relative",
                    colorClass
                  )}>
                    {profile.name.charAt(0).toUpperCase()}
                    
                    {/* Edit Indicator Overlay */}
                    {isEditingList && (
                      <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                        <Pencil size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className={clsx("text-xs font-medium truncate max-w-[64px]", isActive ? "text-slate-900" : "text-slate-500")}>
                    {profile.name}
                  </span>
                </button>
                
                {/* Delete Button */}
                {isEditingList && profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(profile.id);
                    }}
                    className="absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors shadow-sm z-10"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Profile Button */}
        {!isEditingList && (
          <button
            onClick={handleStartAdd}
            className="flex flex-col items-center gap-2 p-2 min-w-[72px] opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white/30">
              <Plus size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400">Nuevo</span>
          </button>
        )}
      </div>

      {/* Inline Add/Edit Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                        {editingProfileId ? 'Editar Perfil' : 'Crear Perfil'}
                    </span>
                </div>
                <input
                  type="text"
                  placeholder="Nombre (Ej. Personal)"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-slate-900 placeholder-slate-400 bg-slate-50 border-none rounded-lg p-2 focus:ring-2 focus:ring-slate-200"
                  autoFocus
                />
                <div className="flex gap-2 justify-between items-center">
                  <div className="flex gap-1">
                    {THEME_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setFormColor(c.value)}
                        className={clsx(
                          "w-6 h-6 rounded-full transition-transform",
                          `bg-${c.value}-500`,
                          formColor === c.value ? "scale-125 ring-2 ring-offset-1 ring-slate-300" : "hover:scale-110"
                        )}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={resetForm} className="p-2 text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                    <button onClick={handleSubmit} className="p-2 bg-slate-900 text-white rounded-full">
                        <Check size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};