import React, { useState } from 'react';
import { Send, Bot, User, CheckCircle2, Zap, Shield, Sparkles, Layers, SlidersHorizontal, FileText, LineChart, MessageSquare, History, Check, Play, AlertCircle, ArrowUpRight, Scale, Users, Building2 } from 'lucide-react';
import { playGlassTap, playSuccessChime } from '../utils/audio';

const NEGOTIATION_MODES = [
  'Shopping',
  'Business Procurement',
  'Salary Negotiation',
  'Freelancer Contracts',
  'Car Purchase',
  'House Rental',
  'Real Estate',
  'Hotel Booking',
  'Travel Packages',
  'Insurance Quotes'
];

const WORKSPACE_TABS = [
  { id: 'negotiation', label: 'Live Battle Stream' },
  { id: 'digital_twin', label: 'Digital Twin Strategies' },
  { id: 'timeline', label: 'Execution Timeline' },
  { id: 'analytics', label: 'Probability Analytics' }
];

const DIGITAL_TWIN_STRATEGIES = [
  {
    id: 'aggressive',
    name: 'Aggressive Anchor Strategy',
    icon: Zap,
    badge: 'MAX SAVINGS',
    expected_savings: '₹18,000 (14.2%)',
    success_probability: '72%',
    risk_level: 'Moderate Risk of Walkaway',
    reasoning: 'Anchor 18% below seller asking price. Leverage nearby wholesale bazaar cash prices and threaten competitor walkaway.',
    opening_script: 'Spoke with Nehru Place wholesalers offering in-stock units at ₹1,12,000. If you can match ₹1,12,000 with immediate payment, I will close today.'
  },
  {
    id: 'balanced',
    name: 'Balanced Value Strategy',
    icon: Scale,
    badge: 'RECOMMENDED',
    expected_savings: '₹14,500 (11.5%)',
    success_probability: '89%',
    risk_level: 'Low Risk',
    reasoning: 'Propose fair market median price while requesting bundled accessories (case, screen protection) or extended warranty.',
    opening_script: 'I am ready to finalize purchase at ₹1,15,500. Can we include official brand warranty and clear protection case to seal the deal?'
  },
  {
    id: 'relationship',
    name: 'Relationship & Loyalty Strategy',
    icon: Users,
    badge: 'HIGH CLOSING',
    expected_savings: '₹11,000 (8.8%)',
    success_probability: '96%',
    risk_level: 'Very Low Risk',
    reasoning: 'Focus on recurring corporate business potential and long-term customer relationship.',
    opening_script: 'We procure 10+ hardware units quarterly for our enterprise. If you offer ₹1,18,000 today, we will make your store our primary vendor.'
  },
  {
    id: 'corporate',
    name: 'Corporate Terms Strategy',
    icon: Building2,
    badge: 'ENTERPRISE',
    expected_savings: '₹15,000 (12.0%)',
    success_probability: '84%',
    risk_level: 'Low Risk',
    reasoning: 'Utilize corporate GST invoice tax credit matching, corporate card instant cashbacks, and no-cost EMI incentives.',
    opening_script: 'Fulfilling via corporate GST account with HDFC instant card cashbacks. Matching ₹1,15,000 net after invoice tax adjustments.'
  }
];

const LIVE_EXECUTION_STAGES = [
  { stage: 'Agent 1: Product Taxonomy Extraction', status: 'complete', detail: 'Extracted brand, category, model variant (Samsung S24 Ultra 512GB)' },
  { stage: 'Agent 2: Ethical Web & Places Scraping', status: 'complete', detail: 'Collected live prices from Croma, Amazon, Reliance Digital & Nehru Place' },
  { stage: 'Agent 3: Statistical Dispersion Modeling', status: 'complete', detail: 'Min: ₹1,14,000 | Max: ₹1,34,999 | Avg: ₹1,24,500 | Variance: Gaussian PDF' },
  { stage: 'Agent 4: Opportunity Confidence Scoring', status: 'complete', detail: '0-100 Headroom Score: 88 (High Margin Available)' },
  { stage: 'Agent 5: Persona Strategy Generation', status: 'complete', detail: 'Generated 4 Digital Twin strategy options (Aggressive, Balanced, Relationship, Corporate)' },
  { stage: 'Agent 6: Multi-Lingual Adaptation', status: 'complete', detail: 'Script translated into English, Hindi & Tamil' },
  { stage: 'Agent 7: Agent-vs-Agent Battle Showdown', status: 'running', detail: 'Streaming live counter proposals with Seller AI persona...' },
  { stage: 'Agent 8: Executive Summary & PDF Export', status: 'pending', detail: 'Preparing final victory card and downloadable PDF report' }
];

