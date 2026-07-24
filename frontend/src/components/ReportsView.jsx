import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, Sparkles, Share2 } from 'lucide-react';

export default function ReportsView({ pipelineData }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-luxury-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
            <FileText className="w-3.5 h-3.5 text-[#C9A76A]" />
            <span>Executive Audit & Victory Reports</span>
          </div>
          <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
            Negotiation Victory Card & PDF Report
          </h2>
          <p className="text-xs text-[#6B5E54]">
            Generate corporate audit logs, savings verification receipts, and multi-agent breakdown reports.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-6 py-3 rounded-2xl btn-luxury-gold text-xs font-extrabold flex items-center space-x-2 shadow-luxury-gold"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PDF...' : 'Export PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Print-Ready Report Card Preview */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#C9A76A]/40 shadow-luxury space-y-8 max-w-4xl mx-auto">
        
        {/* Report Header */}
        <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-6">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#3F3024]">NegoSphere Executive Report</h1>
            <p className="text-xs text-[#7A5C45] font-semibold">Audit Reference: #NS-2026-88492</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#3F3024]">Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="text-[10px] text-emerald-700 font-extrabold">STATUS: VERIFIED SAVINGS</div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8F6F1] border border-[#7A5C45]/15 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#7A5C45]">Original Retail Price</div>
            <div className="text-xl font-bold font-serif text-[#3F3024]">₹1,29,999</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8F6F1] border border-[#7A5C45]/15 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#C9A76A]">Agreed Final Settlement</div>
            <div className="text-xl font-bold font-serif text-[#7A5C45]">₹1,14,500</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8F6F1] border border-[#7A5C45]/15 space-y-1">
            <div className="text-[10px] uppercase font-bold text-emerald-700">Net Money Saved</div>
            <div className="text-xl font-extrabold font-serif text-emerald-700">₹15,499 (11.9%)</div>
          </div>
        </div>

        {/* Agent Chain Verification */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7A5C45]">8-Agent Verification Audit Trail</h3>
          <div className="space-y-2 text-xs text-[#3F3024]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9A76A]" />
              <span>Product Agent: Taxonomy normalized & search tags validated</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9A76A]" />
              <span>Scraper Agent: 5 multi-vendor price matrices collected (Amazon, Flipkart, Nehru Place)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9A76A]" />
              <span>Price Analysis Agent: Standard deviation variance σ=4200 calculated</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9A76A]" />
              <span>Opportunity Agent: 94.8 / 100 confidence score certified</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
