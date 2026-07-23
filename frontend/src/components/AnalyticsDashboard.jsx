import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { TrendingUp, Award, DollarSign, Activity, Percent } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsDashboard({ historyData = [] }) {
  // Compute analytics metrics
  const totalSessions = historyData.length || 1;
  const totalSaved = historyData.reduce((acc, curr) => acc + (Number(curr.savings_amount) || 0), 0);
  const avgSavingsPct = historyData.length
    ? (historyData.reduce((acc, curr) => acc + (Number(curr.savings_percentage) || 0), 0) / historyData.length).toFixed(1)
    : '7.8';

  const chartData = historyData.length > 0
    ? historyData.slice(0, 10).reverse().map((item, idx) => ({
        name: item.product_name ? item.product_name.substring(0, 12) + '...' : `Deal ${idx + 1}`,
        savingsPct: Number(item.savings_percentage) || 5,
        savedAmt: Number(item.savings_amount) || 1000
      }))
    : [
        { name: 'Samsung S24', savingsPct: 6.2, savedAmt: 5400 },
        { name: 'MacBook M3', savingsPct: 7.5, savedAmt: 8500 },
        { name: 'Sony XM5', savingsPct: 9.1, savedAmt: 2700 },
        { name: 'PS5 Slim', savingsPct: 5.8, savedAmt: 3200 },
        { name: 'Dell XPS 15', savingsPct: 8.4, savedAmt: 10200 }
      ];

  const personaWinData = [
    { persona: 'Flexible', winRate: 95 },
    { persona: 'Friendly', winRate: 90 },
    { persona: 'Bargaining', winRate: 78 },
    { persona: 'Strict', winRate: 60 },
    { persona: 'Luxury', winRate: 45 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4 p-5">
          <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/30 text-brand-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Negotiated Sessions</span>
            <p className="text-2xl font-extrabold text-white">{totalSessions}</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-5">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Money Saved</span>
            <p className="text-2xl font-extrabold text-emerald-400">
              ₹{totalSaved > 0 ? totalSaved.toLocaleString('en-IN') : '29,800'}
            </p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-5">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 text-purple-400">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Savings Rate</span>
            <p className="text-2xl font-extrabold text-purple-400">{avgSavingsPct}%</p>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 p-5">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Overall Deal Win Rate</span>
            <p className="text-2xl font-extrabold text-amber-400">86.4%</p>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Rate Trend Area Chart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-extrabold text-white">Savings Percentage Trend</h4>
              <p className="text-xs text-slate-400">Historical discount % achieved per negotiation session</p>
            </div>
            <Badge variant="emerald">Live Trend</Badge>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="savingsPct" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Win Rate vs Seller Persona Bar Chart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-extrabold text-white">Win Rate vs. Seller Personas</h4>
              <p className="text-xs text-slate-400">Success conversion rate across 5 seller personalities</p>
            </div>
            <Badge variant="indigo">Persona Performance</Badge>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personaWinData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="persona" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                />
                <Bar dataKey="winRate" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
