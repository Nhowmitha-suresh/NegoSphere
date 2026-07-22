import React from 'react';
import { Share2, Download, Award, Sparkles, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

export default function DealSummaryCard({ summary, onExportPDF }) {
  if (!summary) return null;

  const card = summary.shareable_card || {};
  const tips = summary.future_strategy_tips || [];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>AI Negotiation Victory Summary</span>
          </h3>
          <p className="text-xs text-slate-400">Shareable outcome card & future tactical roadmap</p>
        </div>
        
        <button
          onClick={onExportPDF}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center space-x-2"
        >
          <Download className="w-4 h-4 text-brand-400" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* Shareable High-Impact Victory Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-brand-950 to-purple-950 border border-brand-500/40 p-6 shadow-2xl shadow-brand-500/10">
        
        {/* Glowing Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black tracking-wider uppercase flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{card.deal_rating || 'S Tier Deal'}</span>
        </div>

        <div className="space-y-4 max-w-lg">
          <div>
            <span className="text-xs font-mono font-bold text-brand-400 uppercase tracking-widest">
              NegoSphere Verified Result
            </span>
            <h2 className="text-2xl font-black text-white mt-1 leading-tight">{card.product_name}</h2>
          </div>

          {/* Money Saved Big Banner */}
          <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-800/80">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Cash Saved</span>
              <p className="text-3xl font-black text-emerald-400">₹{Number(card.money_saved || 0).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Discount Secured</span>
              <p className="text-3xl font-black text-brand-400">{card.savings_percentage || 0}%</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="text-slate-400">Initial Asking Price: </span>
              <span className="line-through text-slate-400 font-semibold">₹{Number(card.initial_price || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400">Negotiated Price: </span>
              <span className="text-white font-extrabold text-sm">₹{Number(card.negotiated_price || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Future Strategy Tips */}
      <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Recommended Next-Step Offline & Cashback Tactics</span>
        </h4>
        <ul className="space-y-2">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 leading-normal">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
