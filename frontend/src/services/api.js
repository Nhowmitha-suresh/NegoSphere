import axios from 'axios';

// Get base URL from environment or default to relative path
const rawBase = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Normalizes the API URL to guarantee that `/api` is included.
 * Handles cases where VITE_API_BASE_URL is set to:
 * - "" (relative mode) -> returns "/api/..."
 * - "/api" -> returns "/api/..."
 * - "https://domain.com" -> returns "https://domain.com/api/..."
 * - "https://domain.com/api" -> returns "https://domain.com/api/..."
 */
export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (!rawBase || rawBase === '/api' || rawBase === 'http://localhost:8000/api') {
    return `/api${cleanPath}`;
  }

  const base = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
  const apiBase = base.endsWith('/api') ? base : `${base}/api`;
  return `${apiBase}${cleanPath}`;
};

export const api = {
  // Execute full 8-agent pipeline
  runFullPipeline: async (query, persona = 'Assertive', language = 'English', sellerPersonality = 'Flexible') => {
    try {
      const response = await axios.get(getApiUrl('/report/pipeline'), {
        params: { query, persona, language, seller_personality: sellerPersonality }
      });
      return response.data.data;
    } catch (error) {
      console.warn("Backend pipeline call failed:", error);
      throw error;
    }
  },

  // Parse product details (Agent 1)
  parseProduct: async (query) => {
    const res = await axios.get(getApiUrl('/products/parse'), { params: { query } });
    return res.data.data;
  },

  // Collect vendor prices (Agent 2)
  collectPrices: async (query) => {
    const res = await axios.get(getApiUrl('/prices/collect'), { params: { query } });
    return res.data.data;
  },

  // Analyze price statistical metrics (Agent 3 & 4)
  analyzePrices: async (query) => {
    const res = await axios.get(getApiUrl('/analyze/'), { params: { query } });
    return res.data.data;
  },

  // Generate negotiation strategy (Agent 5 & 6)
  generateNegotiation: async (query, persona, language) => {
    const res = await axios.get(getApiUrl('/negotiate/'), {
      params: { query, persona, language }
    });
    return res.data.data;
  },

  // Run Agent-vs-Agent Showdown (Agent 7)
  runSimulation: async (query, buyerPersona, sellerPersonality) => {
    const res = await axios.get(getApiUrl('/simulate/'), {
      params: { query, buyer_persona: buyerPersona, seller_personality: sellerPersonality }
    });
    return res.data.data;
  },

  // Fetch past negotiations and bookmarks
  getHistory: async () => {
    const res = await axios.get(getApiUrl('/history/'));
    return res.data.data;
  },

  // Real Google Maps & Location API endpoints
  getNearbyStores: async (lat, lng, query = 'electronics', radius = 10000) => {
    const res = await axios.get(getApiUrl('/maps/nearby-stores'), {
      params: { lat, lng, query, radius }
    });
    return res.data;
  },

  getDirections: async (originLat, originLng, destLat, destLng, mode = 'driving') => {
    const res = await axios.get(getApiUrl('/maps/directions'), {
      params: { origin_lat: originLat, origin_lng: originLng, dest_lat: destLat, dest_lng: destLng, mode }
    });
    return res.data.route;
  },

  optimizeShoppingRoute: async (originLat, originLng, destinations, optimizationMode = 'max_savings') => {
    const res = await axios.post(getApiUrl('/maps/optimize-shopping-route'), {
      origin_lat: originLat,
      origin_lng: originLng,
      destinations,
      optimization_mode: optimizationMode
    });
    return res.data;
  },

  // Auth endpoints
  registerUser: async (userData) => {
    const res = await axios.post(getApiUrl('/auth/register'), userData);
    return res.data;
  },

  verifyEmailOtp: async (email, otpCode) => {
    const res = await axios.post(getApiUrl('/auth/verify-email-otp'), { email, otp_code: otpCode });
    return res.data;
  },

  resendEmailOtp: async (email) => {
    const res = await axios.post(getApiUrl('/auth/resend-email-otp'), { email });
    return res.data;
  },

  loginUser: async (credentials) => {
    const res = await axios.post(getApiUrl('/auth/login'), credentials);
    return res.data;
  },

  oauthLogin: async (provider, email) => {
    const res = await axios.post(getApiUrl(`/auth/oauth/${provider.toLowerCase()}`), { email });
    return res.data;
  },

  sendPhoneOtp: async (phoneNumber) => {
    const res = await axios.post(getApiUrl('/auth/send-phone-otp'), { phone_number: phoneNumber });
    return res.data;
  },

  verifyPhoneOtp: async (phoneNumber, otpCode) => {
    const res = await axios.post(getApiUrl('/auth/verify-phone-otp'), { phone_number: phoneNumber, otp_code: otpCode });
    return res.data;
  },

  getActiveSessions: async () => {
    const res = await axios.get(getApiUrl('/auth/security/sessions'));
    return res.data;
  },

  // PDF Report Download
  downloadPdfReport: async (query, persona) => {
    const res = await axios.get(getApiUrl('/report/pdf'), {
      params: { query, persona },
      responseType: 'blob'
    });
    return res.data;
  }
};
