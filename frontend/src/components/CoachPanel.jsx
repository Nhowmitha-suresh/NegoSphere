import React, { useState } from 'react';
import { Bot, Copy, Check, Globe, Shield, UserCheck, Lightbulb, MessageSquare } from 'lucide-react';

const PERSONAS = [
  { id: 'Assertive', title: 'Assertive & Data-Backed', desc: 'Direct, leverage market benchmarks, firm on numbers.' },
  { id: 'Diplomatic', title: 'Diplomatic & Polite', desc: 'Polite, relationship-building, win-win focused.' },
  { id: 'Budget Conscious', title: 'Budget Conscious', desc: 'Strict spending cap, price sensitive.' },
  { id: 'Premium Buyer', title: 'Premium Buyer', desc: 'High status, quick closing for priority perks.' },
  { id: 'Student', title: 'Student / Scholar', desc: 'Academic discount, budget constraints.' },
  { id: 'Corporate Buyer', title: 'Corporate Procurement', desc: 'B2B GST invoice, volume repeat business.' }
];

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'Hindi', label: 'Hindi (हिंदी)' },
  { id: 'Tamil', label: 'Tamil (தமிழ்)' },
  { id: 'Telugu', label: 'Telugu (తెలుగు)' },
  { id: 'Kannada', label: 'Kannada (കന്നഡ)' },
  { id: 'Malayalam', label: 'Malayalam (മലയാളം)' }
];

export default function CoachPanel({ coachData, multiLangData, onRegenerate, currentPersona, currentLang }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const activePersona = currentPersona || 'Assertive';
  const activeLang = currentLang || 'English';

  const scripts = multiLangData || coachData || {};

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Persona & Language Selection Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        
        {/* 1. Persona Selector Grid */}
        <div>
          <label className="text-sm font-extrabold text-white flex items-center space-x-2 mb-3">
            <UserCheck className="w-4 h-4 text-brand-400" />
            <span>Select Negotiation Strategy Persona (6 Preset Styles)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => onRegenerate(p.id, activeLang)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  activePersona === p.id
                    ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold truncate">{p.title}</p>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-tight">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Language Selector Pills */}
        <div>
          <label className="text-sm font-extrabold text-white flex items-center space-x-2 mb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Select Regional Negotiation Language (6 Supported Languages)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => onRegenerate(activePersona, l.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                  activeLang === l.id
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Generated Scripts Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Opening Line Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2 space-y-4">
          
          {/* Opening Hook */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Primary Opening Hook Message</span>
              </span>
              <button
                onClick={() => handleCopy(scripts.opening_line || '', 'opening')}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 transition"
              >
                {copiedKey === 'opening' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'opening' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 font-medium text-sm leading-relaxed">
              "{scripts.opening_line || 'Select a persona to generate custom negotiation opening message.'}"
            </div>
          </div>

          {/* Followup Tactic */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Follow-Up Closing Tactic</span>
              <button
                onClick={() => handleCopy(scripts.followup_script || '', 'followup')}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 transition"
              >
                {copiedKey === 'followup' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'followup' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm leading-relaxed">
              "{scripts.followup_script || ''}"
            </div>
          </div>

          {/* Objection Handler */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Seller Pushback & Objection Handler</span>
              <button
                onClick={() => handleCopy(scripts.objection_response || '', 'objection')}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 transition"
              >
                {copiedKey === 'objection' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'objection' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm leading-relaxed">
              "{scripts.objection_response || ''}"
            </div>
          </div>

        </div>

        {/* Tactical Advice Sidebar */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Strategic Tactics ({activePersona})</span>
          </h4>
          
          <div className="space-y-3">
            {(coachData?.key_tactics || []).map((tactic, idx) => (
              <div key={idx} className="glass-card p-3 rounded-xl border border-slate-800 flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-normal">{tactic}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
