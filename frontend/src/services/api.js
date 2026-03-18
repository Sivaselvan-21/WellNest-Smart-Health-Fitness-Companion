import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (email, otp) => api.post('/auth/verify-email', { email, otp }),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
};

// ── NEW: Workout API ──
export const workoutAPI = {
  logWorkout: (data) => api.post('/workout/log', data),
  getLogs:    ()     => api.get('/workout/logs'),
  deleteLog:  (id)   => api.delete(`/workout/log/${id}`),
};

// ── NEW: Meal API ──
export const mealAPI = {
  logMeal:  (data) => api.post('/meal/log', data),
  getLogs:  ()     => api.get('/meal/logs'),
  deleteLog:(id)   => api.delete(`/meal/log/${id}`),
};

// ── NEW: Water API ──
export const waterAPI = {
  logWater: (data) => api.post('/water/log', data),
  getLogs:  ()     => api.get('/water/logs'),
  deleteLog:(id)   => api.delete(`/water/log/${id}`),
};

// ── NEW: Sleep API ──
export const sleepAPI = {
  logSleep: (data) => api.post('/sleep/log', data),
  getLogs:  ()     => api.get('/sleep/logs'),
  deleteLog:(id)   => api.delete(`/sleep/log/${id}`),
};

export default api;