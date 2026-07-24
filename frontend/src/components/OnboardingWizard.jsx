import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Cpu, ShieldCheck, Zap } from 'lucide-react';

const CATEGORIES = [
  { id: 'electronics', label: 'Electronics & Tech' },
  { id: 'fashion', label: 'Fashion & Apparel' },
  { id: 'travel', label: 'Travel & Aviation' },
  { id: 'cars', label: 'Automotive & EVs' },
  { id: 'property', label: 'Real Estate & Properties' },
  { id: 'luxury', label: 'Luxury Goods & Watches' }
];

const MARKETPLACES = [
  { id: 'amazon', label: 'Amazon India', region: 'Pan-India Online' },
  { id: 'flipkart', label: 'Flipkart', region: 'Pan-India Online' },
  { id: 'apple', label: 'Apple Store', region: 'Official Flagship' },
  { id: 'reliance', label: 'Reliance Digital', region: 'Retail Outlets' },
  { id: 'croma', label: 'Croma', region: 'Electronics Retail' },
  { id: 'local', label: 'Local Bazaars (Nehru / SP Road)', region: 'Wholesale Bazaars' }
];

export default function OnboardingWizard({ isOpen, onComplete }) {
  const [step, setStep] = useState(1);

  // User selections
  const [selectedCategories, setSelectedCategories] = useState(['electronics', 'luxury']);
  const [selectedMarkets, setSelectedMarkets] = useState(['amazon', 'apple', 'local']);
  const [monthlyBudget, setMonthlyBudget] = useState(250000);
  const [isInitializing, setIsInitializing] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const toggleMarket = (id) => {
    if (selectedMarkets.includes(id)) {
      setSelectedMarkets(selectedMarkets.filter(m => m !== id));
    } else {
      setSelectedMarkets([...selectedMarkets, id]);
    }
  };

  const handleFinishStep4 = () => {
    setIsInitializing(true);
    setTimeout(() => {
      onComplete({
        categories: selectedCategories,
        marketplaces: selectedMarkets,
        monthlyBudget
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F3024]/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-[#F8F6F1] rounded-3xl border border-[#C9A76A]/40 shadow-luxury p-8 sm:p-10 space-y-8">
        
        {/* Top Stepper Indicator */}
        <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#3F3024] text-[#C9A76A] flex items-center justify-center font-bold font-serif shadow-md">
              {step}
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-[#3F3024]">Onboarding Setup</h3>
              <p className="text-[11px] text-[#7A5C45] font-semibold">Step {step} of 4</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-[#C9A76A]' : s < step ? 'w-2 bg-[#7A5C45]' : 'w-2 bg-[#EBE5D9]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Categories */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-serif text-[#3F3024]">What do you buy most?</h2>
              <p className="text-xs text-[#6B5E54]">Select your primary purchasing categories to train agent scraping priorities.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                      active
                        ? 'bg-white border-[#C9A76A] shadow-luxury-sm ring-2 ring-[#C9A76A]/30'
                        : 'glass-card border-[#7A5C45]/15 hover:border-[#7A5C45]/30'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-[#3F3024] uppercase tracking-wider">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Preferred Marketplaces */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-serif text-[#3F3024]">Preferred Marketplaces</h2>
              <p className="text-xs text-[#6B5E54]">Which platforms and bazaars should NegoSphere monitor for pricing data?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MARKETPLACES.map((m) => {
                const active = selectedMarkets.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMarket(m.id)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                      active
                        ? 'bg-white border-[#C9A76A] shadow-luxury-sm ring-2 ring-[#C9A76A]/30'
                        : 'glass-card border-[#7A5C45]/15 hover:border-[#7A5C45]/30'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#3F3024]">{m.label}</div>
                      <div className="text-[10px] text-[#7A5C45] font-medium">{m.region}</div>
                    </div>
                    {active && <CheckCircle2 className="w-5 h-5 text-[#C9A76A]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Monthly Budget */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-serif text-[#3F3024]">Monthly Procurement Budget</h2>
              <p className="text-xs text-[#6B5E54]">Set your average monthly purchasing capital to customize savings goals.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#C9A76A]/30 shadow-luxury text-center space-y-6">
              <div className="text-4xl font-extrabold font-serif text-[#3F3024]">
                ₹{monthlyBudget.toLocaleString('en-IN')}
                <span className="text-xs font-sans text-[#7A5C45] font-semibold ml-2">/ month</span>
              </div>

              <input
                type="range"
                min={25000}
                max={2000000}
                step={25000}
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full h-2 bg-[#EBE5D9] rounded-lg appearance-none cursor-pointer accent-[#C9A76A]"
              />

              <div className="flex justify-between text-[11px] font-bold text-[#7A5C45]">
                <span>₹25,000</span>
                <span>₹10,000,000+</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: AI Personalization Completion */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="w-20 h-20 rounded-full bg-white border border-[#C9A76A] shadow-luxury flex items-center justify-center mx-auto">
              <Cpu className="w-10 h-10 text-[#7A5C45] animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-serif text-[#3F3024]">AI Agent Personalization</h2>
              <p className="text-xs text-[#6B5E54]">Calibrating 8 multi-agent neural parameters for your preferred categories and marketplaces.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-[#7A5C45]/15 text-left text-xs space-y-2 text-[#3F3024]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A76A]" />
                <span>Product Taxonomy & Scraper Engines Calibrated</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A76A]" />
                <span>Dual LLM Engine Ready (Gemini & GPT-4o Heuristics)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C9A76A]" />
                <span>Showdown Battle Arena & Coach Personas Initialized</span>
              </div>
            </div>

            {isInitializing && (
              <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[#C9A76A] py-2">
                <Zap className="w-4 h-4 animate-bounce" />
                <span>Opening NegoSphere Operating System...</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-[#7A5C45]/15 pt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl btn-luxury-outline text-xs font-bold flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl btn-luxury-gold text-xs font-bold flex items-center space-x-2 shadow-luxury-gold"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishStep4}
              disabled={isInitializing}
              className="px-8 py-3 rounded-xl btn-luxury-gold text-xs font-extrabold flex items-center space-x-2 shadow-luxury-gold"
            >
              <span>Launch NegoSphere OS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
