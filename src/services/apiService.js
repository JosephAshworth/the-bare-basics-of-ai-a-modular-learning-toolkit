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
  },
  
  // Special method for fuzzy logic endpoints that tries multiple path formats
  fuzzyLogicRequest: async (endpoint, data) => {
    console.log(`🧠 Fuzzy Logic Request for endpoint: ${endpoint}`);
    
    // List of endpoint variants to try
    const variants = [
      // With /api prefix
      `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`,
      // Without /api prefix
      endpoint.startsWith('/') ? endpoint : '/' + endpoint,
      // Direct to fuzzy-logic without prefix
      endpoint.includes('fuzzy-logic') ? endpoint : `/fuzzy-logic/${endpoint.replace(/^\//, '')}`
    ];
    
    // Log all variants we'll try
    console.log(`🔄 Will try the following endpoint variants:`, variants);
    
    // Keep track of all errors to provide better diagnostics
    const errors = [];
    
    // Try each variant in sequence
    for (const variant of variants) {
      try {
        console.log(`🔄 Trying endpoint variant: ${variant}`);
        const response = await apiInstance.post(variant, data);
        console.log(`✅ Successful response from ${variant}`);
        return response;
      } catch (error) {
        const errorInfo = {
          endpoint: variant,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        };
        console.error(`❌ Failed with variant ${variant}:`, errorInfo);
        errors.push(errorInfo);
      }
    }
    
    // If we get here, all variants failed
    console.error(`❌ All endpoint variants failed:`, errors);
    throw new Error('All endpoint variants failed. See console for details.');
  }
};

export default apiService; 