import axios from 'axios';

const API_BASE_URL = '/api';

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
  }
};
