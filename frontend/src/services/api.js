import axios from 'axios';

// Render backend URL fallback
const RENDER_BACKEND_URL = 'https://negosphere-backend.onrender.com';

// Storage keys
const TOKEN_KEY = 'negosphere_access_token';
const REFRESH_KEY = 'negosphere_refresh_token';
const USER_KEY = 'negosphere_user';

// Token Storage Helpers
export const storage = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY) || sessionStorage.getItem(REFRESH_KEY),
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  saveSession: (accessToken, refreshToken, user, rememberMe = true) => {
    const store = rememberMe ? localStorage : sessionStorage;
    if (accessToken) store.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) store.setItem(REFRESH_KEY, refreshToken);
    if (user) store.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
};

// Determine base URL dynamically
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  let url = (envUrl && envUrl.trim() !== '') ? envUrl.trim() : RENDER_BACKEND_URL;
  url = url.replace(/\/+$/, '');
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

// Request Interceptor: Automatically ensures `/api` prefix & attaches Bearer token
apiClient.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith('http://') && !config.url.startsWith('https://')) {
    let path = config.url.startsWith('/') ? config.url : `/${config.url}`;
    if (!path.startsWith('/api/') && path !== '/api') {
      path = `/api${path}`;
    }
    config.url = path;
  }
  const token = storage.getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Seamless automatic refresh on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        try {
          const res = await apiClient.post('/api/auth/refresh', { refresh_token: refreshToken });
          if (res.data && res.data.access_token) {
            const newToken = res.data.access_token;
            const newRefreshToken = res.data.refresh_token || refreshToken;
            const user = res.data.user || storage.getUser();
            storage.saveSession(newToken, newRefreshToken, user, true);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            isRefreshing = false;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          storage.clearSession();
          isRefreshing = false;
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          return Promise.reject(refreshErr);
        }
      } else {
        storage.clearSession();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication & Session Endpoints
  login: async (email, password, rememberMe = true) => {
    const res = await apiClient.post('/api/auth/login', { email, password, remember_me: rememberMe });
    if (res.data && res.data.access_token) {
      storage.saveSession(res.data.access_token, res.data.refresh_token, res.data.user, rememberMe);
    }
    return res.data;
  },

  loginUser: async ({ email, password, remember_me = true }) => {
    return api.login(email, password, remember_me);
  },

  register: async (firstName, lastName, email, password, country, acceptTerms) => {
    const res = await apiClient.post('/api/auth/register', {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      country,
      accept_terms: acceptTerms
    });
    return res.data;
  },

  registerUser: async ({ first_name, last_name, email, password, country = "India", accept_terms = true }) => {
    return api.register(first_name, last_name, email, password, country, accept_terms);
  },


  verifyOtp: async (email, otpCode) => {
    const res = await apiClient.post('/api/auth/verify-email-otp', { email, otp_code: otpCode });
    if (res.data && res.data.access_token) {
      storage.saveSession(res.data.access_token, res.data.refresh_token, res.data.user, true);
    }
    return res.data;
  },

  oauthLogin: async (provider, email, name) => {
    const res = await apiClient.post(`/api/auth/oauth/${provider}`, { email, name });
    if (res.data && res.data.access_token) {
      storage.saveSession(res.data.access_token, res.data.refresh_token, res.data.user, true);
    }
    return res.data;
  },

  fetchCurrentUser: async () => {
    try {
      const res = await apiClient.get('/api/auth/me');
      if (res.data && res.data.user) {
        storage.saveSession(storage.getAccessToken(), storage.getRefreshToken(), res.data.user, true);
        return res.data.user;
      }
    } catch (e) {
      console.warn("fetchCurrentUser session invalid:", e);
      storage.clearSession();
      return null;
    }
    return null;
  },

  logout: async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (e) {
      console.warn("Logout endpoint notice:", e);
    } finally {
      storage.clearSession();
    }
  },

  // Pipeline & Intelligence Endpoints
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

  parseProduct: async (query) => {
    const res = await apiClient.get('/api/products/parse', { params: { query } });
    return res.data.data;
  },

  collectPrices: async (query, forceRefresh = false) => {
    const res = await apiClient.get('/api/prices/collect', {
      params: { query, force_refresh: forceRefresh }
    });
    return res.data;
  },

  getLiveMarketIntelligence: async (query, forceRefresh = false) => {
    const res = await apiClient.get('/api/prices/live-intelligence', {
      params: { query, force_refresh: forceRefresh }
    });
    return res.data;
  },

  analyzePrices: async (query) => {
    const res = await apiClient.get('/api/analyze/', { params: { query } });
    return res.data.data;
  },

  generateNegotiation: async (query, persona, language) => {
    const res = await apiClient.get('/api/negotiate/', {
      params: { query, persona, language }
    });
    return res.data.data;
  },

  runSimulation: async (query, buyerPersona, sellerPersonality) => {
    const res = await apiClient.get('/api/simulate/', {
      params: { query, buyer_persona: buyerPersona, seller_personality: sellerPersonality }
    });
    return res.data.data;
  },

  getHistory: async () => {
    const res = await apiClient.get('/api/history/');
    return res.data.data;
  },

  getNearbyStores: async (lat, lng, query = 'electronics', radius = 10000) => {
    const res = await apiClient.get('/api/maps/nearby-stores', {
      params: { lat, lng, query, radius }
    });
    return res.data;
  }
};
