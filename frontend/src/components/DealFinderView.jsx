import React, { useState } from 'react';
import { Search, Filter, Sparkles, Tag, ShieldCheck, ExternalLink, ArrowRight, Zap, ShoppingCart } from 'lucide-react';

const FEATURED_DEALS = [
  {
    id: 1,
    name: 'Samsung Galaxy S24 Ultra (512GB Titanium Gray)',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    currentPrice: 129999,
    fairPrice: 114500,
    bestMarket: 'Nehru Place / Wholesale',
    score: 94.8,
    recommendation: 'STRONG_BUY_BARGAIN',
    coupon: 'SAVE5000 (ICICI Bank)',
    riskLevel: 'LOW_RISK',
    margin: '11.9% Margin'
  },
  {
    id: 2,
    name: 'Apple MacBook Air M3 (16GB, 512GB SSD)',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    currentPrice: 134900,
    fairPrice: 121000,
    bestMarket: 'Amazon India',
    score: 91.2,
    recommendation: 'WAIT_FOR_FESTIVE_SALE',
    coupon: 'HDFC10000',
    riskLevel: 'VERY_LOW',
    margin: '10.3% Margin'
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    currentPrice: 29990,
    fairPrice: 24500,
    bestMarket: 'Croma Retail',
    score: 88.5,
    recommendation: 'HIGH_NEGOTIATION_MARGIN',
    coupon: 'SONYOFFER2000',
    riskLevel: 'LOW_RISK',
    margin: '18.3% Margin'
  },
  {
    id: 4,
    name: 'PlayStation 5 Slim Console (Disc Edition)',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
    currentPrice: 54990,
    fairPrice: 48900,
    bestMarket: 'Flipkart',
    score: 96.0,
    recommendation: 'EXCELLENT_DEAL',
    coupon: 'GAMER5000',
    riskLevel: 'VERY_LOW',
    margin: '11.1% Margin'
  }
];

export default function DealFinderView({ onRunSearch }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Search Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel-glow border border-[#C9A76A]/40 space-y-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A76A]" />
            <span>AI Real-Time Deal Scraper</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#3F3024]">
            Find Best Market Deals & Fair Prices
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E54]">
            Compare live prices across Amazon, Flipkart, Croma, Reliance Digital & SP Road / Nehru Place wholesale bazaars.
          </p>
        </div>

        {/* Large Luxury Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) onRunSearch(query);
          }}
          className="flex flex-col sm:flex-row items-center gap-3 relative z-10"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-[#7A5C45] absolute left-4 top-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products (e.g. Samsung S24 Ultra, MacBook Air M3, Sony XM5)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input text-sm font-semibold text-[#3F3024] placeholder-[#7A5C45]/60 shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-luxury-gold text-xs font-extrabold flex items-center justify-center space-x-2 shadow-luxury-gold shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Analyze Deal</span>
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#7A5C45]/15 text-xs">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-[#7A5C45] flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
            >
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Gaming</option>
            </select>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
            >
              <option>All Marketplaces</option>
              <option>Amazon India</option>
              <option>Flipkart</option>
              <option>Apple Store</option>
              <option>Wholesale Bazaars</option>
            </select>
          </div>
          <span className="text-[11px] font-semibold text-[#7A5C45]">4 Verified Opportunities Found</span>
        </div>

      </div>

      {/* Featured Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURED_DEALS.map((deal) => (
          <div
            key={deal.id}
            className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-6 flex flex-col justify-between group hover:border-[#C9A76A]/50 transition-all duration-300 shadow-luxury-sm"
          >
            <div className="space-y-4">
              
              {/* Product Header & Image */}
              <div className="flex items-start space-x-4">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-[#7A5C45]/15 shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C9A76A]/20 text-[#7A5C45] border border-[#C9A76A]/30">
                      {deal.margin}
                    </span>
                    <span className="text-xs font-bold font-mono text-[#3F3024]">Score: {deal.score}/100</span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-[#3F3024] group-hover:text-[#7A5C45] transition">
                    {deal.name}
                  </h3>
                  
                  <div className="text-xs text-[#7A5C45] font-semibold flex items-center space-x-1">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#C9A76A]" />
                    <span>Best Marketplace: <strong className="text-[#3F3024]">{deal.bestMarket}</strong></span>
                  </div>
                </div>
              </div>

              {/* Pricing Comparison Grid */}
              <div className="p-4 rounded-2xl bg-white/70 border border-[#7A5C45]/12 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5C45]">Current Retail Price</div>
                  <div className="text-lg font-bold font-mono text-[#3F3024] line-through opacity-70">
                    ₹{deal.currentPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#C9A76A]">AI Fair Market Target</div>
                  <div className="text-xl font-extrabold font-serif text-[#7A5C45]">
                    ₹{deal.fairPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="px-2.5 py-1 rounded-xl bg-white border border-[#7A5C45]/15 text-[#3F3024]">
                  Coupon: {deal.coupon}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-white border border-[#7A5C45]/15 text-[#3F3024]">
                  Risk: {deal.riskLevel}
                </span>
              </div>

            </div>

            <button
              onClick={() => onRunSearch(deal.name)}
              className="w-full py-3 rounded-2xl btn-luxury-gold text-xs font-extrabold flex items-center justify-center space-x-2 shadow-luxury-gold"
            >
              <span>Launch Live Negotiation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
