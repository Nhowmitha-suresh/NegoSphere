import React, { useState } from 'react';
import { Cpu, Sparkles, Eye, CheckCircle2, RefreshCw, Layers, ShieldCheck, Terminal, ArrowRight, X } from 'lucide-react';

const AGENT_LIST = [
  {
    id: 1,
    name: 'Product Taxonomy Agent',
    role: 'Extract Brand, Variant, Category & Search Tags',
    status: 'Ready',
    confidence: 99.2,
    progress: 100,
    thinking: 'Normalized product search string into standardized JSON taxonomy model (Brand: Samsung, Model: S24 Ultra, Storage: 512GB).',
    inputSchema: '{ "raw_query": "Samsung S24 Ultra" }',
    outputSchema: '{ "brand": "Samsung", "category": "Flagship Smartphone", "tags": ["512GB", "Titanium Gray", "5G"] }'
  },
  {
    id: 2,
    name: 'Scraper & Market Agent',
    role: 'Hybrid Web Scraping & Fallback Dataset Guarantee',
    status: 'Active',
    confidence: 96.5,
    progress: 100,
    thinking: 'Collected live price matrix across Amazon IN (₹1,29,999), Flipkart (₹1,24,999), Croma (₹1,27,900), and Nehru Place Bazaars (₹1,18,000). Respects robots.txt and domain rate limits.',
    inputSchema: '{ "query": "Samsung S24 Ultra", "enable_live_scraping": true }',
    outputSchema: '{ "scraped_sources": 5, "min_price": 118000, "max_price": 129999, "average_price": 124800 }'
  },
  {
    id: 3,
    name: 'Price Analysis Agent',
    role: 'Compute Variance, PDF Curves & Fair Value',
    status: 'Complete',
    confidence: 98.4,
    progress: 100,
    thinking: 'Computed Gaussian Probability Density Function (PDF). Target offer recommendation generated at ₹1,12,000 based on standard deviation σ=4200.',
    inputSchema: '{ "price_series": [129999, 124999, 127900, 118000] }',
    outputSchema: '{ "recommended_target": 112000, "median": 124999, "price_dispersion_std": 4200 }'
  },
  {
    id: 4,
    name: 'Opportunity Agent',
    role: '0–100 Confidence Score & Multi-Factor Margin',
    status: 'Complete',
    confidence: 94.8,
    progress: 100,
    thinking: 'Evaluated market variance (30 pts), seasonal discounts (25 pts), coupon availability (20 pts), and vendor competition (19.8 pts). Total Score: 94.8 / 100.',
    inputSchema: '{ "target_price": 112000, "scraped_data": [...] }',
    outputSchema: '{ "opportunity_score": 94.8, "confidence_tier": "HIGH_PROBABILITY_BARGAIN" }'
  },
  {
    id: 5,
    name: 'Coach Agent',
    role: '6 Persona-Matched Negotiation Scripts',
    status: 'Ready',
    confidence: 97.1,
    progress: 100,
    thinking: 'Generated tactical dialogue scripts for Assertive, Diplomatic, Student, Analytical, Executive, and Local Street Bargainer personas.',
    inputSchema: '{ "persona": "Assertive", "query": "Samsung S24 Ultra" }',
    outputSchema: '{ "opening_anchor": "I have cash ready at ₹1,12,000. Nehru Place has stock at ₹1,14,000...", "walkaway_limit": 116000 }'
  },
  {
    id: 6,
    name: 'Multi-Lang Agent',
    role: 'Natural Adaptation across 6 Regional Languages',
    status: 'Ready',
    confidence: 95.9,
    progress: 100,
    thinking: 'Adapted English negotiation script into Hindi, Tamil, Telugu, Kannada, and Malayalam with local cultural bargaining idioms.',
    inputSchema: '{ "languages": ["EN", "HI", "TA", "TE", "KN", "ML"] }',
    outputSchema: '{ "hi_script": "Bhai sahab, Nehru Place me ₹1,14,000 mil raha hai...", "ta_script": "Kadaisiya enna vila ku tharuvinga?" }'
  },
  {
    id: 7,
    name: 'Showdown Agent',
    role: 'Autonomous AI-vs-AI Battle Simulation',
    status: 'Active',
    confidence: 99.0,
    progress: 100,
    thinking: 'Simulated 5-turn bargaining battle between Buyer AI and Flexible Seller AI. Agreed final price: ₹1,14,500 (Total Savings: ₹15,499).',
    inputSchema: '{ "buyer_persona": "Assertive", "seller_personality": "Flexible" }',
    outputSchema: '{ "turn_count": 5, "agreed_price": 114500, "deal_closed": true }'
  },
  {
    id: 8,
    name: 'Summary Agent',
    role: 'Executive Victory Card & Savings Analytics',
    status: 'Complete',
    confidence: 99.5,
    progress: 100,
    thinking: 'Compiled executive report summary, savings percentage breakdown (11.9%), and structured JSON payload for print-ready PDF export.',
    inputSchema: '{ "all_agent_outputs": [...] }',
    outputSchema: '{ "executive_summary": "High opportunity deal with ₹15,499 projected savings.", "export_pdf_ready": true }'
  }
];

