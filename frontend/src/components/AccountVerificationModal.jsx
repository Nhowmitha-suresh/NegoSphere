import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Bell, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { playGlassTap, playSuccessChime } from '../utils/audio';
import { api } from '../services/api';

export default function AccountVerificationModal({ isOpen, userEmail = "executive@company.com", devOtpCode = null, onComplete, onBack }) {
  const [otpCode, setOtpCode] = useState(devOtpCode || '');
  const [currentDevCode, setCurrentDevCode] = useState(devOtpCode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    if (devOtpCode) {
      setOtpCode(devOtpCode);
      setCurrentDevCode(devOtpCode);
    }
  }, [devOtpCode]);

  useEffect(() => {
    let interval = null;
    if (isOpen && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, timerSeconds]);

  if (!isOpen) return null;

  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    playGlassTap();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.verifyOtp(userEmail, otpCode);
      if (res.status === 'success') {
        playSuccessChime();
        setVerifiedSuccess(true);
        setSuccessMsg("Email verified successfully! Opening Workspace...");
        setTimeout(() => {
          setVerifiedSuccess(false);
          onComplete(); // Streamlined direct navigation to Dashboard!
        }, 800);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || "Verification failed. Please check the code and try again.";
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    playGlassTap();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.resendEmailOtp(userEmail);
      if (res.status === 'success') {
        if (res.dev_otp_code) {
          setOtpCode(res.dev_otp_code);
          setCurrentDevCode(res.dev_otp_code);
        }
        setSuccessMsg(`A new 6-digit code was sent to ${userEmail}.`);
        setTimerSeconds(60);
        setCanResend(false);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to resend verification code.";
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F3024]/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-[#F8F6F1] rounded-3xl border border-[#C9A76A]/40 shadow-luxury p-8 space-y-6 animate-fadeIn relative">
        
        {/* Header with Back Navigation */}
        <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-4">
          <button
            type="button"
            onClick={() => { playGlassTap(); if (onBack) onBack(); }}
            className="flex items-center space-x-1.5 text-xs text-[#7A5C45] hover:text-[#3F3024] font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>

          <span className="text-xs font-bold text-[#C9A76A] uppercase tracking-wider bg-[#C9A76A]/10 px-2.5 py-0.5 rounded-full border border-[#C9A76A]/30">
            Email Verification
          </span>
        </div>

        {/* Verify Email Body */}
        <div className="space-y-5 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3F3024] to-[#5C4535] text-[#C9A76A] mx-auto flex items-center justify-center shadow-luxury">
              <Mail className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold font-serif text-[#3F3024]">Verify Your Email</h4>
            <p className="text-xs text-[#7A5C45]">
              We sent a 6-digit verification code to <strong className="text-[#3F3024]">{userEmail}</strong>.
            </p>

            {currentDevCode && (
              <div className="p-3 rounded-2xl bg-[#C9A76A]/20 border border-[#C9A76A]/50 text-xs text-[#3F3024] font-semibold flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#C9A76A]" />
                  <span>Verification Code: <strong className="font-mono text-base font-extrabold">{currentDevCode}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => { playGlassTap(); setOtpCode(currentDevCode); }}
                  className="px-2.5 py-1 rounded-xl bg-[#3F3024] text-[#C9A76A] text-[10px] font-bold uppercase tracking-wider shadow-sm hover:bg-[#5C4535] transition"
                >
                  Auto-Fill
                </button>
              </div>
            )}
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#C9A76A]/50 text-center text-2xl font-mono font-bold text-[#3F3024] tracking-[0.4em] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#C9A76A]"
            />

            <div className="flex items-center justify-between text-[11px] text-[#7A5C45] px-1">
              <span>Code expires in 10 mins</span>
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="font-bold text-[#C9A76A] hover:underline flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              ) : (
                <span>Resend in <strong className="font-mono text-[#3F3024]">{timerSeconds}s</strong></span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-800 font-medium flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 font-medium flex items-center space-x-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={loading || verifiedSuccess}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-luxury transition flex items-center justify-center space-x-2 ${
              verifiedSuccess
                ? 'bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-[#3F3024] to-[#5C4535] text-[#C9A76A] hover:opacity-95'
            }`}
          >
            {verifiedSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 animate-spin" />
                <span>Verified! Accessing Workspace...</span>
              </>
            ) : (
              <>
                <span>{loading ? "Verifying..." : "Verify & Access Workspace"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
