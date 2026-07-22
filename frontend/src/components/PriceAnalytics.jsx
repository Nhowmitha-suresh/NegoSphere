import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { TrendingDown, Tag, DollarSign, Store, Activity, Target, ExternalLink } from 'lucide-react';

export default function PriceAnalytics({ data }) {
  const [timeframe, setTimeframe] = useState('90d');

  if (!data || !data.analysis) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center text-slate-400">
        <Activity className="w-8 h-8 mx-auto mb-2 text-slate-500 animate-pulse" />
        <p>No price analysis data available. Run a product search to analyze market prices.</p>
      </div>
    );
  }

  const { analysis, price_data } = data;
  const history = price_data?.history_90d || [];
  const vendors = analysis?.sorted_vendors || [];
  const distPoints = analysis?.distribution_points || [];

  const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      
      {/* 1. Key Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Lowest Vendor</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">{formatCurrency(analysis.min_price)}</p>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
            {analysis.lowest_vendor?.vendor_name || 'Best Offer'}
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Highest Price</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-slate-200">{formatCurrency(analysis.max_price)}</p>
          <p className="text-[11px] text-slate-400 truncate mt-1">
            {analysis.highest_vendor?.vendor_name || 'Retail List'}
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Market Average</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-slate-200">{formatCurrency(analysis.avg_price)}</p>
          <p className="text-[11px] text-slate-400 mt-1">StdDev: ±{formatCurrency(analysis.std_dev)}</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Market Median</span>
            <Store className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-slate-200">{formatCurrency(analysis.median_price)}</p>
          <p className="text-[11px] text-slate-400 mt-1">50th Percentile</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-brand-500/30 bg-brand-950/20 col-span-2 sm:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
            <span className="font-semibold text-brand-300">Target Negotiated Bid</span>
            <Target className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-brand-400">{formatCurrency(analysis.recommended_target_price)}</p>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            Est. Savings: {formatCurrency(analysis.avg_price - analysis.recommended_target_price)}
          </p>
        </div>

      </div>

      {/* 2. Price History Trend & Vendor Comparison split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Price History Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <span>Historical Price Snapshot</span>
              </h4>
              <p className="text-xs text-slate-400">Track 90-day retail price movements across Indian vendors</p>
            </div>
            <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {['7d', '30d', '90d'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    timeframe === t ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#F9FAFB' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Market Average']}
                />
                <Area type="monotone" dataKey="price" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#priceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Comparison Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <Store className="w-5 h-5 text-brand-400" />
                <span>Vendor Price Comparison</span>
              </h4>
              <p className="text-xs text-slate-400">Live prices sorted by seller from lowest to highest</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendors} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v/1000}k`} />
                <YAxis dataKey="vendor_name" type="category" stroke="#9CA3AF" tick={{ fontSize: 12 }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#F9FAFB' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Listed Price']}
                />
                <Bar dataKey="price" radius={[0, 6, 6, 0]}>
                  {vendors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. Vendor Price Directory List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-4">Collected Vendor Marketplace Listings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {vendors.map((v, i) => (
            <div key={i} className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-200 text-sm">{v.vendor_name}</span>
                  {i === 0 && (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                      Lowest Vendor
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Rating: ⭐ {v.seller_rating || 4.5} / 5.0</p>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold text-white">{formatCurrency(v.price)}</p>
                {v.scraped_url && (
                  <a
                    href={v.scraped_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-[11px] text-brand-400 hover:underline mt-0.5"
                  >
                    <span>Visit Vendor</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
