import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  active: boolean;
}

const PARTICLES = Array.from({ length: 20 });

export const Confetti: React.FC<Props> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      {PARTICLES.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 1, 
            x: 0, 
            y: 0, 
            scale: Math.random() * 0.5 + 0.5 
          }}
          animate={{ 
            opacity: 0, 
            x: (Math.random() - 0.5) * 400, 
            y: (Math.random() - 0.5) * 400, 
            rotate: Math.random() * 360 
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][i % 4]
          }}
        />
      ))}
    </div>
  );
};