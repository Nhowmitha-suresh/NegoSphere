import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AgentPipelineProgress from './components/AgentPipelineProgress';
import PriceAnalytics from './components/PriceAnalytics';
import OpportunityScore from './components/OpportunityScore';
import CoachPanel from './components/CoachPanel';
import ShowdownArena from './components/ShowdownArena';
import DealSummaryCard from './components/DealSummaryCard';
import SavedHistory from './components/SavedHistory';
import ExportPDFModal from './components/ExportPDFModal';
import { api } from './services/api';
import { Search, Sparkles, Bot, ShieldCheck, ArrowRight, RefreshCw, Zap } from 'lucide-react';

const PRESET_PRODUCTS = [
  'Samsung S24 Ultra',
  'MacBook Air M3',
  'Sony WH-1000XM5',
  'Sony PlayStation 5 Slim'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('Samsung S24 Ultra');
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineData, setPipelineData] = useState(null);

  const [currentPersona, setCurrentPersona] = useState('Assertive');
  const [currentLang, setCurrentLang] = useState('English');
  const [currentSeller, setCurrentSeller] = useState('Flexible');

  const [historyList, setHistoryList] = useState([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Auto-run default search on mount
  useEffect(() => {
    handleSearch('Samsung S24 Ultra');
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      if (Array.isArray(data)) {
        setHistoryList(data);
      }
    } catch (e) {
      console.warn("Could not load history:", e);
    }
  };

  const handleSearch = async (queryToRun) => {
    const q = queryToRun || searchQuery;
    if (!q.trim()) return;

    setLoading(true);
    setPipelineStep(1);

    // Simulate animated step progression through agents
    const timer = setInterval(() => {
      setPipelineStep((prev) => (prev < 8 ? prev + 1 : prev));
    }, 250);

    try {
      const result = await api.runFullPipeline(q, currentPersona, currentLang, currentSeller);
      clearInterval(timer);
      setPipelineStep(8);
      setPipelineData(result);
      loadHistory();
    } catch (err) {
      console.error("Pipeline run error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateCoach = async (persona, lang) => {
    setCurrentPersona(persona);
    setCurrentLang(lang);
    if (pipelineData) {
      try {
        const res = await api.generateNegotiation(pipelineData.query, persona, lang);
        setPipelineData((prev) => ({
          ...prev,
          coach: res.coach,
          multi_lang: res.multi_lang
        }));
      } catch (e) {
        console.error("Could not regenerate coach:", e);
      }
    }
  };

  const handleRunSimulation = async (buyerPersona, sellerPersonality) => {
    setCurrentSeller(sellerPersonality);
    if (pipelineData) {
      try {
        const simRes = await api.runSimulation(pipelineData.query, buyerPersona, sellerPersonality);
        setPipelineData((prev) => ({
          ...prev,
          simulation: simRes
        }));
      } catch (e) {
        console.error("Could not run simulation:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isLiveMode={true} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search Hero Section */}
        <section className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Negotiation Coach & Battle Simulator</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit leading-tight">
              Master Product Negotiations with <span className="text-gradient">AI Agent Intelligence</span>
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base">
              Collect prices across vendors, calculate fair target bids, generate persona-matched scripts in 6 languages, and run automated Agent-vs-Agent showdowns.
            </p>

            {/* Input Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchQuery);
              }}
              className="flex flex-col sm:flex-row items-center gap-3 pt-2"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter product (e.g. Samsung S24 Ultra, MacBook Air M3, PS5 Slim)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-sm font-medium text-white placeholder-slate-500 shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-current" />
                )}
                <span>{loading ? 'Orchestrating...' : 'Analyze & Showdown'}</span>
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs">
              <span className="text-slate-400 font-semibold whitespace-nowrap">Try Demo Products:</span>
              {PRESET_PRODUCTS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSearchQuery(p);
                    handleSearch(p);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Live Multi-Agent Execution Progress Stepper */}
        <AgentPipelineProgress currentStep={pipelineStep} isComplete={pipelineStep === 8 && !loading} />

        {/* Tab 1: Deal Finder & Search Summary */}
        {activeTab === 'search' && pipelineData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Opportunity 0-100 Score Gauge */}
            <OpportunityScore opportunity={pipelineData.opportunity} />

            {/* Shareable Deal Victory Card */}
            <DealSummaryCard
              summary={pipelineData.summary}
              onExportPDF={() => setIsPdfModalOpen(true)}
            />

            {/* Quick Analytics & Coach Teasers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>Price Analytics Overview</span>
                  <button onClick={() => setActiveTab('analytics')} className="text-xs text-brand-400 hover:underline">
                    View Full Charts →
                  </button>
                </h3>
                <PriceAnalytics data={pipelineData} />
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>Negotiation Coach Preview</span>
                  <button onClick={() => setActiveTab('coach')} className="text-xs text-brand-400 hover:underline">
                    Customize Scripts →
                  </button>
                </h3>
                <CoachPanel
                  coachData={pipelineData.coach}
                  multiLangData={pipelineData.multi_lang}
                  onRegenerate={handleRegenerateCoach}
                  currentPersona={currentPersona}
                  currentLang={currentLang}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Price Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            <PriceAnalytics data={pipelineData} />
          </div>
        )}

        {/* Tab 3: AI Coach & Multi-Language Scripts */}
        {activeTab === 'coach' && (
          <div className="space-y-8 animate-fadeIn">
            <CoachPanel
              coachData={pipelineData?.coach}
              multiLangData={pipelineData?.multi_lang}
              onRegenerate={handleRegenerateCoach}
              currentPersona={currentPersona}
              currentLang={currentLang}
            />
          </div>
        )}

        {/* Tab 4: Agent Showdown Battle Arena */}
        {activeTab === 'showdown' && (
          <div className="space-y-8 animate-fadeIn">
            <ShowdownArena
              simulation={pipelineData?.simulation}
              onRunSimulation={handleRunSimulation}
              isSimulating={loading}
            />
          </div>
        )}

        {/* Tab 5: Saved History */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-fadeIn">
            <SavedHistory
              historyData={historyList}
              onSelectProduct={(name) => {
                setSearchQuery(name);
                setActiveTab('search');
                handleSearch(name);
              }}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-slate-300">AI Negotiator Showdown</span>
            <span>— Production Multi-Agent Intelligence Engine</span>
          </div>
          <p>Deloitte Technical Portfolio Project • Built with FastAPI & React Vite</p>
        </div>
      </footer>

      {/* PDF Export Modal */}
      <ExportPDFModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pipelineData={pipelineData}
      />

    </div>
  );
}
