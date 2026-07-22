import React from 'react';
import { Bot, Sparkles, ShieldCheck, History, BarChart3, Swords, Bookmark, Zap } from 'lucide-react';
import { DuolingoHeaderBar } from './DuolingoGamification';

export default function Navbar({ activeTab, setActiveTab, isLiveMode, xp = 350, streak = 5 }) {
  const tabs = [
    { id: 'search', label: 'Deal Finder', icon: Sparkles },
    { id: 'analytics', label: 'Price Analytics', icon: BarChart3 },
    { id: 'coach', label: 'AI Coach & Scripts', icon: Bot },
    { id: 'showdown', label: 'Agent Showdown Arena', icon: Swords },
    { id: 'history', label: 'Saved History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/60 bg-[#0B0F19]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-emerald-400 p-0.5 shadow-lg shadow-brand-500/20 hover:scale-105 transition">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center text-xl">
              🦉
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-outfit">NegoSphere</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Bazaar AI 🇮🇳
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Indian Negotiation Intelligence</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 glass-card p-1.5 rounded-2xl border border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-600/30 scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Duolingo Gamification Bar & Status Badge */}
        <div className="flex items-center space-x-3">
          <DuolingoHeaderBar xp={xp} streak={streak} />

          <div className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-emerald-500/10 to-brand-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Deloitte Tech</span>
          </div>
        </div>

      </div>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-800/40 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-bold ${
                isActive ? 'bg-brand-600 text-white' : 'text-slate-400 bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
