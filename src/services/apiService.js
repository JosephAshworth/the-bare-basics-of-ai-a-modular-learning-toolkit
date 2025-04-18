import axios from 'axios';

// Get the base URL from environment variables or default to localhost
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Log the backend URL being used
console.log(`📡 API Service initialized with backend URL: ${backendUrl}`);

// Create an Axios instance with the base URL
const apiInstance = axios.create({
  baseURL: backendUrl,
  timeout: 30000, // 30 seconds
});

// Add request interceptor for logging
apiInstance.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method.toUpperCase()} ${config.url}`, config.data);
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// API service with methods for common operations
const apiService = {
  // GET request
  get: (endpoint) => apiInstance.get(endpoint),
  
  // POST request
  post: (endpoint, data) => apiInstance.post(endpoint, data),
  
  // PUT request
  put: (endpoint, data) => apiInstance.put(endpoint, data),
  
  // DELETE request
  delete: (endpoint) => apiInstance.delete(endpoint),
  
  // Helper for file uploads
  uploadFile: (endpoint, formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    console.log(`📤 Uploading file to: ${backendUrl}${endpoint}`);
    return apiInstance.post(endpoint, formData, config);
  },
  
  // Get the full URL for an endpoint
  getFullUrl: (endpoint) => {
    const url = `${backendUrl}${endpoint}`;
    console.log(`🔗 Full URL: ${url}`);
    return url;
  }
};

export default apiService; 