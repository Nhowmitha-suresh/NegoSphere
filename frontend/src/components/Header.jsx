import React from 'react';
import { Search, Bell, Sparkles, ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { playGlassTap } from '../utils/audio';

const STEP_NUMBERS = {
  dashboard: '01',
  deal_finder: '02',
  studio: '03',
  market_intel: '04',
  mission_control: '05',
  analytics: '06',
  history: '07',
  reports: '08',
  notifications: '09',
  profile: '10',
  settings: '11'
};

export default function Header({ 
  activeTab, 
  onNavigate, 
  onOpenSearch, 
  onOpenMap, 
  user,
  notificationsCount = 3 
}) {
  const stepNum = STEP_NUMBERS[activeTab] || '01';

  return (
    <header className="sticky top-0 z-30 w-full px-6 py-4 bg-[#F8F6F1]/90 backdrop-blur-xl border-b border-[#7A5C45]/12 flex items-center justify-between shadow-sm select-none">
      
      {/* Back / Next Navigation Controls & Breadcrumbs */}
      <div className="flex items-center space-x-4">
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => { playGlassTap(); onNavigate('dashboard'); }}
            title="Previous View (Escape)"
            className="p-2 rounded-xl bg-white/70 hover:bg-white border border-[#7A5C45]/15 text-[#3F3024] transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { playGlassTap(); onNavigate('studio'); }}
            title="Next View"
            className="p-2 rounded-xl bg-white/70 hover:bg-white border border-[#7A5C45]/15 text-[#3F3024] transition shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator & Breadcrumb */}
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase font-extrabold tracking-widest text-[#7A5C45]">
            <span>Step {stepNum} of 11</span>
            <span>•</span>
            <span className="text-[#C9A76A]">{activeTab.replace('_', ' ')}</span>
          </div>
          <h2 className="text-lg font-bold font-serif text-[#3F3024] capitalize">
            {activeTab.replace('_', ' ')} Workspace
          </h2>
        </div>

      </div>

      {/* Center Command Quick Search Bar Trigger */}
      <button
        onClick={() => { playGlassTap(); onOpenSearch(true); }}
        className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-2xl glass-input text-xs text-[#7A5C45] hover:border-[#C9A76A] transition w-72 sm:w-80 shadow-inner"
      >
        <Search className="w-4 h-4 text-[#7A5C45]" />
        <span className="font-medium flex-1 text-left">Universal Search (Cmd + K)...</span>
        <kbd className="px-2 py-0.5 rounded-md bg-[#EBE5D9] text-[10px] font-mono font-bold text-[#3F3024]">
          ⌘K
        </kbd>
      </button>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-3">
        
        {/* Nearby Interactive Map Trigger */}
        <button
          onClick={() => { playGlassTap(); onOpenMap(true); }}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-[#7A5C45]/15 text-xs font-bold text-[#3F3024] shadow-sm hover:border-[#C9A76A] transition"
        >
          <MapPin className="w-3.5 h-3.5 text-[#C9A76A]" />
          <span>Nearby Map</span>
        </button>

        {/* Dual LLM Engine Status Pill */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#C9A76A]/40 text-xs font-bold text-[#3F3024] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A76A]" />
          <span>Dual Engine Active</span>
        </div>

        {/* Notifications Trigger */}
        <button
          onClick={() => { playGlassTap(); onNavigate('notifications'); }}
          className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-[#7A5C45]/15 text-[#3F3024] transition shadow-sm relative"
        >
          <Bell className="w-4 h-4" />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C9A76A] ring-2 ring-white" />
          )}
        </button>

        {/* Profile Pill */}
        <div 
          onClick={() => { playGlassTap(); onNavigate('profile'); }}
          className="flex items-center space-x-2 p-1.5 pl-3 rounded-2xl bg-white/80 border border-[#7A5C45]/15 shadow-sm cursor-pointer hover:border-[#C9A76A] transition"
        >
          <span className="text-xs font-bold text-[#3F3024] hidden sm:inline">{user?.name || 'Alexander Vance'}</span>
          <div className="w-7 h-7 rounded-xl bg-[#3F3024] text-[#C9A76A] font-serif font-bold text-xs flex items-center justify-center">
            {user?.name ? user.name[0] : 'A'}
          </div>
        </div>

      </div>

    </header>
  );
}
