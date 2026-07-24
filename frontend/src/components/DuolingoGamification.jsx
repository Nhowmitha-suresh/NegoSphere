import React, { useState, useEffect } from 'react';
import { Flame, Gem, Trophy, Sparkles, Award, Zap } from 'lucide-react';

export function DuolingoHeaderBar({ xp = 350, streak = 5, level = 'Bazaar Master' }) {
  return (
    <div className="flex items-center space-x-3 text-xs font-extrabold font-outfit">
      
      {/* Streak Badge */}
      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-bounce-slow shadow-sm">
        <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
        <span>{streak} Day Bargain Streak</span>
      </div>

      {/* XP Gem Badge */}
      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-sm">
        <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400" />
        <span>{xp} XP</span>
      </div>

      {/* Level Badge */}
      <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 shadow-sm">
        <Trophy className="w-4 h-4 text-purple-400" />
        <span>{level}</span>
      </div>

    </div>
  );
}

          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            +50 XP Earned
          </span>
        </div>
        <p className="text-xs text-slate-200 font-medium leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export function DuolingoProgressBar({ currentStep, totalSteps = 8 }) {
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-extrabold text-slate-300">
        <span className="flex items-center space-x-1">
          <Zap className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
          <span>Multi-Agent Mission Progress</span>
        </span>
        <span className="text-brand-400 font-mono">{pct}% Complete</span>
      </div>

      <div className="w-full h-3 bg-slate-900 rounded-full p-0.5 border border-slate-800 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-lg shadow-brand-500/50"
          style={{ width: `${pct}%` }}
        >
          <div className="w-full h-full bg-white/20 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
