import React, { useState } from 'react';
import { Search, Sparkles, Zap, TrendingUp, DollarSign, Award, Target, ArrowRight, ShieldCheck, Cpu, FileText, Calendar, Bell, Upload, Briefcase, Car, Home, Hotel, Shield, ShoppingCart, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { playGlassTap } from '../utils/audio';

const NEGOTIATION_MODES = [
  { id: 'shopping', label: 'Retail & Electronics', icon: ShoppingCart, desc: 'Laptops, phones, appliances, hardware' },
  { id: 'salary', label: 'Salary & Compensation', icon: Briefcase, desc: 'Base salary, equity, sign-on bonus' },
  { id: 'car', label: 'Dealership & Vehicles', icon: Car, desc: 'New/used cars, accessories, trade-in' },
  { id: 'rental', label: 'Real Estate & Rent', icon: Home, desc: 'Apartment rent, lease agreements' },
  { id: 'travel', label: 'Hotels & Flights', icon: Hotel, desc: 'Corporate hotel rates, group bookings' },
  { id: 'insurance', label: 'Insurance & Claims', icon: Shield, desc: 'Health, auto & commercial coverage' },
];

const STATS = [
  { label: 'Total Money Saved', value: '₹2,48,500', change: '+18.4% this month', icon: DollarSign },
  { label: 'Negotiations Completed', value: '42 Deals', change: '94.2% success rate', icon: Award },
  { label: 'Average Discount Secured', value: '24.8%', change: 'vs retail list', icon: TrendingUp },
  { label: 'AI Decision Metric', value: '98.5%', change: 'Optimal fair value', icon: Target },
];

const SAVINGS_TREND = [
  { month: 'Jan', savings: 32000 },
  { month: 'Feb', savings: 48000 },
  { month: 'Mar', savings: 75000 },
  { month: 'Apr', savings: 110000 },
  { month: 'May', savings: 165000 },
  { month: 'Jun', savings: 248500 }
];

export default function DashboardView({ user, onNavigate, onSearch, onOpenMissionControl }) {
  const [selectedMode, setSelectedMode] = useState('shopping');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top AI Daily Briefing Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#3F3024] via-[#5C4535] to-[#3F3024] text-[#FFFBF5] border border-[#C9A76A]/40 shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#C9A76A] text-[11px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Daily Briefing • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-serif">
            Good Morning, {user?.name || 'Alexander Vance'}.
          </h2>

          <p className="text-xs text-[#EBE5D9] max-w-2xl leading-relaxed">
            3 products on your wishlist dropped in price overnight. 1 preferred coupon expires today at Croma. Estimated potential savings today: <strong className="text-[#C9A76A] font-mono text-sm">₹7,400</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 relative z-10">
          <button
            onClick={() => { playGlassTap(); onNavigate('deal_finder'); }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#C9A76A] via-[#E6C887] to-[#C9A76A] text-[#3F3024] font-extrabold text-xs shadow-luxury hover:opacity-95 transition"
          >
            Review Opportunities
          </button>
          
          <button
            onClick={() => { playGlassTap(); onOpenMissionControl(); }}
            title="Open Developer Mission Control Inspector"
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#C9A76A] border border-[#C9A76A]/30 transition"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Intent Search Card */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel-glow border border-[#C9A76A]/40 space-y-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <h3 className="text-2xl font-serif font-bold text-[#3F3024]">What would you like to negotiate today?</h3>
          <p className="text-xs text-[#7A5C45]">Search products, stores, salary offers, rental agreements, or paste an invoice URL...</p>
        </div>

        {/* Global Intent Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = e.target.query.value;
            if (val.trim()) onSearch(val);
          }}
          className="flex items-center space-x-3 max-w-2xl relative z-10"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#7A5C45] absolute left-4 top-3.5" />
            <input
              name="query"
              type="text"
              placeholder="e.g. 'MacBook Air M4', 'Senior Architect salary offer', 'Croma nearby'..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input text-xs sm:text-sm font-semibold text-[#3F3024]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl btn-luxury-gold text-xs font-extrabold flex items-center space-x-2 shadow-luxury-gold shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Analyze</span>
          </button>
        </form>

        {/* Negotiation Modes Selection Grid */}
        <div className="space-y-3 pt-2 relative z-10">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#7A5C45]">Active Negotiation Mode:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {NEGOTIATION_MODES.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { playGlassTap(); setSelectedMode(m.id); }}
                  className={`p-3 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'bg-[#3F3024] border-[#C9A76A] text-[#C9A76A] shadow-luxury-sm font-bold'
                      : 'bg-white/80 border-[#7A5C45]/15 text-[#3F3024] hover:bg-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#C9A76A]' : 'text-[#7A5C45]'}`} />
                  <div className="text-[11px] font-bold truncate">{m.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="p-6 rounded-3xl glass-card border border-[#7A5C45]/10 space-y-4 shadow-luxury-sm hover:border-[#C9A76A]/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7A5C45] uppercase tracking-wider">{s.label}</span>
                <div className="w-8 h-8 rounded-xl bg-[#3F3024] text-[#C9A76A] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold font-serif text-[#3F3024]">{s.value}</div>
                <div className="text-[10px] text-emerald-700 font-bold pt-1">{s.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cumulative Savings Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Savings Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-[#7A5C45]/10 space-y-4 shadow-luxury-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-[#3F3024]">Cumulative Savings Acceleration</h3>
            <span className="text-xs text-[#C9A76A] font-bold">2026 YTD</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAVINGS_TREND}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A76A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7A5C45" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#7A5C45" fontSize={11} tickLine={false} />
                <YAxis stroke="#7A5C45" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#3F3024', border: 'none', borderRadius: '12px', color: '#C9A76A', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="savings" stroke="#C9A76A" strokeWidth={3} fillOpacity={1} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Intelligence Quick Upload Panel */}
        <div className="p-6 rounded-3xl bg-white border border-[#C9A76A]/40 space-y-4 shadow-luxury-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#3F3024]">
              <FileText className="w-4 h-4 text-[#C9A76A]" />
              <span>Document Intelligence Scanner</span>
            </div>
            <p className="text-[11px] text-[#7A5C45] leading-relaxed">
              Upload salary offers, rental agreements, invoices, or quotes. AI extracts negotiation leverage & identifies risk terms automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-dashed border-[#C9A76A]/50 bg-[#F8F6F1] text-center space-y-2 cursor-pointer hover:bg-[#F2EEE6] transition">
            <Upload className="w-7 h-7 text-[#C9A76A] mx-auto animate-bounce" />
            <div className="text-xs font-bold text-[#3F3024]">Drop Document or Click to Upload</div>
            <div className="text-[10px] text-[#7A5C45]">PDF, PNG, JPG up to 25MB</div>
          </div>

          <button
            onClick={() => { playGlassTap(); onNavigate('studio'); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#3F3024] to-[#5C4535] text-[#C9A76A] text-xs font-bold shadow-luxury"
          >
            Open Negotiation Studio
          </button>
        </div>

      </div>

    </div>
  );
}
