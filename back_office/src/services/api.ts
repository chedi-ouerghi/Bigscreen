import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('bigscreen_admin_token');
    if (token && token !== 'undefined' && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
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
      // Token expired or invalid
      sessionStorage.removeItem('bigscreen_admin_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/administration';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  me: () =>
    api.post('/auth/me'),
};

export const adminService = {
  getDashboard: () =>
    api.get('/admin/dashboard'),
  
  getSurveys: () =>
    api.get('/admin/surveys'),
  
  getSurvey: (id: string) =>
    api.get(`/admin/surveys/${id}`),
  
  getSurveyQuestions: (id: string) =>
    api.get(`/admin/surveys/${id}/questions`),
  
  getQuestions: () =>
    api.get('/admin/questions'),
  
  getResponses: () =>
    api.get('/admin/responses'),
};