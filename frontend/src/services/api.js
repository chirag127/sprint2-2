import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Product API calls
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (name) => api.get(`/products/search?name=${encodeURIComponent(name)}`),
};

// Admin Product API calls
export const adminProductAPI = {
  getAll: () => api.get('/admin/products'),
  create: (product) => api.post('/admin/products', product),
  update: (id, product) => api.put(`/admin/products/${id}`, product),
  delete: (id) => api.delete(`/admin/products/${id}`),
};

// Admin User API calls
export const adminUserAPI = {
  search: (name) => api.get(`/admin/users/search?name=${encodeURIComponent(name)}`),
};

// Order API calls
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getHistory: () => api.get('/orders/my-history'),
  getById: (id) => api.get(`/orders/${id}`),
};

export default api;
