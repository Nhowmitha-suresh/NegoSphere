import React from 'react';
import { Bot, Database, BarChart2, Zap, MessageSquare, Globe, Swords, CheckCircle2, Loader2 } from 'lucide-react';

const AGENTS = [
  { id: 1, name: 'Product Agent', role: 'Taxonomy & Specs Extraction', icon: Bot },
  { id: 2, name: 'Scraper Agent', role: 'Ethical Live & Fallback Scraping', icon: Database },
  { id: 3, name: 'Analysis Agent', role: 'Statistical Price Metrics Engine', icon: BarChart2 },
  { id: 4, name: 'Opportunity Agent', role: '0-100 Negotiation Headroom', icon: Zap },
  { id: 5, name: 'Coach Agent', role: '6-Persona Tactics & Scripts', icon: MessageSquare },
  { id: 6, name: 'Multi-Lang Agent', role: '6-Language Natural Adapter', icon: Globe },
  { id: 7, name: 'Showdown Agent', role: 'Agent-vs-Agent Battle Arena', icon: Swords },
  { id: 8, name: 'Summary Agent', role: 'Shareable Victory Card & Report', icon: CheckCircle2 },
];

export default function AgentPipelineProgress({ currentStep, isComplete }) {
  return (
    <div className="glass-panel p-6 rounded-2xl mb-8 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></span>
            <span>Multi-Agent Orchestrator Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400">8 Autonomous AI agents processing end-to-end negotiation intelligence</p>
        </div>
        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
          {isComplete ? 'Execution Complete (8/8)' : `Processing Step ${currentStep}/8`}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isActive = currentStep === agent.id;
          const isDone = currentStep > agent.id || isComplete;

          return (
            <div
              key={agent.id}
              className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                  : isActive
                  ? 'bg-brand-950/40 border-brand-500/60 text-brand-300 shadow-lg shadow-brand-500/10 scale-105'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800/80">
                  Agent {agent.id}
                </span>
                {isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                ) : isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold truncate text-slate-200">{agent.name}</p>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight mt-0.5">{agent.role}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
