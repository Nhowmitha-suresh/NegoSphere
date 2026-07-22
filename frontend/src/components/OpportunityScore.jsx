import React from 'react';
import { ShieldAlert, Award, TrendingUp, CheckCircle2, Info } from 'lucide-react';

export default function OpportunityScore({ opportunity }) {
  if (!opportunity) return null;

  const score = opportunity.confidence_score || 85;
  const level = opportunity.opportunity_level || 'Strong';
  const recommendation = opportunity.recommendation || '';
  const factors = opportunity.explanation_factors || [];

  // Determine ring color
  const getScoreColor = (val) => {
    if (val >= 85) return 'stroke-emerald-400 text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (val >= 70) return 'stroke-brand-400 text-brand-400 bg-brand-500/10 border-brand-500/30';
    if (val >= 55) return 'stroke-amber-400 text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'stroke-rose-400 text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const colorClass = getScoreColor(score);
  const strokeDash = 283; // 2 * PI * 45
  const strokeDashoffset = strokeDash - (strokeDash * score) / 100;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Circular Confidence Meter Gauge */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`transition-all duration-1000 ease-out ${colorClass.split(' ')[0]}`}
                strokeWidth="10"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-3xl font-black text-white">{score}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Out of 100</span>
            </div>
          </div>
          
          <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-extrabold uppercase tracking-wide ${colorClass.split(' ').slice(1).join(' ')}`}>
            {level} Opportunity
          </div>
        </div>

        {/* Opportunity Explanation & Recommendation */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-brand-400" />
              <span>Negotiation Headroom & Confidence Score</span>
            </h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">{recommendation}</p>
          </div>

          {/* Factor Cards Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {factors.map((f, i) => (
              <div key={i} className="glass-card p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-slate-200">{f.factor}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-brand-400">
                    {f.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-tight mt-1">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
