import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl transition-all duration-300',
          hoverEffect && 'hover:border-indigo-500/40 hover:shadow-indigo-500/10 hover:-translate-y-0.5',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
