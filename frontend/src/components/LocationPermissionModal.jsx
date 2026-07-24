import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Store, Compass, X } from 'lucide-react';
import { playGlassTap } from '../utils/audio';

export default function LocationPermissionModal({ isOpen, onClose, onLocationGranted, onLocationDenied }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleGrantPermission = () => {
    playGlassTap();
    setLoading(true);
    setErrorMsg(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          onLocationGranted({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (err) => {
          setLoading(false);
          console.warn("Geolocation permission error/denied:", err);
          setErrorMsg("Could not fetch precise location. Defaulting to regional hub coordinates (New Delhi / Delhi-NCR).");
          // Default location fallback
          setTimeout(() => {
            onLocationGranted({ lat: 28.5494, lng: 77.2520, isFallback: true });
          }, 1200);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLoading(false);
      setErrorMsg("Browser does not support geolocation. Defaulting to regional location.");
      onLocationGranted({ lat: 28.5494, lng: 77.2520, isFallback: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3F3024]/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#F8F6F1] rounded-3xl border border-[#C9A76A]/40 shadow-luxury overflow-hidden p-6 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => { playGlassTap(); onClose(); }}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#7A5C45] hover:bg-[#EBE5D9] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C9A76A] to-[#E6C887] text-[#3F3024] mx-auto flex items-center justify-center shadow-luxury">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#3F3024]">Enable Precise Location</h2>
          <p className="text-xs text-[#7A5C45] leading-relaxed max-w-xs mx-auto">
            NegoSphere uses your GPS coordinates to discover real verified nearby stores, wholesale bazaars, and calculate shortest shopping routes with maximum savings.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-3 rounded-2xl bg-white/70 border border-[#7A5C45]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#3F3024]">
              <Store className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Nearby Retailers</span>
            </div>
            <p className="text-[10px] text-[#7A5C45]">Discover flagship stores & authorized sellers</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-[#7A5C45]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#3F3024]">
              <Navigation className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Route Optimizer</span>
            </div>
            <p className="text-[10px] text-[#7A5C45]">Lowest fuel cost & time multi-stop routes</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-[#7A5C45]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#3F3024]">
              <MapPin className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Wholesale Bazaars</span>
            </div>
            <p className="text-[10px] text-[#7A5C45]">Locate electronics & commercial hubs</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-[#7A5C45]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#3F3024]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>Verified Stores</span>
            </div>
            <p className="text-[10px] text-[#7A5C45]">Authentic warranty & price guarantee</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-900 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleGrantPermission}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#3F3024] to-[#5C4535] text-[#C9A76A] font-bold text-sm shadow-luxury hover:opacity-95 transition flex items-center justify-center space-x-2"
          >
            <MapPin className="w-4 h-4 text-[#C9A76A]" />
            <span>{loading ? "Acquiring GPS Signal..." : "Allow Location Access"}</span>
          </button>

          <button
            onClick={() => { playGlassTap(); onLocationDenied(); }}
            className="w-full py-2 text-xs font-semibold text-[#7A5C45] hover:text-[#3F3024] transition"
          >
            Skip for now (Use Default City)
          </button>
        </div>

        <div className="text-center text-[10px] text-[#7A5C45]/80 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-[#C9A76A]" />
          <span>Your location data is encrypted & never stored or shared with third parties.</span>
        </div>

      </div>
    </div>
  );
}
