import axios from 'axios';

// Get the backend URL from environment variables or use a fallback
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Create an axios instance with the backend URL
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility functions for API calls
const apiService = {
  // General API methods
  get: (endpoint, config = {}) => api.get(endpoint, config),
  post: (endpoint, data, config = {}) => api.post(endpoint, data, config),
  put: (endpoint, data, config = {}) => api.put(endpoint, data, config),
  delete: (endpoint, config = {}) => api.delete(endpoint, config),
  
  // Helper method for file uploads
  uploadFile: (endpoint, formData, config = {}) => {
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(endpoint, formData, uploadConfig);
  },

  // Method to get the full URL (for direct fetch calls)
  getUrl: (path) => `${backendUrl}${path}`,
};

export default apiService; 