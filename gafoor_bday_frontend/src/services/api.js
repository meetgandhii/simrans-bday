import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Game API
export const gameAPI = {
  getProgress: () => api.get('/game/progress'),
  completeClue: (clueId, answer) => api.post('/game/complete-clue', { clueId, answer }),
  completeTask: (clueId) => api.post('/game/complete-task', { clueId }),
  getLocations: () => api.get('/game/locations'),
  getClue: (clueId) => api.get(`/game/clue/${clueId}`),
  skipClue: (userId, clueId) => api.post('/game/admin/skip-clue', { userId, clueId }),
};

// Shop API
export const shopAPI = {
  getGifts: () => api.get('/shop/gifts'),
  purchaseGift: (giftId) => api.post('/shop/purchase', { giftId }),
  getPurchases: () => api.get('/shop/purchases'),
  seedGifts: () => api.post('/shop/seed-gifts'),
};

// Photos API
export const photosAPI = {
  uploadPhoto: (formData) => api.post('/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyPhotos: () => api.get('/photos/my-photos'),
  getFrame: (clueNumber) => api.get(`/photos/frame/${clueNumber}`),
  getFilters: () => api.get('/photos/filters'),
  deletePhoto: (photoId) => api.delete(`/photos/${photoId}`),
};

export default api;
