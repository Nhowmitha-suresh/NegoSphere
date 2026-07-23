import React from 'react';
import { ScoreGauge } from './ui/ScoreGauge';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ShieldCheck, Info, TrendingUp, Layers, Store, Percent } from 'lucide-react';

export default function ScoreExplainabilityCard({ opportunity }) {
  if (!opportunity) return null;

  const {
    confidence_score = 85,
    opportunity_level = 'Strong',
    recommendation = '',
    explanation_factors = [],
    potential_savings_est = 0
  } = opportunity;

  const factors = explanation_factors.length > 0 ? explanation_factors : [
    {
      factor: 'Price Dispersion & Variance',
      impact: 'High',
      detail: 'Significant price spread observed between multi-vendor list prices.'
    },
    {
      factor: 'Vendor Competition Density',
      impact: 'Standard',
      detail: 'Multiple active e-commerce and retail bazaar sellers indexed.'
    },
    {
      factor: 'Retail Margin Headroom',
      impact: 'High',
      detail: 'Current market best is below maximum retail list price.'
    }
  ];

  return (
    <Card hoverEffect={true} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/30 text-brand-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-white">Confidence Score Explainability</h3>
              <Badge variant="emerald">{opportunity_level} Opportunity</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Transparent factor breakdown powering the 0–100 score engine</p>
          </div>
        </div>

        {potential_savings_est > 0 && (
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">Estimated Headroom</span>
            <p className="text-lg font-extrabold text-emerald-400">₹{Number(potential_savings_est).toLocaleString('en-IN')}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Visual Score Radial Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
          <ScoreGauge score={confidence_score} size={130} label="Opportunity Index" />
        </div>

        {/* Explainability Breakdown Factors List */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Algorithm Factor Weights & Rationale</span>
          </h4>

          {factors.map((f, i) => (
            <div key={i} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{f.factor}</span>
                <Badge variant={f.impact === 'High' ? 'emerald' : 'indigo'}>
                  {f.impact} Impact
                </Badge>
              </div>
              <p className="text-xs text-slate-400 leading-snug">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {recommendation && (
        <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 leading-relaxed">
          <span className="font-bold text-white">Strategic Recommendation: </span>
          {recommendation}
        </div>
      )}
    </Card>
  );
}
