import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';


export const api = {
  // Execute full 8-agent pipeline
  runFullPipeline: async (query, persona = 'Assertive', language = 'English', sellerPersonality = 'Flexible') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/pipeline`, {
        params: { query, persona, language, seller_personality: sellerPersonality }
      });
      return response.data.data;
    } catch (error) {
      console.warn("Backend pipeline call failed, using fallback:", error);
      throw error;
    }
  },

  // Parse product details (Agent 1)
  parseProduct: async (query) => {
    const res = await axios.get(`${API_BASE_URL}/products/parse`, { params: { query } });
    return res.data.data;
  },

  // Collect vendor prices (Agent 2)
  collectPrices: async (query) => {
    const res = await axios.get(`${API_BASE_URL}/prices/collect`, { params: { query } });
    return res.data.data;
  },

  // Analyze price statistical metrics (Agent 3 & 4)
  analyzePrices: async (query) => {
    const res = await axios.get(`${API_BASE_URL}/analyze/`, { params: { query } });
    return res.data.data;
  },

  // Generate negotiation strategy (Agent 5 & 6)
  generateNegotiation: async (query, persona, language) => {
    const res = await axios.get(`${API_BASE_URL}/negotiate/`, {
      params: { query, persona, language }
    });
    return res.data.data;
  },

  // Run Agent-vs-Agent Showdown (Agent 7)
  runSimulation: async (query, buyerPersona, sellerPersonality) => {
    const res = await axios.get(`${API_BASE_URL}/simulate/`, {
      params: { query, buyer_persona: buyerPersona, seller_personality: sellerPersonality }
    });
    return res.data.data;
  },

  // Fetch past negotiations and bookmarks
  getHistory: async () => {
    const res = await axios.get(`${API_BASE_URL}/history/`);
    return res.data.data;
  },

  // Real Google Maps & Location API endpoints
  getNearbyStores: async (lat, lng, query = 'electronics', radius = 10000) => {
    const res = await axios.get(`${API_BASE_URL}/maps/nearby-stores`, {
      params: { lat, lng, query, radius }
    });
    return res.data;
  },

  getDirections: async (originLat, originLng, destLat, destLng, mode = 'driving') => {
    const res = await axios.get(`${API_BASE_URL}/maps/directions`, {
      params: { origin_lat: originLat, origin_lng: originLng, dest_lat: destLat, dest_lng: destLng, mode }
    });
    return res.data.route;
  },

  optimizeShoppingRoute: async (originLat, originLng, destinations, optimizationMode = 'max_savings') => {
    const res = await axios.post(`${API_BASE_URL}/maps/optimize-shopping-route`, {
      origin_lat: originLat,
      origin_lng: originLng,
      destinations,
      optimization_mode: optimizationMode
    });
    return res.data;
  },

  // Auth endpoints
  registerUser: async (userData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return res.data;
  },

  verifyEmailOtp: async (email, otpCode) => {
    const res = await axios.post(`${API_BASE_URL}/auth/verify-email-otp`, { email, otp_code: otpCode });
    return res.data;
  },

  resendEmailOtp: async (email) => {
    const res = await axios.post(`${API_BASE_URL}/auth/resend-email-otp`, { email });
    return res.data;
  },

  loginUser: async (credentials) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return res.data;
  },


  sendPhoneOtp: async (phoneNumber) => {
    const res = await axios.post(`${API_BASE_URL}/auth/send-phone-otp`, { phone_number: phoneNumber });
    return res.data;
  },

  verifyPhoneOtp: async (phoneNumber, otpCode) => {
    const res = await axios.post(`${API_BASE_URL}/auth/verify-phone-otp`, { phone_number: phoneNumber, otp_code: otpCode });
    return res.data;
  },

  getActiveSessions: async () => {
    const res = await axios.get(`${API_BASE_URL}/auth/security/sessions`);
    return res.data;
  },

  // PDF Report Download
  downloadPdfReport: async (query, persona) => {
    const res = await axios.get(`${API_BASE_URL}/report/pdf`, {
      params: { query, persona },
      responseType: 'blob'
    });
    return res.data;
  }
};
