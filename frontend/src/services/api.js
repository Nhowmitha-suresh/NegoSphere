import axios from 'axios';

// Render backend URL fallback
const RENDER_BACKEND_URL = 'https://negosphere-backend.onrender.com';

// Configure base URL from environment variable or fallback to Render production backend
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    // If env var ends with /api, trim it so we can append /api/endpoint cleanly
    let trimmed = envUrl.trim().replace(/\/+$/, '');
    if (trimmed.endsWith('/api')) {
      trimmed = trimmed.slice(0, -4);
    }
    return trimmed;
  }
  return RENDER_BACKEND_URL;
};

const BASE_HOST = getBaseUrl();

/**
 * Builds full URL guaranteeing `/api` prefix.
 * e.g. buildApiUrl('/api/auth/login') -> "https://negosphere-backend.onrender.com/api/auth/login"
 */
export const buildApiUrl = (endpointPath) => {
  const path = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  // Ensure path starts with /api
  const apiPath = path.startsWith('/api/') || path === '/api' ? path : `/api${path}`;
  
  if (!BASE_HOST || BASE_HOST === '') {
    return apiPath;
  }
  
  return `${BASE_HOST}${apiPath}`;
};

export const api = {
  // Execute full 8-agent pipeline
  runFullPipeline: async (query, persona = 'Assertive', language = 'English', sellerPersonality = 'Flexible') => {
    try {
      const response = await axios.get(buildApiUrl('/api/report/pipeline'), {
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
    const res = await axios.get(buildApiUrl('/api/products/parse'), { params: { query } });
    return res.data.data;
  },

  // Collect vendor prices (Agent 2)
  collectPrices: async (query) => {
    const res = await axios.get(buildApiUrl('/api/prices/collect'), { params: { query } });
    return res.data.data;
  },

  // Analyze price statistical metrics (Agent 3 & 4)
  analyzePrices: async (query) => {
    const res = await axios.get(buildApiUrl('/api/analyze/'), { params: { query } });
    return res.data.data;
  },

  // Generate negotiation strategy (Agent 5 & 6)
  generateNegotiation: async (query, persona, language) => {
    const res = await axios.get(buildApiUrl('/api/negotiate/'), {
      params: { query, persona, language }
    });
    return res.data.data;
  },

  // Run Agent-vs-Agent Showdown (Agent 7)
  runSimulation: async (query, buyerPersona, sellerPersonality) => {
    const res = await axios.get(buildApiUrl('/api/simulate/'), {
      params: { query, buyer_persona: buyerPersona, seller_personality: sellerPersonality }
    });
    return res.data.data;
  },

  // Fetch past negotiations and bookmarks
  getHistory: async () => {
    const res = await axios.get(buildApiUrl('/api/history/'));
    return res.data.data;
  },

  // Real Google Maps & Location API endpoints
  getNearbyStores: async (lat, lng, query = 'electronics', radius = 10000) => {
    const res = await axios.get(buildApiUrl('/api/maps/nearby-stores'), {
      params: { lat, lng, query, radius }
    });
    return res.data;
  },

  getDirections: async (originLat, originLng, destLat, destLng, mode = 'driving') => {
    const res = await axios.get(buildApiUrl('/api/maps/directions'), {
      params: { origin_lat: originLat, origin_lng: originLng, dest_lat: destLat, dest_lng: destLng, mode }
    });
    return res.data.route;
  },

  optimizeShoppingRoute: async (originLat, originLng, destinations, optimizationMode = 'max_savings') => {
    const res = await axios.post(buildApiUrl('/api/maps/optimize-shopping-route'), {
      origin_lat: originLat,
      origin_lng: originLng,
      destinations,
      optimization_mode: optimizationMode
    });
    return res.data;
  },

  // Auth endpoints
  registerUser: async (userData) => {
    const res = await axios.post(buildApiUrl('/api/auth/register'), userData);
    return res.data;
  },

  verifyEmailOtp: async (email, otpCode) => {
    const res = await axios.post(buildApiUrl('/api/auth/verify-email-otp'), { email, otp_code: otpCode });
    return res.data;
  },

  resendEmailOtp: async (email) => {
    const res = await axios.post(buildApiUrl('/api/auth/resend-email-otp'), { email });
    return res.data;
  },

  loginUser: async (credentials) => {
    const res = await axios.post(buildApiUrl('/api/auth/login'), credentials);
    return res.data;
  },

  oauthLogin: async (provider, email) => {
    const res = await axios.post(buildApiUrl(`/api/auth/oauth/${provider.toLowerCase()}`), { email });
    return res.data;
  },

  logoutUser: async () => {
    const res = await axios.post(buildApiUrl('/api/auth/logout'));
    return res.data;
  },

  sendPhoneOtp: async (phoneNumber) => {
    const res = await axios.post(buildApiUrl('/api/auth/send-phone-otp'), { phone_number: phoneNumber });
    return res.data;
  },

  verifyPhoneOtp: async (phoneNumber, otpCode) => {
    const res = await axios.post(buildApiUrl('/api/auth/verify-phone-otp'), { phone_number: phoneNumber, otp_code: otpCode });
    return res.data;
  },

  getActiveSessions: async () => {
    const res = await axios.get(buildApiUrl('/api/auth/security/sessions'));
    return res.data;
  },

  // PDF Report Download
  downloadPdfReport: async (query, persona) => {
    const res = await axios.get(buildApiUrl('/api/report/pdf'), {
      params: { query, persona },
      responseType: 'blob'
    });
    return res.data;
  }
};