export default function NegotiationStudioView({ pipelineData }) {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('digital_twin');
  const [selectedMode, setSelectedMode] = useState('Shopping');
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Negotiation Session Initialized for Samsung S24 Ultra (512GB). Listed Retail Price: ₹1,29,999.', time: '14:00' },
    { id: 2, sender: 'User', text: 'Hi! I want to purchase the S24 Ultra today. My budget target is ₹1,12,000.', time: '14:01' },
    { id: 3, sender: 'Seller AI', text: 'Welcome! ₹1,12,000 is too low for a brand new 512GB unit. Best I can offer right now is ₹1,24,999 with official warranty.', time: '14:02' },
    { id: 4, sender: 'AI Negotiator', text: 'Strategy Recommendation: Counter at ₹1,14,500 by citing competitor pricing at Nehru Place wholesale market and offering instant UPI settlement.', time: '14:02' },
    { id: 5, sender: 'Market AI', text: 'Market Data Alert: Median wholesale pricing in SP Road is ₹1,18,000. Seller has 14% negotiation margin remaining.', time: '14:03' },
    { id: 6, sender: 'Seller AI', text: 'If you complete payment via UPI within 10 minutes, I can match ₹1,16,000 including clear case and screen protector.', time: '14:04' },
  ]);
  const [inputOffer, setInputOffer] = useState('');
  const [isAutoNegotiating, setIsAutoNegotiating] = useState(false);

  const handleSendOffer = (e) => {
    e.preventDefault();
    if (!inputOffer.trim()) return;

    playGlassTap();
    const newMsg = {
      id: Date.now(),
      sender: 'User',
      text: `Counter Offer Submitted: ₹${inputOffer}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputOffer('');

    setTimeout(() => {
      playSuccessChime();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Seller AI',
          text: `Counter offer acknowledged under ${selectedMode} mode. Final counter proposal: ₹${(Number(inputOffer) + 1500).toLocaleString('en-IN')}. Do we have a deal?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Mode & Tab Controls */}
      <div className="p-6 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-4 shadow-luxury-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#7A5C45]/15 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5C45]">AI Workspace Mode</span>
            <select
              value={selectedMode}
              onChange={(e) => { playGlassTap(); setSelectedMode(e.target.value); }}
              className="mt-1 block w-full sm:w-64 px-3 py-2 rounded-xl glass-input text-xs font-bold text-[#3F3024]"
            >
              {NEGOTIATION_MODES.map((mode) => (
                <option key={mode} value={mode}>{mode} Mode</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => { playGlassTap(); setIsAutoNegotiating(!isAutoNegotiating); }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-2 ${
                isAutoNegotiating
                  ? 'bg-[#C9A76A] text-white shadow-luxury-gold'
                  : 'bg-white/80 text-[#3F3024] border border-[#7A5C45]/20 hover:bg-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isAutoNegotiating ? 'Auto Negotiate Active' : 'Enable Auto Negotiate'}</span>
            </button>
          </div>
        </div>

        {/* Workspace Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs font-bold pt-1">
          {WORKSPACE_TABS.map((tab) => {
            const active = activeWorkspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { playGlassTap(); setActiveWorkspaceTab(tab.id); }}
                className={`px-4 py-2 rounded-2xl transition whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#3F3024] shadow-luxury-sm border border-[#C9A76A]/40'
                    : 'text-[#7A5C45] hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content 1: Digital Twin Strategies */}
      {activeWorkspaceTab === 'digital_twin' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#3F3024]">Negotiation Digital Twin</h3>
            <p className="text-xs text-[#7A5C45]">
              NegoSphere generates 4 simultaneous AI strategies matching different market conditions and seller personalities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIGITAL_TWIN_STRATEGIES.map((strat) => {
              const Icon = strat.icon;
              const isSelected = selectedStrategy === strat.id;
              return (
                <div
                  key={strat.id}
                  onClick={() => { playGlassTap(); setSelectedStrategy(strat.id); }}
                  className={`p-6 rounded-3xl border transition cursor-pointer space-y-4 ${
                    isSelected
                      ? 'bg-white border-[#C9A76A] shadow-luxury font-medium ring-2 ring-[#C9A76A]/30'
                      : 'glass-card border-[#7A5C45]/15 hover:border-[#7A5C45]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#3F3024] text-[#C9A76A] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#3F3024]">{strat.name}</h4>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#C9A76A]">{strat.badge}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-2xl bg-[#F8F6F1] border border-[#7A5C45]/10">
                    <div>
                      <span className="text-[9px] text-[#7A5C45] block">Est. Savings</span>
                      <strong className="font-mono text-emerald-700">{strat.expected_savings}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#7A5C45] block">Success Prob.</span>
                      <strong className="font-mono text-[#3F3024]">{strat.success_probability}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#7A5C45] block">Risk Profile</span>
                      <strong className="text-[10px] text-amber-800 block truncate">{strat.risk_level}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-[#7A5C45] leading-relaxed">{strat.reasoning}</p>

                  <div className="p-3 rounded-2xl bg-white border border-[#7A5C45]/10 italic text-[11px] text-[#3F3024]">
                    "{strat.opening_script}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 2: Live Battle Stream Stream */}
      {activeWorkspaceTab === 'negotiation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-4 h-[460px] overflow-y-auto shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                {messages.map((m) => {
                  const isUser = m.sender === 'User';
                  const isAI = m.sender === 'AI Negotiator';
                  const isMarket = m.sender === 'Market AI';
                  const isSystem = m.sender === 'System';

                  if (isSystem) {
                    return (
                      <div key={m.id} className="text-center py-2">
                        <span className="px-4 py-1.5 rounded-full bg-white/70 border border-[#7A5C45]/15 text-[11px] font-bold text-[#7A5C45]">
                          {m.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[9px] uppercase font-bold text-[#7A5C45] px-1">{m.sender} • {m.time}</div>
                      <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#3F3024] text-white rounded-br-none shadow-luxury'
                          : isAI
                          ? 'bg-[#C9A76A]/20 border border-[#C9A76A]/40 text-[#3F3024] font-semibold rounded-bl-none'
                          : isMarket
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-bl-none'
                          : 'bg-white border border-[#7A5C45]/15 text-[#3F3024] rounded-bl-none shadow-sm'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSendOffer} className="flex items-center space-x-3">
              <input
                type="text"
                value={inputOffer}
                onChange={(e) => setInputOffer(e.target.value)}
                placeholder="Enter counter offer amount (e.g. 114000)..."
                className="flex-1 px-4 py-3.5 rounded-2xl glass-input text-xs font-semibold text-[#3F3024]"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl btn-luxury-gold text-xs font-extrabold flex items-center space-x-2 shadow-luxury-gold shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Submit Counter</span>
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#C9A76A]/40 space-y-4 shadow-luxury-sm">
            <h4 className="font-serif font-bold text-[#3F3024] text-sm border-b border-[#7A5C45]/15 pb-2">Active Strategy Summary</h4>
            <div className="space-y-3 text-xs text-[#7A5C45]">
              <div className="flex justify-between">
                <span>Selected Strategy:</span>
                <strong className="text-[#3F3024] uppercase font-mono">{selectedStrategy}</strong>
              </div>
              <div className="flex justify-between">
                <span>Target Bid Price:</span>
                <strong className="text-emerald-700 font-mono">₹1,14,500</strong>
              </div>
              <div className="flex justify-between">
                <span>Headroom Confidence:</span>
                <strong className="text-[#C9A76A] font-mono">88 / 100</strong>
              </div>
              <div className="flex justify-between">
                <span>Walkaway Limit:</span>
                <strong className="text-rose-700 font-mono">₹1,21,000</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Real-Time Live Execution Timeline */}
      {activeWorkspaceTab === 'timeline' && (
        <div className="p-6 rounded-3xl bg-white border border-[#C9A76A]/40 space-y-6 shadow-luxury-sm">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#3F3024]">Real-Time Multi-Agent Live Execution Timeline</h3>
            <p className="text-xs text-[#7A5C45]">
              Observe autonomous AI agents working in sequence to analyze market data, model statistical dispersion, and generate negotiation scripts.
            </p>
          </div>

          <div className="space-y-4">
            {LIVE_EXECUTION_STAGES.map((s, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs p-3.5 rounded-2xl bg-[#F8F6F1] border border-[#7A5C45]/10">
                <div className="pt-0.5">
                  {s.status === 'complete' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : s.status === 'running' ? (
                    <Zap className="w-4 h-4 text-[#C9A76A] animate-bounce" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-400" />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-bold text-[#3F3024]">{s.stage}</div>
                  <div className="text-[11px] text-[#7A5C45]">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
