import React, { useState } from 'react';
import { History, Search, FileText, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

const PAST_NEGOTIATIONS = [
  { id: 1, title: 'Samsung S24 Ultra (512GB)', date: 'Jul 24, 2026', savings: '₹15,499', score: 94.8, status: 'Closed Deal' },
  { id: 2, title: 'MacBook Air M3 (16GB RAM)', date: 'Jul 22, 2026', savings: '₹13,900', score: 91.2, status: 'Closed Deal' },
  { id: 3, title: 'Sony WH-1000XM5 Headphones', date: 'Jul 19, 2026', savings: '₹5,490', score: 88.5, status: 'Closed Deal' },
  { id: 4, title: 'PlayStation 5 Slim Console', date: 'Jul 15, 2026', savings: '₹6,090', score: 96.0, status: 'Closed Deal' }
];

export default function HistoryView({ onSelectProduct }) {
  const [filter, setFilter] = useState('');

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-2 shadow-luxury-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
          <History className="w-3.5 h-3.5 text-[#C9A76A]" />
          <span>Session Audit Logs & History</span>
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
          Negotiation History & Transcripts
        </h2>
        <p className="text-xs text-[#6B5E54]">
          Review past multi-agent negotiation transcripts, savings receipts, and persona scripts.
        </p>
      </div>

      <div className="space-y-4">
        {PAST_NEGOTIATIONS.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 flex items-center justify-between shadow-luxury-sm hover:border-[#C9A76A]/40 transition group"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-base font-bold font-serif text-[#3F3024] group-hover:text-[#7A5C45] transition">
                  {item.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>
              <div className="text-xs text-[#7A5C45] font-semibold">
                Date: {item.date} • Opportunity Score: {item.score}/100
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-[10px] font-extrabold uppercase text-[#7A5C45]">Savings Achieved</div>
                <div className="text-base font-extrabold font-serif text-emerald-700">{item.savings}</div>
              </div>

              <button
                onClick={() => onSelectProduct(item.title)}
                className="p-2.5 rounded-2xl bg-white/70 hover:bg-white border border-[#7A5C45]/20 text-[#3F3024] transition shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-[#7A5C45]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
