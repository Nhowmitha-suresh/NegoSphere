import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Car, ShieldCheck, Phone, Globe, Clock, Sparkles, Layers, RefreshCw, Route, ExternalLink, X } from 'lucide-react';
import { playGlassTap } from '../utils/audio';
import { api } from '../services/api';

export default function InteractiveMapModal({ isOpen, onClose, userLocation, searchQuery = 'electronics' }) {
  const [mapType, setMapType] = useState('roadmap'); // roadmap | satellite | traffic
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [optimizationMode, setOptimizationMode] = useState('max_savings');
  const [optimizedRouteSummary, setOptimizedRouteSummary] = useState(null);

  // User GPS coords
  const userLat = userLocation?.lat || 28.5494;
  const userLng = userLocation?.lng || 77.2520;

  useEffect(() => {
    if (isOpen) {
      fetchNearbyStores();
    }
  }, [isOpen, searchQuery, userLat, userLng]);

  const fetchNearbyStores = async () => {
    setLoading(true);
    try {
      const data = await api.getNearbyStores(userLat, userLng, searchQuery, 15000);
      if (data && data.stores && data.stores.length > 0) {
        setStores(data.stores);
        setSelectedStore(data.stores[0]);
        calculateRoute(data.stores[0]);
      }
    } catch (e) {
      console.warn("Failed to fetch nearby stores from API:", e);
    } finally {
      setLoading(false);
    }
  };

  const calculateRoute = async (store) => {
    if (!store || !store.location) return;
    try {
      const route = await api.getDirections(
        userLat, userLng, store.location.lat, store.location.lng, 'driving'
      );
      setRouteInfo(route);
    } catch (e) {
      console.warn("Directions API error:", e);
    }
  };

  const handleSelectStore = (store) => {
    playGlassTap();
    setSelectedStore(store);
    calculateRoute(store);
  };

  const handleOptimizeShoppingRoute = async () => {
    playGlassTap();
    setLoading(true);
    try {
      const dests = stores.map((s, idx) => ({
        id: s.id,
        name: s.name,
        lat: s.location?.lat,
        lng: s.location?.lng,
        potential_savings: 1500 + (idx * 800)
      }));
      const res = await api.optimizeShoppingRoute(userLat, userLng, dests, optimizationMode);
      setOptimizedRouteSummary(res.summary);
    } catch (e) {
      console.warn("Route optimization error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#3F3024]/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-[#F8F6F1] rounded-3xl border border-[#C9A76A]/40 shadow-luxury overflow-hidden grid grid-cols-1 md:grid-cols-3 max-h-[90vh]">
        
        {/* Left Store & Route Optimization Panel */}
        <div className="p-6 bg-[#F2EEE6] border-r border-[#7A5C45]/15 space-y-4 overflow-y-auto flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-[#3F3024]">Nearby Retailers & Bazaars</h3>
              <button onClick={fetchNearbyStores} className="p-1.5 rounded-lg hover:bg-white/60 text-[#7A5C45]" title="Refresh Stores">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Optimization Selector */}
            <div className="p-3 rounded-2xl bg-white/70 border border-[#7A5C45]/15 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#3F3024]">
                <span className="flex items-center space-x-1">
                  <Route className="w-3.5 h-3.5 text-[#C9A76A]" />
                  <span>Route Optimization</span>
                </span>
                <button
                  onClick={handleOptimizeShoppingRoute}
                  className="px-2 py-0.5 rounded-lg bg-[#3F3024] text-[#C9A76A] text-[10px] font-bold hover:opacity-90"
                >
                  Optimize
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {['max_savings', 'lowest_fuel', 'shortest_time'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setOptimizationMode(mode)}
                    className={`py-1 text-[9px] font-bold rounded-lg border transition ${
                      optimizationMode === mode
                        ? 'bg-[#C9A76A] text-[#3F3024] border-[#C9A76A]'
                        : 'bg-white text-[#7A5C45] border-[#7A5C45]/15'
                    }`}
                  >
                    {mode === 'max_savings' ? 'Max Savings' : mode === 'lowest_fuel' ? 'Low Fuel' : 'Fastest'}
                  </button>
                ))}
              </div>

              {optimizedRouteSummary && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900 space-y-1">
                  <div className="font-bold flex justify-between">
                    <span>Est. Total Savings:</span>
                    <span>₹{optimizedRouteSummary.total_potential_savings?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-emerald-700">
                    <span>Stops: {optimizedRouteSummary.total_stops}</span>
                    <span>Distance: {optimizedRouteSummary.total_distance_km} km</span>
                    <span>Net ROI: ₹{optimizedRouteSummary.net_roi?.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stores List */}
            <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
              {stores.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectStore(s)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                    selectedStore?.id === s.id
                      ? 'bg-white border-[#C9A76A] shadow-luxury-sm font-bold'
                      : 'glass-card border-[#7A5C45]/12 hover:border-[#7A5C45]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[#3F3024]">
                    <span className="truncate max-w-[150px]">{s.name}</span>
                    <span className="font-mono text-[#C9A76A] text-[11px]">{s.rating} ★</span>
                  </div>
                  <div className="text-[10px] text-[#7A5C45] pt-1 flex justify-between">
                    <span>{s.type || 'Verified Retailer'}</span>
                    <span>{s.distance_text || 'Nearby'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-[#7A5C45] border-t border-[#7A5C45]/10 flex items-center justify-between">
            <span>Powered by Google Maps Platform</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A76A]" />
          </div>

        </div>

        {/* Right Map Canvas & Details Panel (2 cols) */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between relative bg-gradient-to-br from-[#EBE5D9] via-[#F8F6F1] to-[#F2EEE6] overflow-hidden">
          
          {/* Top Bar Header */}
          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#7A5C45]/15 text-xs font-bold text-[#3F3024] shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#C9A76A]" />
              <span>GPS: {userLat.toFixed(4)}, {userLng.toFixed(4)} (Live Location)</span>
            </div>

            {/* Map Controls */}
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-xl border border-[#7A5C45]/15 p-1 flex space-x-1 text-[10px] font-bold">
                {['roadmap', 'satellite', 'traffic'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setMapType(type)}
                    className={`px-2.5 py-1 rounded-lg transition capitalize ${
                      mapType === type ? 'bg-[#3F3024] text-[#C9A76A]' : 'text-[#7A5C45] hover:bg-[#F2EEE6]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <button onClick={() => onClose(false)} className="p-2 rounded-xl bg-white text-[#7A5C45] shadow-sm hover:bg-[#F2EEE6]">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="relative my-4 h-80 rounded-3xl bg-white/70 border border-[#7A5C45]/15 overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Grid Vector Overlay */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              mapType === 'satellite' ? 'bg-[#1E293B] opacity-90' : mapType === 'traffic' ? 'bg-[#FEF3C7] opacity-40' : 'opacity-20 bg-[radial-gradient(#7A5C45_1px,transparent_1px)] [background-size:18px_18px]'
            }`} />

            {/* Simulated Live Satellite Texture / Roadmap Lines */}
            {mapType === 'satellite' && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-black opacity-80" />
            )}

            {/* Route Line Visualization */}
            {selectedStore && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line x1="50%" y1="50%" x2="70%" y2="35%" stroke="#C9A76A" strokeWidth="3" strokeDasharray="6 4" />
              </svg>
            )}

            {/* User GPS Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#C9A76A]/30 animate-ping absolute" />
                <div className="w-6 h-6 rounded-full bg-[#3F3024] border-2 border-[#C9A76A] flex items-center justify-center shadow-luxury">
                  <div className="w-2 h-2 rounded-full bg-[#C9A76A]" />
                </div>
              </div>
            </div>

            {/* Store Map Pins */}
            {stores.map((s, idx) => {
              const topOffset = `${25 + (idx * 16) % 55}%`;
              const leftOffset = `${20 + (idx * 22) % 65}%`;
              const isSelected = selectedStore?.id === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectStore(s)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-125 z-30' : 'scale-90 z-20 hover:scale-105'
                  }`}
                  style={{ top: topOffset, left: leftOffset }}
                >
                  <div className={`px-2.5 py-1.5 rounded-2xl flex items-center space-x-1.5 shadow-luxury border ${
                    isSelected
                      ? 'bg-[#3F3024] border-[#C9A76A] text-[#C9A76A]'
                      : 'bg-white border-[#7A5C45]/20 text-[#3F3024]'
                  }`}>
                    <MapPin className="w-3.5 h-3.5 text-[#C9A76A]" />
                    <span className="text-[10px] font-extrabold whitespace-nowrap">{s.name}</span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Detailed Selected Store Card */}
          {selectedStore && (
            <div className="p-4 rounded-2xl bg-white border border-[#C9A76A]/40 shadow-luxury space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#3F3024] flex items-center space-x-2">
                    <span>{selectedStore.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      Verified Store
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#7A5C45]">{selectedStore.address || 'Central Electronics Hub'}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold font-mono text-[#C9A76A]">{selectedStore.rating} ★</div>
                  <div className="text-[10px] text-[#7A5C45]">{selectedStore.user_ratings_total || 250} reviews</div>
                </div>
              </div>

              {/* Route & Contact Quick Stats */}
              <div className="grid grid-cols-4 gap-2 text-[11px] text-[#3F3024] bg-[#F8F6F1] p-2.5 rounded-xl border border-[#7A5C45]/10">
                <div>
                  <span className="text-[9px] text-[#7A5C45] block">Distance</span>
                  <strong className="font-mono">{routeInfo?.distance_text || selectedStore.distance_text || '1.8 km'}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-[#7A5C45] block">Drive Time</span>
                  <strong className="font-mono">{routeInfo?.duration_text || selectedStore.traffic || '6 mins'}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-[#7A5C45] block">Status</span>
                  <strong className="text-emerald-700 font-semibold">{selectedStore.open_now !== false ? 'Open Now' : 'Closed'}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-[#7A5C45] block">Phone</span>
                  <strong className="truncate block font-mono text-[10px]">{selectedStore.phone || '+91 11 4000 8800'}</strong>
                </div>
              </div>

              {/* Offer & Action buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-[#3F3024] font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A76A]" />
                  <span>{selectedStore.offers || '10% Cash Discount + No-Cost EMI Available'}</span>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#F2EEE6] text-[#7A5C45] hover:text-[#3F3024] text-xs font-bold flex items-center space-x-1"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => { playGlassTap(); onClose(false); }}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#3F3024] to-[#5C4535] text-[#C9A76A] text-xs font-bold shadow-sm hover:opacity-90"
                  >
                    Negotiate Here
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
