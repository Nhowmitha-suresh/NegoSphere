import React, { useState, useEffect } from 'react';
import { Mail, Phone, ShieldCheck, Bell, MapPin, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { playGlassTap, playSuccessChime } from '../utils/audio';
import { api } from '../services/api';

export default function AccountVerificationModal({ isOpen, userEmail = "executive@company.com", onComplete }) {
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

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
      const res = await api.verifyEmailOtp(userEmail, otpCode);
      if (res.status === 'success') {
        playSuccessChime();
        setVerifiedSuccess(true);
        setSuccessMsg("Email verified successfully!");
        setTimeout(() => {
          setVerifiedSuccess(false);
          setStep(2);
        }, 1200);
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

  const nextStep = () => {
    playGlassTap();
    if (step < 4) {
      setStep(step + 1);
    } else {
      playSuccessChime();
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F3024]/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-[#F8F6F1] rounded-3xl border border-[#C9A76A]/40 shadow-luxury p-8 space-y-6 animate-fadeIn relative">
        
        {/* Stepper Header */}
        <div className="flex items-center justify-between border-b border-[#7A5C45]/15 pb-4">
          <div>
            <h3 className="text-base font-bold font-serif text-[#3F3024]">Security Account Verification</h3>
            <p className="text-[11px] text-[#7A5C45] font-semibold">Step {step} of 4</p>
          </div>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-[#C9A76A]' : s < step ? 'w-2 bg-[#7A5C45]' : 'w-2 bg-[#EBE5D9]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Verify Email Code */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3F3024] to-[#5C4535] text-[#C9A76A] mx-auto flex items-center justify-center shadow-luxury">
                <Mail className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold font-serif text-[#3F3024]">Check Your Email</h4>
              <p className="text-xs text-[#7A5C45]">
                We dispatched a secure 6-digit verification code to <strong className="text-[#3F3024]">{userEmail}</strong>.
              </p>
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
                  <span>Verified! Redirecting...</span>
                </>
              ) : (
                <>
                  <span>{loading ? "Verifying Code..." : "Verify & Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Enable 2FA */}
        {step === 2 && (
          <div className="space-y-5 animate-fadeIn text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3F3024] to-[#5C4535] text-[#C9A76A] mx-auto flex items-center justify-center shadow-luxury">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold font-serif text-[#3F3024]">Two-Factor Authentication</h4>
              <p className="text-xs text-[#7A5C45]">Enhanced security enabled for all enterprise procurement activities.</p>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl bg-[#3F3024] text-[#C9A76A] font-bold text-sm shadow-luxury"
            >
              Enable 2FA Protection
            </button>
          </div>
        )}

        {/* Step 3: Smart Push Notifications */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3F3024] to-[#5C4535] text-[#C9A76A] mx-auto flex items-center justify-center shadow-luxury">
              <Bell className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold font-serif text-[#3F3024]">Real-Time Notifications</h4>
              <p className="text-xs text-[#7A5C45]">Receive instant alerts for wholesale price drops and deal milestone confirmations.</p>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl bg-[#3F3024] text-[#C9A76A] font-bold text-sm shadow-luxury"
            >
              Enable Alerts
            </button>
          </div>
        )}

        {/* Step 4: Verification Complete */}
        {step === 4 && (
          <div className="space-y-5 animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-700 mx-auto flex items-center justify-center shadow-luxury">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold font-serif text-[#3F3024]">Verification Complete!</h4>
              <p className="text-xs text-[#7A5C45]">Your account is fully verified and protected by enterprise security standards.</p>
            </div>
            <button
              onClick={onComplete}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3F3024] to-[#5C4535] text-[#C9A76A] font-bold text-sm shadow-luxury"
            >
              Enter NegoSphere Workspace
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
