import React, { useState } from 'react';
import { Shield, Sparkles, Cpu, Lock, Mail, User, ArrowRight, Github, Fingerprint, Key, Layers, History, Laptop, AlertCircle } from 'lucide-react';
import { playGlassTap } from '../utils/audio';
import { api } from '../services/api';
import NegoSphereLogo3D from './NegoSphereLogo3D';


export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState('password');

  // Form State
  const [email, setEmail] = useState('executive@company.com');
  const [password, setPassword] = useState('NegoSphere2026!');
  const [firstName, setFirstName] = useState('Alexander');
  const [lastName, setLastName] = useState('Vance');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    playGlassTap();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const res = await api.registerUser({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          accept_terms: true
        });

        if (res.status === 'success') {
          onAuthSuccess({
            id: res.user?.id,
            name: `${firstName} ${lastName}`,
            email: res.user?.email || email,
            role: 'Enterprise User',
            devOtpCode: res.dev_otp_code
          });
        }

      } else {
        const res = await api.loginUser({ email, password, remember_me: remember });
        if (res.status === 'success' || res.status === 'requires_verification') {
          onAuthSuccess({
            id: res.user?.id || 'usr-1',
            name: res.user?.name || `${firstName} ${lastName}`,
            email,
            role: res.user?.role || 'Enterprise User'
          });
        }
      }
    } catch (err) {
      const detail = err.response?.data?.detail || "Authentication failed. Please check your credentials.";
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F3024]/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Outer Glass Card Container */}
      <div className="relative max-w-4xl w-full bg-[#F8F6F1]/95 backdrop-blur-2xl rounded-3xl border border-[#C9A76A]/30 shadow-luxury overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Luxury AI Graphic */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#F2EEE6] via-[#EBE5D9] to-[#F8F6F1] relative overflow-hidden border-r border-[#7A5C45]/10">
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center space-x-2">
              <NegoSphereLogo3D size={48} animateAssembly={false} mode="idle" />
              <span className="text-xl font-bold font-serif text-[#3F3024]">NegoSphere</span>
            </div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-[#C9A76A]">
              Enterprise AI Procurement OS
            </p>
          </div>


          <div className="relative my-8 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white/70 backdrop-blur-xl border border-[#C9A76A]/40 shadow-luxury flex flex-col items-center justify-center p-4 z-10">
              <Sparkles className="w-8 h-8 text-[#C9A76A] mb-1 animate-pulse" />
              <span className="text-xs font-bold font-serif text-[#3F3024]">Passkey 2FA</span>
              <span className="text-[9px] uppercase tracking-wider text-[#7A5C45]">Encrypted</span>
            </div>

            <div className="absolute -top-4 left-4 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#7A5C45]/15 text-[10px] font-extrabold text-[#3F3024] shadow-sm uppercase tracking-wider">
              Amazon India
            </div>
            <div className="absolute top-8 right-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#7A5C45]/15 text-[10px] font-extrabold text-[#3F3024] shadow-sm uppercase tracking-wider">
              Apple Store
            </div>
            <div className="absolute -bottom-4 left-6 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#7A5C45]/15 text-[10px] font-extrabold text-[#3F3024] shadow-sm uppercase tracking-wider">
              Flipkart
            </div>
            <div className="absolute bottom-6 right-4 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#7A5C45]/15 text-[10px] font-extrabold text-[#3F3024] shadow-sm uppercase tracking-wider">
              Nehru Wholesale
            </div>
          </div>

          <div className="space-y-2 relative z-10 text-xs">
            <div className="font-bold text-[#3F3024] flex items-center space-x-1.5">
              <Laptop className="w-4 h-4 text-[#C9A76A]" />
              <span>Hardware Encrypted Session</span>
            </div>
            <p className="text-[11px] text-[#6B5E54]">
              Protected with argon2 / bcrypt password hashing & JWT token rotation.
            </p>
          </div>

        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5 relative">
          
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#3F3024]">
              {isSignUp ? 'Enterprise Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-[#6B5E54]">
              {isSignUp
                ? 'Create a verified corporate profile for NegoSphere OS'
                : 'Select your preferred enterprise authentication method'}
            </p>
          </div>

          {/* Social OAuth buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {['Google', 'Apple', 'Microsoft', 'GitHub'].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={handleSubmit}
                className="py-2 px-3 rounded-xl border border-[#7A5C45]/20 bg-white/80 hover:bg-white text-[#3F3024] flex items-center justify-center space-x-1.5 transition shadow-sm"
              >
                <span>{provider}</span>
              </button>
            ))}
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-800 font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Auth Forms */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-[#7A5C45]">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    placeholder="Alexander"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-[#7A5C45]">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                    placeholder="Vance"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-[#7A5C45]">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="executive@company.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-[#7A5C45]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3F3024] to-[#5C4535] text-[#C9A76A] font-bold text-sm shadow-luxury hover:opacity-95 transition flex items-center justify-center space-x-2 mt-4"
            >
              <span>{loading ? "Authenticating..." : isSignUp ? "Create Enterprise Account" : "Sign In with Security Code"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { playGlassTap(); setIsSignUp(!isSignUp); setErrorMsg(null); }}
              className="text-xs font-bold text-[#7A5C45] hover:text-[#3F3024] transition"
            >
              {isSignUp ? "Already registered? Sign In" : "Need an enterprise account? Create one"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
