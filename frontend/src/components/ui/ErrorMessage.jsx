import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ title = 'Pipeline Error', message, onRetry }) => {
  return (
    <div className="bg-rose-950/40 border border-rose-800/50 backdrop-blur-xl rounded-2xl p-6 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-rose-900/50 rounded-xl border border-rose-700/50 text-rose-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-rose-100 text-sm">{title}</h4>
          <p className="text-xs text-rose-300/90 mt-0.5">{message || 'An unexpected error occurred while communicating with NegoSphere agents.'}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-rose-800/60 hover:bg-rose-700/80 text-white rounded-xl border border-rose-600/50 transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Pipeline
        </button>
      )}
    </div>
  );
};