export default function MissionControl() {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header Banner */}
      <div className="p-8 rounded-3xl glass-panel-glow border border-[#C9A76A]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 border border-[#C9A76A]/40 text-[#7A5C45] text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-[#C9A76A]" />
            <span>Multi-Agent Mission Control Room</span>
          </div>
          <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
            8 Autonomous AI Agents Active
          </h2>
          <p className="text-xs text-[#6B5E54] max-w-xl">
            Each agent operates with isolated single-responsibility Pydantic contracts, dual-LLM fallback logic, and real-time streaming output.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-white/80 border border-[#7A5C45]/15 text-center">
            <div className="text-xs font-bold text-[#7A5C45]">System Health</div>
            <div className="text-sm font-extrabold text-[#3F3024]">100% Operational</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/80 border border-[#7A5C45]/15 text-center">
            <div className="text-xs font-bold text-[#7A5C45]">Avg Latency</div>
            <div className="text-sm font-extrabold text-[#C9A76A]">420 ms</div>
          </div>
        </div>
      </div>

      {/* Grid of 8 Glass Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AGENT_LIST.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-5 relative flex flex-col justify-between group hover:border-[#C9A76A]/50 transition-all duration-300 shadow-luxury-sm"
          >
            <div className="space-y-3">
              
              {/* Agent Number & Status Pill */}
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-[#3F3024] text-[#C9A76A] font-serif font-bold text-xs flex items-center justify-center">
                  0{agent.id}
                </span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A76A]/20 text-[#7A5C45] border border-[#C9A76A]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A76A] animate-ping" />
                  <span>{agent.status}</span>
                </span>
              </div>

              {/* Title & Role */}
              <div>
                <h3 className="text-base font-bold font-serif text-[#3F3024] group-hover:text-[#7A5C45] transition">
                  {agent.name}
                </h3>
                <p className="text-[11px] text-[#7A5C45] font-medium leading-snug">
                  {agent.role}
                </p>
              </div>

              {/* Reasoning Thought Log */}
              <div className="p-3 rounded-2xl bg-white/60 border border-[#7A5C45]/10 text-[11px] text-[#2F2F2F] font-mono leading-relaxed line-clamp-3">
                "{agent.thinking}"
              </div>

            </div>

            {/* Progress Bar & Confidence Gauge */}
            <div className="space-y-4 pt-2 border-t border-[#7A5C45]/10">
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-[#7A5C45]">
                  <span>Reasoning Confidence</span>
                  <span className="font-mono">{agent.confidence}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#EBE5D9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7A5C45] to-[#C9A76A] rounded-full"
                    style={{ width: `${agent.confidence}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedAgent(agent)}
                className="w-full py-2 rounded-xl btn-luxury-outline text-xs font-bold flex items-center justify-center space-x-2 group-hover:border-[#C9A76A]"
              >
                <Eye className="w-3.5 h-3.5 text-[#7A5C45]" />
                <span>Inspect Reasoning & Schema</span>
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal for Selected Agent */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-[#3F3024]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#F8F6F1] rounded-3xl border border-[#C9A76A]/40 shadow-luxury p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3F3024] text-[#C9A76A] font-serif font-bold flex items-center justify-center text-sm">
                  0{selectedAgent.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#3F3024]">{selectedAgent.name}</h3>
                  <p className="text-xs text-[#7A5C45]">{selectedAgent.role}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className="p-2 rounded-xl hover:bg-slate-200 text-[#7A5C45]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Neural Reasoning Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#7A5C45]">Neural Reasoning & Chain of Thought</h4>
              <div className="p-4 rounded-2xl bg-white border border-[#7A5C45]/15 text-xs text-[#3F3024] leading-relaxed">
                {selectedAgent.thinking}
              </div>
            </div>

            {/* Pydantic Schema Contracts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A5C45]">Input Pydantic Schema</h4>
                <pre className="p-3 rounded-2xl bg-[#3F3024] text-[#C9A76A] text-[10px] font-mono overflow-x-auto">
                  {selectedAgent.inputSchema}
                </pre>
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A5C45]">Output Pydantic Schema</h4>
                <pre className="p-3 rounded-2xl bg-[#3F3024] text-[#C9A76A] text-[10px] font-mono overflow-x-auto">
                  {selectedAgent.outputSchema}
                </pre>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-6 py-2.5 rounded-xl btn-luxury-gold text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
