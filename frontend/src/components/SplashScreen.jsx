import React, { useState, useEffect } from 'react';
import CinematicSphereCanvas from './CinematicSphereCanvas';
import NegoSphereLogo3D from './NegoSphereLogo3D';
import { playAmbientDrone, playGlassTap, playCinematicBoom, playSuccessChime } from '../utils/audio';

const TRANSITION_LOADING_STEPS = [
  "Authenticating Secure Session...",
  "Connecting AI Intelligence...",
  "Preparing Personal Workspace...",
  "Loading Dashboard..."
];

export default function SplashScreen({ onComplete }) {
  // Timeline phases: 'particles' | 'glow' | 'logo_fade' | 'typography' | 'cta_ready' | 'loading_transition'
  const [phase, setPhase] = useState('particles');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  useEffect(() => {
    // 1. Play deep ambient bass drone
    playAmbientDrone();

    // 2. Timed 3-4s luxury reveal sequence
    const timer1 = setTimeout(() => setPhase('glow'), 800);
    const timer2 = setTimeout(() => {
      setPhase('logo_fade');
      playCinematicBoom();
    }, 1600);
    const timer3 = setTimeout(() => setPhase('typography'), 2600);
    const timer4 = setTimeout(() => setPhase('cta_ready'), 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleEnterClick = () => {
    playGlassTap();
    setPhase('loading_transition');

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < TRANSITION_LOADING_STEPS.length) {
        setLoadingStepIndex(currentStep);
      } else {
        clearInterval(interval);
        playSuccessChime();
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080A0F] text-[#FFFBF5] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
      
      {/* Radial Gold Ambient Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(201,167,106,0.12)_0%,_transparent_70%)] pointer-events-none blur-3xl animate-pulse" />

      {/* Floating 3D Gold Particles Canvas */}
      <CinematicSphereCanvas phase={phase === 'loading_transition' ? 'orbit' : 'logo'} />

      {/* Main Content Area */}
      {phase !== 'loading_transition' ? (
        <div className="relative z-10 max-w-xl w-full mx-auto text-center space-y-8 flex flex-col items-center justify-center min-h-[420px]">
          
          {/* Logo Container with Soft Glow */}
          <div className="relative flex items-center justify-center">
            {/* Soft Glow behind logo */}
            {(phase === 'glow' || phase === 'logo_fade' || phase === 'typography' || phase === 'cta_ready') && (
              <div className="absolute w-48 h-48 rounded-full bg-[#C9A76A]/20 blur-2xl animate-pulse" />
            )}

            {/* Official NegoSphere Emblem */}
            <div className={`transition-opacity duration-1000 ${
              phase === 'particles' || phase === 'glow' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              <NegoSphereLogo3D size={220} theme="dark" mode="idle" animateAssembly={true} />
            </div>
          </div>

          {/* Typography Reveal */}
          <div className={`space-y-2 transition-all duration-1000 transform ${
            phase === 'typography' || phase === 'cta_ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-[#FFFBF5]">
              NEGO<span className="bg-gradient-to-r from-[#C9A76A] via-[#FFFBF5] to-[#E6C887] bg-clip-text text-transparent">SPHERE</span>
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A76A]">
              AI Negotiation Operating System
            </p>
          </div>

          {/* Primary CTA Button: ENTER NEGOSPHERE */}
          <div className={`pt-4 transition-all duration-1000 transform ${
            phase === 'cta_ready' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}>
            <button
              onClick={handleEnterClick}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#C9A76A] via-[#E6C887] to-[#C9A76A] text-[#3F3024] text-xs font-extrabold tracking-[0.25em] uppercase shadow-luxury-gold hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 relative overflow-hidden group border border-[#FFF6E5]/40"
            >
              <span className="relative z-10">ENTER NEGOSPHERE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

        </div>
      ) : (
        /* Sequential Loading Messages Transition (Fade to Black) */
        <div className="relative z-20 max-w-md w-full text-center space-y-6 animate-fadeIn">
          <div className="w-12 h-12 rounded-full border-2 border-[#C9A76A] border-t-transparent animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-sm font-serif font-bold text-[#FFFBF5] tracking-wide animate-pulse">
              {TRANSITION_LOADING_STEPS[loadingStepIndex]}
            </p>
            <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C9A76A] to-[#E6C887] transition-all duration-500"
                style={{ width: `${((loadingStepIndex + 1) / TRANSITION_LOADING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
