import React from 'react';
import { X, Printer, Download, Bot, ShieldCheck } from 'lucide-react';

export default function ExportPDFModal({ isOpen, onClose, pipelineData }) {
  if (!isOpen || !pipelineData) return null;

  const handlePrint = () => {
    window.print();
  };

  const { product_info, price_data, analysis, opportunity, summary, coach, simulation } = pipelineData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0B0F19] border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-brand-500" />
            <div>
              <h3 className="text-lg font-bold text-white">NegoSphere Executive Intelligence Report</h3>
              <p className="text-xs text-slate-400">Deloitte Interview & Portfolio Ready PDF Export</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report" className="space-y-6 text-slate-200 text-sm">
          
          {/* Executive Overview Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Product Title</span>
              <h2 className="text-xl font-extrabold text-white">{price_data?.product_name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Category: {price_data?.category} | Brand: {price_data?.brand}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold">Negotiation Headroom</span>
              <p className="text-2xl font-black text-emerald-400">{opportunity?.confidence_score} / 100</p>
              <p className="text-xs text-emerald-400 font-semibold">{opportunity?.opportunity_level}</p>
            </div>
          </div>

          {/* Key Price Metrics Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-white border-b border-slate-800 pb-1">Price Benchmarks & Target Offer</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Lowest Vendor</span>
                <p className="font-bold text-emerald-400">₹{Number(analysis?.min_price || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Market Average</span>
                <p className="font-bold text-slate-200">₹{Number(analysis?.avg_price || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Target Negotiated Bid</span>
                <p className="font-bold text-brand-400">₹{Number(analysis?.recommended_target_price || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Projected Savings</span>
                <p className="font-bold text-emerald-400">
                  ₹{Number(summary?.money_saved || 0).toLocaleString('en-IN')} ({summary?.savings_percentage}%)
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Opening Script */}
          <div className="space-y-2">
            <h4 className="font-bold text-white border-b border-slate-800 pb-1">Recommended Opening Message</h4>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 italic">
              "{coach?.opening_line}"
            </div>
          </div>

          {/* Showdown Battle Outcome */}
          <div className="space-y-2">
            <h4 className="font-bold text-white border-b border-slate-800 pb-1">Agent-vs-Agent Battle Outcome</h4>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
              <span>Status: <strong className="text-emerald-400">{simulation?.status}</strong></span>
              <span>Final Agreed Price: <strong className="text-white">₹{Number(simulation?.final_negotiated_price || 0).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
