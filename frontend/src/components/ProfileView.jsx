import React, { useState } from 'react';
import { User, Shield, Award, DollarSign, CheckCircle2, Zap, Brain, Trash2, Edit3, Plus, Sparkles, MapPin, Store, Tag } from 'lucide-react';
import { playGlassTap } from '../utils/audio';

const INITIAL_AI_MEMORIES = [
  { id: 'mem-1', category: 'Favorite Brands', key: 'Apple & Samsung', detail: 'Prefers 512GB storage models, Space Gray / Titanium finish', date: 'Learned 3 days ago' },
  { id: 'mem-2', category: 'Preferred Bazaars', key: 'Nehru Place & Croma Superstore', detail: 'Prefers physical cash / instant UPI discounts', date: 'Learned 1 week ago' },
  { id: 'mem-3', category: 'Negotiation Style', key: 'Assertive Value Anchor', detail: 'Anchors 14-18% below retail list price, cites competitor wholesale rates', date: 'Learned 2 weeks ago' },
  { id: 'mem-4', category: 'Monthly Budget Limit', key: '₹2,50,000 / month', detail: 'Enterprise procurement threshold', date: 'Configured' },
  { id: 'mem-5', category: 'Travel Distance Limit', key: 'Up to 15 km driving radius', detail: 'Calculates fuel cost vs savings ROI', date: 'Learned 5 days ago' }
];

export default function ProfileView({ user }) {
  const [memories, setMemories] = useState(INITIAL_AI_MEMORIES);
  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryDetail, setNewMemoryDetail] = useState('');

  const handleDeleteMemory = (id) => {
    playGlassTap();
    setMemories(memories.filter((m) => m.id !== id));
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!newMemoryKey.trim()) return;

    playGlassTap();
    setMemories([
      ...memories,
      {
        id: `mem-${Date.now()}`,
        category: 'Custom Preference',
        key: newMemoryKey,
        detail: newMemoryDetail || 'Manually added by user',
        date: 'Just now'
      }
    ]);
    setNewMemoryKey('');
    setNewMemoryDetail('');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Large Profile Card */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel-glow border border-[#C9A76A]/40 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 shadow-luxury">
        <div className="w-24 h-24 rounded-3xl bg-[#3F3024] text-[#C9A76A] font-serif font-bold text-4xl flex items-center justify-center border-2 border-[#C9A76A]/50 shadow-luxury-gold shrink-0">
          {user?.name ? user.name[0] : 'A'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
            <Award className="w-3.5 h-3.5 text-[#C9A76A]" />
            <span>Master AI Procurement Officer</span>
          </div>

          <h2 className="text-3xl font-extrabold font-serif text-[#3F3024]">
            {user?.name || 'Alexander Vance'}
          </h2>
          <p className="text-xs text-[#7A5C45] font-semibold">
            {user?.email || 'executive@company.com'} • Preferred Currency: INR (₹)
          </p>
        </div>
      </div>

      {/* Achievement Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-2 text-center shadow-luxury-sm">
          <div className="text-[10px] uppercase font-extrabold text-[#7A5C45]">Total Lifetime Savings</div>
          <div className="text-2xl font-extrabold font-serif text-[#3F3024]">₹2,48,500</div>
        </div>
        <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-2 text-center shadow-luxury-sm">
          <div className="text-[10px] uppercase font-extrabold text-[#7A5C45]">Deals Negotiated</div>
          <div className="text-2xl font-extrabold font-serif text-[#3F3024]">42 Successful</div>
        </div>
        <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-2 text-center shadow-luxury-sm">
          <div className="text-[10px] uppercase font-extrabold text-[#7A5C45]">AI Reputation Tier</div>
          <div className="text-2xl font-extrabold font-serif text-[#C9A76A]">Diamond Bargainer</div>
        </div>
      </div>

      {/* AI Memory Management Store */}
      <div className="p-8 rounded-3xl bg-white border border-[#C9A76A]/40 space-y-6 shadow-luxury">
        <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#3F3024] text-[#C9A76A] flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#3F3024]">AI Context & Preference Memory</h3>
              <p className="text-xs text-[#7A5C45]">Information learned by NegoSphere AI to personalize negotiation strategies and search results.</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#3F3024] text-xs font-bold font-mono">
            {memories.length} Memories Active
          </span>
        </div>

        {/* List of Remembered Preference Cards */}
        <div className="space-y-3">
          {memories.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl bg-[#F8F6F1] border border-[#7A5C45]/15 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#3F3024] text-[#C9A76A] text-[9px] font-bold font-mono uppercase">{m.category}</span>
                  <strong className="font-serif text-[#3F3024] text-sm">{m.key}</strong>
                </div>
                <p className="text-[#7A5C45]">{m.detail}</p>
                <div className="text-[10px] text-[#7A5C45]/70">{m.date}</div>
              </div>

              <button
                onClick={() => handleDeleteMemory(m.id)}
                title="Forget this memory"
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Memory Form */}
        <form onSubmit={handleAddMemory} className="p-4 rounded-2xl bg-[#F2EEE6] space-y-3 border border-[#7A5C45]/15">
          <div className="text-xs font-bold text-[#3F3024] flex items-center space-x-1.5">
            <Plus className="w-4 h-4 text-[#C9A76A]" />
            <span>Add Custom AI Memory / Preference Instruction</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              value={newMemoryKey}
              onChange={(e) => setNewMemoryKey(e.target.value)}
              placeholder="e.g. 'Prefer HDFC credit card cashbacks'"
              className="px-3 py-2 rounded-xl glass-input text-xs font-semibold text-[#3F3024]"
            />
            <input
              type="text"
              value={newMemoryDetail}
              onChange={(e) => setNewMemoryDetail(e.target.value)}
              placeholder="e.g. 'Always factor 5% instant cashback into target bid'"
              className="px-3 py-2 rounded-xl glass-input text-xs font-semibold text-[#3F3024]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#3F3024] text-[#C9A76A] font-bold text-xs shadow-sm hover:opacity-90 transition"
          >
            Save AI Memory
          </button>
        </form>
      </div>

    </div>
  );
}
