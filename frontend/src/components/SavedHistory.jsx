import React from 'react';
import { History, Bookmark, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export default function SavedHistory({ historyData, onSelectProduct }) {
  if (!historyData || historyData.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center text-slate-400">
        <History className="w-10 h-10 mx-auto mb-2 text-slate-500" />
        <h4 className="text-base font-bold text-white">No Saved Negotiations Yet</h4>
        <p className="text-xs text-slate-400 mt-1">Run product searches or simulations to automatically log sessions.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-brand-400" />
            <span>Negotiation Session History</span>
          </h3>
          <p className="text-xs text-slate-400">Review past multi-agent negotiations and outcomes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historyData.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => onSelectProduct(item.product_name)}
            className="glass-card p-4 rounded-xl border border-slate-800 hover:border-brand-500/50 transition cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.status || 'COMPLETED'}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white group-hover:text-brand-400 transition flex items-center justify-between">
              <span className="truncate">{item.product_name}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition shrink-0" />
            </h4>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800/80">
              <div>
                <span className="text-slate-400">Target: </span>
                <span className="font-bold text-emerald-400">₹{Number(item.target_price || 0).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400">Persona: </span>
                <span className="font-semibold text-brand-300">{item.style_persona || 'Assertive'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
