import React, { useState } from 'react';
import { Swords, Bot, Store, CheckCircle, XCircle, RefreshCw, Sparkles, TrendingDown } from 'lucide-react';

const SELLER_TYPES = [
  { id: 'Flexible', title: 'Flexible Retailer', desc: 'Easygoing, open to discounts' },
  { id: 'Friendly', title: 'Friendly Store Owner', desc: 'Warm, relationship focused' },
  { id: 'Strict', title: 'Strict MAP Vendor', desc: 'Firm minimum price floor' },
  { id: 'Bargaining Expert', title: 'Bargaining Master', desc: 'Step-by-step counter offers' },
  { id: 'Luxury', title: 'Luxury Boutique', desc: 'Emphasizes brand value' }
];

export default function ShowdownArena({ simulation, onRunSimulation, isSimulating }) {
  const [selectedSeller, setSelectedSeller] = useState('Flexible');

  if (!simulation) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4">
        <Swords className="w-12 h-12 text-brand-400 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold text-white">Agent-vs-Agent Showdown Battle Arena</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Watch Buyer AI battle Seller AI in automated turn-based negotiation. Zero human input required.
        </p>
        <button
          onClick={() => onRunSimulation('Assertive', selectedSeller)}
          disabled={isSimulating}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center space-x-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Showdown Battle</span>
        </button>
      </div>
    );
  }

  const { transcript = [], status, initial_price, final_negotiated_price, money_saved, savings_percentage } = simulation;

  const isAccepted = status === 'DEAL_ACCEPTED' || status === 'COUNTER_OFFER_ACCEPTED';

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Status Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Swords className="w-6 h-6 text-brand-400" />
            <h3 className="text-xl font-extrabold text-white">Agent-vs-Agent Showdown Arena</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Autonomous multi-turn negotiation showdown simulation</p>
        </div>

        {/* Seller Personality Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Seller AI:</span>
          {SELLER_TYPES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSeller(s.id);
                onRunSimulation('Assertive', s.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedSeller === s.id
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        <button
          onClick={() => onRunSimulation('Assertive', selectedSeller)}
          disabled={isSimulating}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center space-x-1.5 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>Re-Simulate Showdown</span>
        </button>
      </div>

      {/* Result Metrics Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isAccepted
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
      }`}>
        <div className="flex items-center space-x-3">
          {isAccepted ? (
            <CheckCircle className="w-10 h-10 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-10 h-10 text-rose-400 shrink-0" />
          )}
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40">
              {status.replace(/_/g, ' ')}
            </span>
            <h4 className="text-lg font-extrabold text-white mt-1">
              {isAccepted ? 'Negotiation Victory - Deal Closed!' : 'Negotiation Walkaway'}
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-right">
          <div>
            <span className="text-xs text-slate-400">Initial Ask</span>
            <p className="text-base font-bold text-slate-300">₹{Number(initial_price).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Agreed Price</span>
            <p className="text-xl font-extrabold text-emerald-400">₹{Number(final_negotiated_price).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Total Saved</span>
            <p className="text-xl font-extrabold text-brand-400">
              ₹{Number(money_saved).toLocaleString('en-IN')} ({savings_percentage}%)
            </p>
          </div>
        </div>
      </div>

      {/* Battle Chat Feed */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 max-h-[500px] overflow-y-auto">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
          Live Agent Battle Transcript ({transcript.length} Rounds)
        </h4>

        {transcript.map((item, idx) => {
          const isBuyer = item.speaker === 'Buyer AI';
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${isBuyer ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-lg ${
                isBuyer
                  ? 'bg-brand-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}>
                {isBuyer ? <Bot className="w-5 h-5" /> : <Store className="w-5 h-5" />}
              </div>

              {/* Chat Bubble */}
              <div className={`max-w-[80%] rounded-2xl p-4 border text-sm leading-relaxed ${
                isBuyer
                  ? 'bg-brand-950/40 border-brand-500/30 text-slate-100 rounded-tl-none'
                  : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tr-none'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold mb-1 opacity-80">
                  <span>{item.speaker} ({isBuyer ? item.persona : item.personality})</span>
                  <span className="font-mono text-emerald-400 font-extrabold">₹{Number(item.offered_price).toLocaleString('en-IN')}</span>
                </div>
                <p>{item.message}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
