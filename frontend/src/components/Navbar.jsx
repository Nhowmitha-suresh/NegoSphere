import React from 'react';
import { Bot, Sparkles, ShieldCheck, History, BarChart3, Swords, Bookmark, Zap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isLiveMode }) {
  const tabs = [
    { id: 'search', label: 'Deal Finder', icon: Sparkles },
    { id: 'analytics', label: 'Price Analytics', icon: BarChart3 },
    { id: 'coach', label: 'AI Coach & Scripts', icon: Bot },
    { id: 'showdown', label: 'Agent Showdown Arena', icon: Swords },
    { id: 'history', label: 'Saved History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/60 bg-[#0B0F19]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-brand-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-outfit">NegoSphere</span>
              <span className="bg-brand-500/10 text-brand-400 border border-brand-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Showdown AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Multi-Agent Negotiation Coach</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 glass-card p-1.5 rounded-xl border border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Interview & Status Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              {isLiveMode ? 'Multi-Agent Active' : 'Dual-Engine Ready'}
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-gradient-to-r from-emerald-500/10 to-brand-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-lg font-semibold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Deloitte Tech Ready</span>
          </div>
        </div>

      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-800/40 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
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
