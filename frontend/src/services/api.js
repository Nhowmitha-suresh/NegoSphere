import axios from 'axios';

// Render backend URL fallback
const RENDER_BACKEND_URL = 'https://negosphere-backend.onrender.com';

// Determine base URL dynamically
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  let url = (envUrl && envUrl.trim() !== '') ? envUrl.trim() : RENDER_BACKEND_URL;
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // If user provided URL ending in /api, trim it so we add /api/ cleanly in endpoints/interceptor
  if (url.endsWith('/api')) {
    url = url.slice(0, -4);
  }
  return url;
};

// Create configured Axios client instance
export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Automatically ensures `/api` prefix is prepended to all requests
apiClient.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith('http://') && !config.url.startsWith('https://')) {
    let path = config.url.startsWith('/') ? config.url : `/${config.url}`;
    if (!path.startsWith('/api/') && path !== '/api') {
      path = `/api${path}`;
    }
    config.url = path;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const api = {
  // Execute full 8-agent pipeline
  runFullPipeline: async (query, persona = 'Assertive', language = 'English', sellerPersonality = 'Flexible') => {
    try {
      const response = await apiClient.get('/api/report/pipeline', {
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
    const res = await apiClient.get('/api/products/parse', { params: { query } });
    return res.data.data;
  },

  // Collect vendor prices (Agent 2)
  collectPrices: async (query) => {
    const res = await apiClient.get('/api/prices/collect', { params: { query } });
    return res.data.data;
  },

  // Analyze price statistical metrics (Agent 3 & 4)
  analyzePrices: async (query) => {
    const res = await apiClient.get('/api/analyze/', { params: { query } });
    return res.data.data;
  },

  // Generate negotiation strategy (Agent 5 & 6)
  generateNegotiation: async (query, persona, language) => {
    const res = await apiClient.get('/api/negotiate/', {
      params: { query, persona, language }
    });
    return res.data.data;
  },

  // Run Agent-vs-Agent Showdown (Agent 7)
  runSimulation: async (query, buyerPersona, sellerPersonality) => {
    const res = await apiClient.get('/api/simulate/', {
      params: { query, buyer_persona: buyerPersona, seller_personality: sellerPersonality }
    });
    return res.data.data;
  },

  // Fetch past negotiations and bookmarks
  getHistory: async () => {
    const res = await apiClient.get('/api/history/');
    return res.data.data;
  },

  // Real Google Maps & Location API endpoints
  getNearbyStores: async (lat, lng, query = 'electronics', radius = 10000) => {
    const res = await apiClient.get('/api/maps/nearby-stores', {
      params: { lat, lng, query, radius }
    });
    return res.data;
  },

  getDirections: async (originLat, originLng, destLat, destLng, mode = 'driving') => {
    const res = await apiClient.get('/api/maps/directions', {
      params: { origin_lat: originLat, origin_lng: originLng, dest_lat: destLat, dest_lng: destLng, mode }
    });
    return res.data.route;
  },

  optimizeShoppingRoute: async (originLat, originLng, destinations, optimizationMode = 'max_savings') => {
    const res = await apiClient.post('/api/maps/optimize-shopping-route', {
      origin_lat: originLat,
      origin_lng: originLng,
      destinations,
      optimization_mode: optimizationMode
    });
    return res.data;
  },

  // Auth endpoints
  registerUser: async (userData) => {
    const res = await apiClient.post('/api/auth/register', userData);
    return res.data;
  },

  verifyEmailOtp: async (email, otpCode) => {
    const res = await apiClient.post('/api/auth/verify-email-otp', { email, otp_code: otpCode });
    return res.data;
  },

  resendEmailOtp: async (email) => {
    const res = await apiClient.post('/api/auth/resend-email-otp', { email });
    return res.data;
  },

  loginUser: async (credentials) => {
    const res = await apiClient.post('/api/auth/login', credentials);
    return res.data;
  },

  oauthLogin: async (provider, email) => {
    const res = await apiClient.post(`/api/auth/oauth/${provider.toLowerCase()}`, { email });
    return res.data;
  },

  logoutUser: async () => {
    const res = await apiClient.post('/api/auth/logout');
    return res.data;
  },

  sendPhoneOtp: async (phoneNumber) => {
    const res = await apiClient.post('/api/auth/send-phone-otp', { phone_number: phoneNumber });
    return res.data;
  },

  verifyPhoneOtp: async (phoneNumber, otpCode) => {
    const res = await apiClient.post('/api/auth/verify-phone-otp', { phone_number: phoneNumber, otp_code: otpCode });
    return res.data;
  },

  getActiveSessions: async () => {
    const res = await apiClient.get('/api/auth/security/sessions');
    return res.data;
  },

  // PDF Report Download
  downloadPdfReport: async (query, persona) => {
    const res = await apiClient.get('/api/report/pdf', {
      params: { query, persona },
      responseType: 'blob'
    });
    return res.data;
  }
};
