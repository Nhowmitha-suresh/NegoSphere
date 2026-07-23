import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  slate: 'bg-slate-800/80 text-slate-300 border-slate-700'
};

export const Badge = ({ children, variant = 'indigo', className, ...props }) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md transition-colors',
          variants[variant] || variants.indigo,
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
