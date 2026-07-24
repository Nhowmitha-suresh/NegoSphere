import React, { useState } from 'react';
import { Shield, Key, Smartphone, Laptop, Globe, CheckCircle2, Lock, AlertTriangle, LogOut, RefreshCw } from 'lucide-react';
import { playGlassTap, playSuccessChime } from '../utils/audio';

const INITIAL_SESSIONS = [
  { id: 'sess-1', device: 'MacBook Pro M3 Max', browser: 'Arc Browser / Chrome', os: 'macOS Sonoma', ip: '103.22.180.4 (New Delhi)', active: 'Current Session', isCurrent: true },
  { id: 'sess-2', device: 'iPhone 15 Pro Max', browser: 'Safari Mobile', os: 'iOS 17.4', ip: '49.36.120.12 (Mumbai)', active: '2 hours ago', isCurrent: false },
  { id: 'sess-3', device: 'Windows Workstation', browser: 'Edge Enterprise', os: 'Windows 11 Pro', ip: '182.74.90.5 (Bengaluru)', active: 'Yesterday', isCurrent: false }
];

export default function SecurityCenterView() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [passkeyEnabled, setPasskeyEnabled] = useState(true);
  const [revokedMessage, setRevokedMessage] = useState('');

  const handleLogoutSession = (sessionId) => {
    playGlassTap();
    setSessions(sessions.filter(s => s.id !== sessionId));
    setRevokedMessage('Session revoked successfully.');
    setTimeout(() => setRevokedMessage(''), 3000);
  };

  const handleLogoutAllOther = () => {
    playGlassTap();
    setSessions(sessions.filter(s => s.isCurrent));
    setRevokedMessage('All other active sessions have been logged out.');
    setTimeout(() => setRevokedMessage(''), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-[#7A5C45]/15 space-y-2 shadow-luxury-sm">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C9A76A]/20 text-[#7A5C45] text-xs font-bold">
          <Shield className="w-3.5 h-3.5 text-[#C9A76A]" />
          <span>Enterprise Security & Identity Center</span>
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#3F3024]">
          Security & Session Management
        </h2>
        <p className="text-xs text-[#6B5E54]">
          Manage multi-factor authentication, hardware passkeys, active devices, and security audit logs.
        </p>
      </div>

      {revokedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{revokedMessage}</span>
        </div>
      )}

      {/* Active Device Sessions List */}
      <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-6 shadow-luxury-sm">
        
        <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-4">
          <div>
            <h3 className="text-base font-bold font-serif text-[#3F3024]">Active Devices & Login Sessions</h3>
            <p className="text-xs text-[#7A5C45]">Revoke unrecognized devices or terminate suspicious sessions instantly.</p>
          </div>

          <button
            onClick={handleLogoutAllOther}
            className="px-4 py-2 rounded-xl btn-luxury-outline text-xs font-bold flex items-center space-x-2 text-rose-700 hover:border-rose-400"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Other Devices</span>
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-white/80 border border-[#7A5C45]/12 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#3F3024] text-[#C9A76A] flex items-center justify-center">
                  {s.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-[#3F3024] flex items-center space-x-2">
                    <span>{s.device}</span>
                    {s.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#7A5C45]">{s.browser} • {s.os} • IP: {s.ip}</div>
                </div>
              </div>

              {!s.isCurrent && (
                <button
                  onClick={() => handleLogoutSession(s.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-[11px] font-bold transition"
                >
                  Logout Device
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* MFA & Hardware Passkeys Card */}
      <div className="p-6 rounded-3xl glass-card border border-[#7A5C45]/15 space-y-6 shadow-luxury-sm">
        
        <h3 className="text-base font-bold font-serif text-[#3F3024] border-b border-[#7A5C45]/15 pb-3">
          Multi-Factor Authentication & Passkeys
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-white border border-[#7A5C45]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#3F3024]">Hardware Passkeys (WebAuthn)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">ACTIVE</span>
            </div>
            <p className="text-[11px] text-[#7A5C45]">Use YubiKey, Apple Touch ID, or Windows Hello for passwordless login.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#7A5C45]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#3F3024]">Authenticator App (TOTP)</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">ACTIVE</span>
            </div>
            <p className="text-[11px] text-[#7A5C45]">Google Authenticator / 1Password 6-digit TOTP verification codes.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
