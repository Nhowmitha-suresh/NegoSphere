import React, { useState } from 'react';
import { X, Printer, Download, Bot, ShieldCheck, FileCheck } from 'lucide-react';
import { api } from '../services/api';
import { playGlassTap } from '../utils/audio';

export default function ExportPDFModal({ isOpen, onClose, pipelineData }) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !pipelineData) return null;

  const handleDownloadPdf = async () => {
    playGlassTap();
    setDownloading(true);
    try {
      const query = pipelineData?.price_data?.product_name || 'Samsung S24 Ultra';
      const persona = pipelineData?.coach?.persona || 'Assertive';
      const blob = await api.downloadPdfReport(query, persona);
      
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NegoSphere_Report_${query.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      console.warn("PDF download error, executing print fallback:", e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    playGlassTap();
    window.print();
  };

  const { product_info, price_data, analysis, opportunity, summary, coach, simulation } = pipelineData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3F3024]/40 backdrop-blur-md">
      <div className="bg-[#F8F6F1] border border-[#C9A76A]/40 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-luxury">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3F3024] text-[#C9A76A] font-bold flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#3F3024]">NegoSphere Executive Intelligence Report</h3>
              <p className="text-xs text-[#7A5C45]">Enterprise Procurement Ready PDF Document</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-3.5 py-2 bg-gradient-to-r from-[#3F3024] to-[#5C4535] text-[#C9A76A] hover:opacity-90 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-luxury"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? "Generating PDF..." : "Download Official PDF"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-white text-[#7A5C45] hover:text-[#3F3024] border border-[#7A5C45]/20 text-xs font-bold rounded-xl flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button onClick={() => { playGlassTap(); onClose(); }} className="p-1.5 text-[#7A5C45] hover:bg-[#EBE5D9] rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report" className="space-y-6 text-[#3F3024] text-sm">
          
          {/* Executive Overview Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#C9A76A]/40 shadow-luxury-sm flex justify-between items-center">
            <div>
              <span className="text-[10px] text-[#7A5C45] font-bold uppercase tracking-wider">Product Title</span>
              <h2 className="text-xl font-serif font-bold text-[#3F3024]">{price_data?.product_name || 'Samsung S24 Ultra'}</h2>
              <p className="text-xs text-[#7A5C45] mt-0.5">Category: {price_data?.category || 'Smartphones'} | Brand: {price_data?.brand || 'Samsung'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#7A5C45] font-bold">Negotiation Headroom</span>
              <p className="text-2xl font-black font-mono text-emerald-700">{opportunity?.confidence_score || 88} / 100</p>
              <p className="text-xs text-emerald-800 font-semibold">{opportunity?.opportunity_level || 'HIGH MARGIN'}</p>
            </div>
          </div>

          {/* Key Price Metrics Table */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[#3F3024] border-b border-[#7A5C45]/15 pb-1">Price Benchmarks & Target Offer</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-[#7A5C45]/15">
                <span className="text-[10px] text-[#7A5C45] uppercase font-bold">Lowest Vendor</span>
                <p className="font-mono font-bold text-emerald-700">₹{Number(analysis?.min_price || 118000).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#7A5C45]/15">
                <span className="text-[10px] text-[#7A5C45] uppercase font-bold">Market Average</span>
                <p className="font-mono font-bold text-[#3F3024]">₹{Number(analysis?.avg_price || 124500).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#7A5C45]/15">
                <span className="text-[10px] text-[#7A5C45] uppercase font-bold">Target Bid Offer</span>
                <p className="font-mono font-bold text-[#C9A76A]">₹{Number(analysis?.recommended_target_price || 112000).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#7A5C45]/15">
                <span className="text-[10px] text-[#7A5C45] uppercase font-bold">Estimated Savings</span>
                <p className="font-mono font-bold text-emerald-700">
                  ₹{Number(summary?.money_saved || 22999).toLocaleString('en-IN')} ({summary?.savings_percentage || 15}%)
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Opening Script */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[#3F3024] border-b border-[#7A5C45]/15 pb-1">Recommended Opening Message</h4>
            <div className="p-4 bg-[#F2EEE6] rounded-2xl border border-[#7A5C45]/15 text-xs text-[#3F3024] italic font-medium">
              "{coach?.opening_line || 'Hello, I see your list price is ₹1,29,999. Local wholesale bazaars are fulfilling immediate stock at ₹1,14,000. If we seal the deal today with instant payment, can you match ₹1,12,000?'}"
            </div>
          </div>

          {/* Showdown Battle Outcome */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[#3F3024] border-b border-[#7A5C45]/15 pb-1">Agent-vs-Agent Battle Outcome</h4>
            <div className="p-4 bg-white rounded-2xl border border-[#7A5C45]/15 flex justify-between items-center text-xs">
              <span>Status: <strong className="text-emerald-700">{simulation?.status || 'DEAL AGREED'}</strong></span>
              <span>Final Agreed Price: <strong className="font-mono text-base text-[#3F3024]">₹{Number(simulation?.final_negotiated_price || 112500).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
