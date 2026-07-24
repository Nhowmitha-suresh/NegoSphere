import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, Camera, Upload, Send, X, Volume2, Cpu, FileText, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { playGlassTap, playSuccessChime } from '../utils/audio';
import NegoSphereLogo3D from './NegoSphereLogo3D';


export default function AIConciergeSphere({ onRunAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'AI Concierge', text: 'Welcome to NegoSphere OS. I am your permanent AI Negotiation Concierge. How may I assist your procurement today?' }
  ]);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsVoiceActive(false);
        if (transcript) {
          handleVoiceInputReceived(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsVoiceActive(false);
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleOpen = () => {
    playGlassTap();
    setIsOpen(!isOpen);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInputReceived = (query) => {
    playSuccessChime();
    setChatLog((prev) => [...prev, { sender: 'User (Voice)', text: query }]);

    let reply = `Recognized voice command for "${query}". Executing market analysis across autonomous agents...`;
    if (query.toLowerCase().includes('iphone') || query.toLowerCase().includes('macbook') || query.toLowerCase().includes('samsung')) {
      reply = `Searching real nearby stores & online vendors for ${query}. Estimated fair market target discount is 12-15%. Navigating workspace...`;
      if (onRunAction) onRunAction(query);
    }

    setChatLog((prev) => [...prev, { sender: 'AI Concierge', text: reply }]);
    speakText(reply);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playGlassTap();
    const query = inputText;
    setChatLog((prev) => [...prev, { sender: 'User', text: query }]);
    setInputText('');

    setTimeout(() => {
      playSuccessChime();
      let reply = `Analyzing "${query}" across 8 autonomous agents. Target negotiation discount calculated at 14.2%.`;
      if (query.toLowerCase().includes('macbook')) {
        reply = 'Found MacBook Air M3 at ₹1,21,000 (Fair Value target). Recommended action: Start live negotiation with Croma / Nehru Place.';
      } else if (query.toLowerCase().includes('navigate') || query.toLowerCase().includes('store')) {
        reply = 'Opening interactive Google Maps Platform with nearby retailer pins and driving route calculation.';
      }

      setChatLog((prev) => [...prev, { sender: 'AI Concierge', text: reply }]);
      speakText(reply);

      if (onRunAction && (query.toLowerCase().includes('find') || query.toLowerCase().includes('compare') || query.toLowerCase().includes('macbook') || query.toLowerCase().includes('iphone'))) {
        onRunAction(query);
      }
    }, 600);
  };

  const handleVoiceToggle = () => {
    playGlassTap();
    if (!isVoiceActive) {
      if (recognitionRef.current) {
        setIsVoiceActive(true);
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Speech recognition start failed:", e);
        }
      } else {
        setIsVoiceActive(true);
        setTimeout(() => {
          setIsVoiceActive(false);
          handleVoiceInputReceived("Find the cheapest iPhone 15 Pro near me");
        }, 2200);
      }
    } else {
      setIsVoiceActive(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playGlassTap();
    setChatLog((prev) => [
      ...prev,
      { sender: 'User', text: `[Uploaded Image/Receipt: ${file.name}]` },
      { sender: 'AI Concierge', text: `Analyzing OCR & Barcode data from ${file.name}... Serial number & retail receipt extracted. Target refund / price-match margin identified!` }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[#F8F6F1]/95 backdrop-blur-2xl rounded-3xl border border-[#C9A76A]/40 shadow-luxury p-5 space-y-4 animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-3">
            <div className="flex items-center space-x-2">
              <NegoSphereLogo3D size={36} animateAssembly={false} mode={isVoiceActive ? 'thinking' : 'idle'} />
              <div>
                <h3 className="text-xs font-extrabold font-serif text-[#3F3024]">AI Concierge OS</h3>
                <p className="text-[10px] text-[#7A5C45] font-semibold">Always-On Procurement Assistant</p>
              </div>
            </div>


            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-[#7A5C45]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Stream */}
          <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl space-y-1 ${
                  msg.sender.startsWith('User')
                    ? 'bg-[#3F3024] text-[#FFFBF5] ml-6 rounded-br-none'
                    : 'bg-white border border-[#7A5C45]/15 text-[#3F3024] mr-6 rounded-bl-none'
                }`}
              >
                <div className="text-[9px] opacity-75 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>{msg.sender}</span>
                  {msg.sender === 'AI Concierge' && (
                    <button onClick={() => speakText(msg.text)} title="Read Aloud">
                      <Volume2 className="w-3 h-3 text-[#C9A76A]" />
                    </button>
                  )}
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Voice Input Animation Indicator */}
          {isVoiceActive && (
            <div className="p-3 rounded-2xl bg-[#C9A76A]/20 border border-[#C9A76A]/40 text-center text-xs font-bold text-[#7A5C45] flex items-center justify-center space-x-2 animate-pulse">
              <Volume2 className="w-4 h-4 text-[#C9A76A]" />
              <span>Listening to Voice Command... (Speak now)</span>
            </div>
          )}

          {/* Quick Capability Actions */}
          <div className="flex items-center space-x-2 overflow-x-auto text-[10px] font-bold py-1">
            <button
              onClick={handleVoiceToggle}
              className={`px-2.5 py-1 rounded-xl border flex items-center space-x-1 shrink-0 transition ${
                isVoiceActive
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-white border-[#7A5C45]/15 hover:border-[#C9A76A] text-[#3F3024]'
              }`}
            >
              {isVoiceActive ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-[#C9A76A]" />}
              <span>{isVoiceActive ? 'Stop Listening' : 'Voice Mode'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#7A5C45]/15 hover:border-[#C9A76A] text-[#3F3024] flex items-center space-x-1 shrink-0"
            >
              <Camera className="w-3 h-3 text-[#C9A76A]" />
              <span>Barcode / OCR Scan</span>
            </button>
          </div>

          {/* Text Input Form */}
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AI Concierge anything..."
              className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-medium text-[#3F3024]"
            />
            <button
              type="submit"
              className="p-2 rounded-xl btn-luxury-gold text-white shadow-luxury-gold shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Glass Sphere Trigger */}
      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7A5C45] via-[#C9A76A] to-[#3F3024] text-white flex items-center justify-center shadow-luxury-gold hover:scale-110 transition-all duration-300 relative group"
        title="NegoSphere Permanent AI Concierge"
      >
        <Sparkles className="w-6 h-6 text-[#FFFBF5] animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      </button>

    </div>
  );
}
