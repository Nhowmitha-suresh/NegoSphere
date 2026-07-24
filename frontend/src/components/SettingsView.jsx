import React, { useState } from 'react';
import { Settings, Key, Globe, Bell, Shield, Save, CheckCircle2 } from 'lucide-react';
import SecurityCenterView from './SecurityCenterView';
import { playGlassTap } from '../utils/audio';

export default function SettingsView() {
  const [activeSubTab, setActiveSubTab] = useState('security');

  // State
  const [geminiKey, setGeminiKey] = useState('AIzaSyD-••••••••••••••••••••••••');
  const [openaiKey, setOpenaiKey] = useState('sk-proj-••••••••••••••••••••••••');
  const [llmProvider, setLlmProvider] = useState('gemini');
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('INR (₹)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    playGlassTap();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-2 shadow-luxury-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C6A164]/20 text-[#5B4636] text-xs font-bold">
          <Settings className="w-3.5 h-3.5 text-[#C6A164]" />
          <span>NegoSphere OS Configuration</span>
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#34271D]">
          System & Security Settings
        </h2>
        <p className="text-xs text-[#5B4636]">
          Manage authentication security, active device sessions, LLM API keys, and regional settings.
        </p>
      </div>

      {/* Subtabs Header */}
      <div className="flex items-center space-x-2 border-b border-[#5B4636]/10 pb-4 overflow-x-auto text-xs font-bold">
        {[
          { id: 'security', label: 'Security & Device Sessions', icon: Shield },
          { id: 'api', label: 'API Keys & Dual Engine', icon: Key },
          { id: 'regional', label: 'Language & Currency', icon: Globe },
          { id: 'notifications', label: 'Alert Preferences', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { playGlassTap(); setActiveSubTab(tab.id); }}
              className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition ${
                active
                  ? 'bg-white text-[#34271D] shadow-luxury-sm border border-[#C6A164]/40'
                  : 'text-[#5B4636] hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4 text-[#C6A164]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Security Center */}
      {activeSubTab === 'security' && <SecurityCenterView />}

      {/* Render API Keys */}
      {activeSubTab === 'api' && (
        <form onSubmit={handleSave} className="p-8 rounded-3xl glass-card border border-[#5B4636]/10 space-y-6 shadow-luxury-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-[#5B4636]">Google Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold uppercase text-[#5B4636]">OpenAI GPT-4o API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl glass-input text-xs font-mono"
              />
            </div>
          </div>
          <div className="text-right">
            <button type="submit" className="px-6 py-2.5 rounded-xl btn-luxury-gold text-xs font-bold">
              Save Keys
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
