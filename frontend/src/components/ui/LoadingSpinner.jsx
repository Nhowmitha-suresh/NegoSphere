import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Processing AI pipeline...', subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 animate-ping absolute top-0 left-0"></div>
        <div className="w-16 h-16 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/40 border-b-indigo-500/10 border-l-indigo-500/40 animate-spin flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-slate-100">{message}</h4>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
};
