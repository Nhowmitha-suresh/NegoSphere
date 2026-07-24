import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, MapPin, Tag, FileText, History, Cpu, ArrowRight, X } from 'lucide-react';
import { playGlassTap } from '../utils/audio';

export default function UniversalSearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState('MacBook');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        playGlassTap();
        onClose(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#3F3024]/40 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="max-w-2xl w-full bg-[#F8F6F1] rounded-3xl border border-[#C9A76A]/40 shadow-luxury overflow-hidden flex flex-col space-y-4 p-6 animate-fadeIn">
        
        {/* Search Input Bar */}
        <div className="flex items-center space-x-3 border-b border-[#7A5C45]/15 pb-4">
          <Search className="w-5 h-5 text-[#7A5C45]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, stores, negotiations, coupons, reports..."
            className="flex-1 bg-transparent text-sm font-semibold text-[#3F3024] placeholder-[#7A5C45]/60 focus:outline-none"
          />
          <kbd className="px-2 py-1 rounded-md bg-[#EBE5D9] text-[10px] font-mono font-bold text-[#3F3024]">
            ESC
          </kbd>
          <button onClick={() => onClose(false)} className="p-1 rounded-xl text-[#7A5C45] hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categorized Universal Search Results */}
        <div className="max-h-[60vh] overflow-y-auto space-y-5 text-xs pr-1">
          
          {/* 1. Products & Deals */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5C45] flex items-center space-x-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Matching Products & Deals</span>
            </div>
            <div
              onClick={() => { onSelectResult('MacBook Air M3'); onClose(false); }}
              className="p-3 rounded-2xl bg-white border border-[#7A5C45]/12 hover:border-[#C9A76A] flex items-center justify-between cursor-pointer transition shadow-sm"
            >
              <div>
                <div className="font-bold text-[#3F3024]">Apple MacBook Air M3 (16GB RAM, 512GB SSD)</div>
                <div className="text-[11px] text-[#7A5C45]">Fair Market Target: ₹1,21,000 • Listed: ₹1,34,900</div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A76A]/20 text-[#7A5C45]">
                10.3% Savings Target
              </span>
            </div>
          </div>

          {/* 2. Nearby Retailers & Stores */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5C45] flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Nearby Retailers & Bazaars</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-white border border-[#7A5C45]/12 space-y-1">
                <div className="font-bold text-[#3F3024]">Apple Premium Reseller (4.2 km away)</div>
                <div className="text-[11px] text-[#7A5C45]">Stock: Available • In-Store Pickup</div>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#7A5C45]/12 space-y-1">
                <div className="font-bold text-[#3F3024]">Croma Superstore (2.8 km away)</div>
                <div className="text-[11px] text-[#7A5C45]">Stock: Available • HDFC Instant Cashback</div>
              </div>
            </div>
          </div>

          {/* 3. Verified Coupons & Active Offers */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5C45] flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Verified Coupons & Offers</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#7A5C45]/12 flex items-center justify-between">
              <div className="font-bold text-[#3F3024]">HDFC Card Instant Cashback (₹10,000 Off)</div>
              <span className="text-[10px] font-bold text-emerald-700">Verified Active</span>
            </div>
          </div>

          {/* 4. Past Negotiations & Reports */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5C45] flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Reports & Audit Logs</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#7A5C45]/12 flex items-center justify-between">
              <div className="font-bold text-[#3F3024]">MacBook Air M3 Executive PDF Victory Report</div>
              <div className="text-[11px] text-[#7A5C45]">Jul 22, 2026 • Verified Audit</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
