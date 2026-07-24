import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, TrendingUp, Calendar, Zap } from 'lucide-react';

const HISTORICAL_DATA = [
  { day: 'Day 1', amazon: 134999, flipkart: 129999, wholesale: 122000, fairTarget: 115000 },
  { day: 'Day 5', amazon: 132999, flipkart: 128999, wholesale: 121000, fairTarget: 114500 },
  { day: 'Day 10', amazon: 131999, flipkart: 127500, wholesale: 120000, fairTarget: 114000 },
  { day: 'Day 15', amazon: 129999, flipkart: 124999, wholesale: 118000, fairTarget: 112000 },
  { day: 'Day 20 (Forecast)', amazon: 127999, flipkart: 122999, wholesale: 116000, fairTarget: 111000 },
  { day: 'Day 30 (Forecast)', amazon: 124999, flipkart: 119999, wholesale: 114000, fairTarget: 110000 }
];

export default function PriceAnalyticsView() {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-2 shadow-luxury-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5 text-[#C9A76A]" />
          <span>Statistical Price Dispersion Engine</span>
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
          Price Analytics & Predictive Forecasting
        </h2>
        <p className="text-xs text-[#6B5E54]">
          30-day probabilistic forecasting models, seasonal discount curves, and multi-vendor dispersion tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Historical & Forecast Chart */}
        <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-4 shadow-luxury-sm">
          <h3 className="text-base font-bold font-serif text-[#3F3024]">Historical Trend & 30-Day Forecast</h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(122, 92, 69, 0.1)" />
                <XAxis dataKey="day" stroke="#7A5C45" fontSize={11} />
                <YAxis stroke="#7A5C45" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#3F3024', border: 'none', borderRadius: '12px', color: '#C9A76A', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="amazon" stroke="#7A5C45" strokeWidth={2} name="Amazon" />
                <Line type="monotone" dataKey="flipkart" stroke="#8F7358" strokeWidth={2} name="Flipkart" />
                <Line type="monotone" dataKey="wholesale" stroke="#C9A76A" strokeWidth={2} name="Wholesale" />
                <Line type="monotone" dataKey="fairTarget" stroke="#10B981" strokeWidth={3} strokeDasharray="5 5" name="AI Fair Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Margin Distribution Bar Chart */}
        <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-4 shadow-luxury-sm">
          <h3 className="text-base font-bold font-serif text-[#3F3024]">Vendor Price Dispersion & Negotiation Margin</h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_DATA}>
                <XAxis dataKey="day" stroke="#7A5C45" fontSize={11} />
                <YAxis stroke="#7A5C45" fontSize={11} />
                <Tooltip contentStyle={{ background: '#3F3024', borderRadius: '12px', color: '#C9A76A' }} />
                <Bar dataKey="amazon" fill="#7A5C45" radius={[6, 6, 0, 0]} />
                <Bar dataKey="wholesale" fill="#C9A76A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
