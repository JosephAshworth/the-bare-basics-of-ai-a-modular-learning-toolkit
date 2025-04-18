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
    
    // Only add auth token from localStorage if Authorization header isn't already set
    // This ensures that method-specific auth headers take precedence
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Using token from localStorage for authentication');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('No token found in localStorage and no Authorization header provided');
      }
    } else {
      console.log('Using provided Authorization header');
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
    if (error.response) {
      console.error(`❌ Response Error: ${error.response.status}`, error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API service with methods for common operations
const apiService = {
  // GET request with optional config
  get: (endpoint, config) => apiInstance.get(endpoint, config),
  
  // POST request with optional config
  post: (endpoint, data, config) => apiInstance.post(endpoint, data, config),
  
  // PUT request with optional config
  put: (endpoint, data, config) => apiInstance.put(endpoint, data, config),
  
  // DELETE request with optional config
  delete: (endpoint, config) => apiInstance.delete(endpoint, config),
  
  // Helper for file uploads
  uploadFile: (endpoint, formData, config = {}) => {
    const uploadConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      },
    };
    console.log(`📤 Uploading file to: ${backendUrl}${endpoint}`);
    return apiInstance.post(endpoint, formData, uploadConfig);
  },
  
  // Get the full URL for an endpoint
  getFullUrl: (endpoint) => {
    const url = `${backendUrl}${endpoint}`;
    console.log(`🔗 Full URL: ${url}`);
    return url;
  },
  
  // Special method for fuzzy logic endpoints that tries multiple path formats
  fuzzyLogicRequest: async (endpoint, data, config = {}) => {
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
        const response = await apiInstance.post(variant, data, config);
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