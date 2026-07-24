import React from 'react';
import NegoSphereLogo3D from './NegoSphereLogo3D';

export default function WelcomeScreen({ onBegin }) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFBF5] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none animate-fadeIn duration-1000">
      
      {/* Soft warm spotlight overlay */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#C9A76A]/10 via-[#7A5C45]/05 to-transparent filter blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto text-center space-y-12 relative z-10">

        {/* Centered 3D Gold Emblem */}
        <div className="flex items-center justify-center">
          <NegoSphereLogo3D size={200} animateAssembly={false} />
        </div>

        {/* Clean Luxury Titles */}
        <div className="space-y-3 animate-fadeIn duration-1000">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-serif text-[#FFFBF5]">
            NEGO<span className="text-gradient-gold">SPHERE</span>
          </h1>
          
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#C9A76A]">
            AI Negotiation Intelligence Platform
          </p>
        </div>

        {/* Action Button: ENTER NEGOSPHERE */}
        <div className="pt-4 animate-fadeIn duration-1000">
          <button
            onClick={onBegin}
            className="px-12 py-4 rounded-full btn-luxury-gold text-xs font-extrabold tracking-[0.25em] uppercase shadow-luxury-gold hover:scale-[1.02] transition-all duration-300 mx-auto"
          >
            ENTER NEGOSPHERE
          </button>
        </div>

      </div>
    </div>
  );
}
