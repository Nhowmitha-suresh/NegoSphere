import React from 'react';
import { Globe, ShoppingCart, Truck, Star, Tag, TrendingUp, Zap, ShieldCheck } from 'lucide-react';

const VENDORS = [
  {
    id: 'amazon',
    name: 'Amazon India',
    type: 'Pan-India E-Commerce',
    livePrice: 129999,
    delivery: 'Same-Day Prime (Delhi-NCR / Mumbai)',
    rating: 4.8,
    opportunityScore: 82.5,
    coupon: 'ICICI Instant ₹5,000 Discount',
    demand: 'High Demand',
    badgeColor: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    type: 'E-Commerce Marketplace',
    livePrice: 124999,
    delivery: 'Tomorrow 10:00 AM',
    rating: 4.7,
    opportunityScore: 91.0,
    coupon: 'HDFC Card ₹7,500 Off',
    demand: 'Moderate',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'apple',
    name: 'Apple Flagship Store',
    type: 'Official Retailer',
    livePrice: 134900,
    delivery: 'Standard Delivery (2 Days)',
    rating: 4.9,
    opportunityScore: 74.0,
    coupon: 'No-Cost EMI 6 Months',
    demand: 'Very High',
    badgeColor: 'bg-slate-200 text-slate-900'
  },
  {
    id: 'reliance',
    name: 'Reliance Digital',
    type: 'National Tech Store Chain',
    livePrice: 127900,
    delivery: 'In-Store Pickup Available Today',
    rating: 4.6,
    opportunityScore: 86.4,
    coupon: 'Store Loyalty Points (₹3,000)',
    demand: 'Normal',
    badgeColor: 'bg-red-100 text-red-800'
  },
  {
    id: 'croma',
    name: 'Croma Retail',
    type: 'Electronics Superstore',
    livePrice: 126999,
    delivery: '2-Hour Express Delivery',
    rating: 4.5,
    opportunityScore: 88.0,
    coupon: 'Tata Neu 5% Cashback',
    demand: 'Normal',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'local',
    name: 'Nehru Place / SP Road Bazaars',
    type: 'Wholesale Tech Market',
    livePrice: 118000,
    delivery: 'Instant Cash & Carry Pickup',
    rating: 4.9,
    opportunityScore: 98.5,
    coupon: 'Cash / UPI Instant Discount',
    demand: 'Bargain Hotspot',
    badgeColor: 'bg-[#C9A76A]/30 text-[#7A5C45]'
  }
];

export default function MarketplaceIntelView() {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-2 shadow-luxury-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
          <Globe className="w-3.5 h-3.5 text-[#C9A76A]" />
          <span>Vendor Pricing & Margin Comparison Matrix</span>
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
          Marketplace Intelligence Engine
        </h2>
        <p className="text-xs text-[#6B5E54]">
          Real-time cross-vendor monitoring of retail inventory, discount margins, and local wholesale bazaar prices.
        </p>
      </div>

      {/* Grid of 6 Marketplace Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENDORS.map((v) => (
          <div
            key={v.id}
            className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-5 flex flex-col justify-between group hover:border-[#C9A76A]/50 transition-all duration-300 shadow-luxury-sm"
          >
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A5C45]">
                  {v.type}
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A76A]/20 text-[#7A5C45]">
                  <Star className="w-3 h-3 text-[#C9A76A] fill-current" />
                  <span>{v.rating}</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-serif text-[#3F3024] group-hover:text-[#7A5C45] transition">
                  {v.name}
                </h3>
                <div className="text-2xl font-extrabold font-serif text-[#7A5C45] pt-1">
                  ₹{v.livePrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-[#7A5C45]/12 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-[#3F3024]">
                  <Truck className="w-3.5 h-3.5 text-[#C9A76A]" />
                  <span>{v.delivery}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#3F3024]">
                  <Tag className="w-3.5 h-3.5 text-[#C9A76A]" />
                  <span>{v.coupon}</span>
                </div>
              </div>

            </div>

            <div className="space-y-3 pt-2 border-t border-[#7A5C45]/12">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#7A5C45] font-semibold">Negotiation Opportunity</span>
                <span className="font-extrabold font-mono text-[#3F3024]">{v.opportunityScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#EBE5D9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7A5C45] to-[#C9A76A] rounded-full"
                  style={{ width: `${v.opportunityScore}%` }}
                />
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
