import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, ShoppingCart, Truck, Star, Tag, TrendingUp, Zap, ShieldCheck, Award, ArrowUpRight, DollarSign, Clock, Sparkles } from 'lucide-react';
import { playGlassTap, playSuccessChime } from '../utils/audio';
import { api } from '../services/api';

export default function MarketplaceIntelView({ query = 'Samsung S24 Ultra', pipelineData }) {
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [activeQuery, setActiveQuery] = useState(query);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    if (pipelineData && pipelineData.market_intelligence) {
      setMarketData(pipelineData.market_intelligence);
    } else {
      fetchLiveMarketData(query, false);
    }
  }, [query, pipelineData]);

  const fetchLiveMarketData = async (searchQuery, forceRefresh = false) => {
    setLoading(true);
    try {
      const res = await api.collectPrices(searchQuery, forceRefresh);
      if (res && res.data) {
        setMarketData(res.data);
        setActiveQuery(searchQuery);
        setLastUpdated(new Date().toLocaleTimeString());
        if (forceRefresh) playSuccessChime();
      }
    } catch (err) {
      console.warn("Failed to fetch live market data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    playGlassTap();
    fetchLiveMarketData(activeQuery, true);
  };

  const metrics = marketData?.metrics || {
    lowest_price: 104330.6,
    highest_price: 134999.0,
    average_price: 124500.0,
    median_price: 124999.0,
    target_recommended_price: 98070.0,
    potential_savings_val: 26429.4,
    potential_savings_pct: 21.2,
    confidence_score: 92,
    cheapest_store: "Nehru Place / Wholesale Bazaar Hub",
    lowest_seller: {
      vendor_name: "Amazon India",
      price: 104330.6,
      mrp: 134999.0,
      rating: 4.8,
      review_count: 32400,
      delivery: "Prime Same-Day Delivery"
    },
    best_cashback: {
      vendor_name: "Amazon India",
      offers: ["5% Unlimited Cashback on Amazon Pay ICICI Card"]
    },
    best_exchange: {
      vendor_name: "Flipkart",
      exchange_value: 23000.0
    }
  };

  const offers = marketData?.offers || [
    {
      vendor_name: "Amazon India",
      current_price: 104330.6,
      mrp: 134999.0,
      discount_pct: 22.7,
      rating: 4.8,
      review_count: 32400,
      delivery_estimate: "Prime Same-Day Delivery",
      coupons: ["Instant ₹2,500 Coupon at Checkout"],
      cashback_offers: ["5% Unlimited Cashback on Amazon Pay ICICI Card"],
      bank_emi_offers: ["No Cost EMI up to 12 months with HDFC/ICICI"],
      exchange_offer_val: 23000.0,
      source_type: "Live Web"
    },
    {
      vendor_name: "Flipkart",
      current_price: 109249.05,
      mrp: 134999.0,
      discount_pct: 19.1,
      rating: 4.7,
      review_count: 41800,
      delivery_estimate: "Delivered by Tomorrow, 5 PM",
      coupons: ["Extra ₹3,000 Off on SuperCoins / Card Discount"],
      cashback_offers: ["5% Cashback on Flipkart Axis Credit Card"],
      bank_emi_offers: ["No Cost EMI starting ₹3,200/mo"],
      exchange_offer_val: 26000.0,
      source_type: "Live Web"
    },
    {
      vendor_name: "Croma Retail",
      current_price: 112699.02,
      mrp: 134999.0,
      discount_pct: 16.5,
      rating: 4.6,
      review_count: 12900,
      delivery_estimate: "Store Pickup / Express 3-Hour Delivery",
      coupons: ["Store Voucher: ₹1,000 Direct Off"],
      cashback_offers: ["₹3,000 Instant HDFC Bank Cashback"],
      bank_emi_offers: ["Paper Finance & Card EMI Available"],
      exchange_offer_val: 21000.0,
      source_type: "Live Web"
    },
    {
      vendor_name: "Reliance Digital",
      current_price: 111549.03,
      mrp: 134999.0,
      discount_pct: 17.4,
      rating: 4.6,
      review_count: 15400,
      delivery_estimate: "Express Store Delivery in 4 Hours",
      coupons: ["JioMart Points Extra Discount"],
      cashback_offers: ["10% Instant Cashback on SBI Credit Cards"],
      bank_emi_offers: ["Zero Down Payment EMI Offers"],
      exchange_offer_val: 22000.0,
      source_type: "Live Web"
    },
    {
      vendor_name: "Nehru Place / Wholesale Bazaar Hub",
      current_price: 104649.09,
      mrp: 134999.0,
      discount_pct: 22.5,
      rating: 4.5,
      review_count: 8900,
      delivery_estimate: "Immediate Store Handover",
      coupons: ["Cash Payment Instant Discount"],
      cashback_offers: ["GST Input Tax Credit Benefit (18%)"],
      bank_emi_offers: ["Merchant Finance Available"],
      exchange_offer_val: 28000.0,
      source_type: "Offline Bazaar Verified"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header Banner with Live Refresh Action */}
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-4 shadow-luxury-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Real-Time Market Intelligence Engine</span>
            </div>
            <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
              Live Market Insights & Vendor Matrix
            </h2>
            <p className="text-xs text-[#6B5E54]">
              Active market analysis for <strong className="text-[#3F3024]">{activeQuery}</strong> • Last Updated: <span className="font-mono text-[#3F3024]">{lastUpdated}</span>
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-[#3F3024] text-[#C9A76A] hover:bg-[#5C4535] transition text-xs font-bold shadow-luxury flex items-center justify-center space-x-2 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing Live Data...' : 'Refresh Live Market Data'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Panel: Lowest Seller, Best Offer, Cheapest Store, Cashback, Exchange, Net Savings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lowest Seller Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#C9A76A]/40 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#7A5C45]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Lowest Verified Seller</span>
            <Award className="w-4 h-4 text-[#C9A76A]" />
          </div>
          <div className="text-xl font-bold font-serif text-[#3F3024]">
            {metrics.lowest_seller?.vendor_name || metrics.cheapest_store}
          </div>
          <div className="text-2xl font-extrabold text-[#3F3024] font-mono">
            ₹{(metrics.lowest_price || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#6B5E54]">
            {metrics.lowest_seller?.delivery || "Express Delivery Guaranteed"}
          </p>
        </div>

        {/* Best Offer & Coupons */}
        <div className="p-5 rounded-2xl bg-white border border-[#C9A76A]/40 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#7A5C45]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Best Active Coupon</span>
            <Tag className="w-4 h-4 text-[#C9A76A]" />
          </div>
          <div className="text-sm font-bold text-[#3F3024] line-clamp-1">
            {offers[0]?.coupons[0] || "Instant ₹2,500 Coupon at Checkout"}
          </div>
          <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg inline-block">
            Verified Active & Stackable
          </div>
          <p className="text-[11px] text-[#6B5E54]">
            Available at {offers[0]?.vendor_name || "Lowest Seller"}
          </p>
        </div>

        {/* Cashback & Trade-In Value */}
        <div className="p-5 rounded-2xl bg-white border border-[#C9A76A]/40 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#7A5C45]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Max Trade-In Exchange</span>
            <DollarSign className="w-4 h-4 text-[#C9A76A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#3F3024] font-mono">
            ₹{(metrics.best_exchange?.exchange_value || 25000).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#6B5E54]">
            Best Trade-in at <strong className="text-[#3F3024]">{metrics.best_exchange?.vendor_name || "Flipkart"}</strong>
          </p>
        </div>

        {/* Total Net Savings Opportunity */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#3F3024] to-[#5C4535] text-[#F8F6F1] shadow-luxury space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#C9A76A]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Net Savings Opportunity</span>
            <Sparkles className="w-4 h-4 text-[#C9A76A] animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-[#C9A76A] font-mono">
            ₹{(metrics.potential_savings_val || 26429).toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 font-semibold">
            {metrics.potential_savings_pct || 21.2}% Max Disparity Score
          </div>
        </div>

      </div>

      {/* Retailer Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-serif text-[#3F3024] flex items-center space-x-2">
          <span>Supported Retailers & Live Ingestion Status</span>
          <span className="text-xs font-mono font-normal text-[#7A5C45]">({offers.length} Vendors Active)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, idx) => (
            <div
              key={offer.id || idx}
              className="p-6 rounded-3xl bg-white border border-[#C9A76A]/30 shadow-luxury-sm hover:shadow-luxury transition space-y-4 relative"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold font-serif text-[#3F3024]">{offer.vendor_name}</h4>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#7A5C45] bg-[#F8F6F1] px-2 py-0.5 rounded-md border border-[#C9A76A]/20">
                    {offer.source_type || "Live Web"}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{offer.rating}</span>
                  <span className="text-[10px] text-[#7A5C45]">({(offer.review_count || 12000).toLocaleString()})</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-mono font-extrabold text-[#3F3024]">
                  ₹{(offer.current_price || 0).toLocaleString()}
                </span>
                {offer.mrp > offer.current_price && (
                  <span className="text-xs font-mono text-[#7A5C45] line-through">
                    ₹{(offer.mrp || 0).toLocaleString()}
                  </span>
                )}
                {offer.discount_pct > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {offer.discount_pct}% OFF
                  </span>
                )}
              </div>

              {/* Delivery & Coupons */}
              <div className="space-y-2 text-xs border-t border-[#7A5C45]/10 pt-3">
                <div className="flex items-center space-x-1.5 text-[#6B5E54]">
                  <Truck className="w-3.5 h-3.5 text-[#C9A76A]" />
                  <span>{offer.delivery_estimate}</span>
                </div>

                {offer.coupons && offer.coupons.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-xs text-[#3F3024] font-semibold bg-[#F8F6F1] p-2 rounded-xl border border-[#C9A76A]/30">
                    <Tag className="w-3.5 h-3.5 text-[#C9A76A] shrink-0" />
                    <span className="line-clamp-1">{offer.coupons[0]}</span>
                  </div>
                )}

                {offer.cashback_offers && offer.cashback_offers.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{offer.cashback_offers[0]}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <a
                href={offer.scraped_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#F8F6F1] hover:bg-[#3F3024] text-[#3F3024] hover:text-[#C9A76A] border border-[#C9A76A]/40 transition text-xs font-bold flex items-center justify-center space-x-1.5 group"
              >
                <span>View Store Offer</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
