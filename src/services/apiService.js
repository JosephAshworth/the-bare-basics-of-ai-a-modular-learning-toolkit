import axios from 'axios';
import { auth } from '../firebase';

// Get the base URL from environment variables or default to the deployed backend
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://emotion-detector-backend-test.onrender.com';

// Log the backend URL being used
console.log(`📡 API Service initialized with backend URL: ${backendUrl}`);

// Create an Axios instance with the base URL
const apiInstance = axios.create({
  baseURL: backendUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false // Set to false to avoid CORS preflight complexity
});

// Helper function to get the best available auth token
const getBestAvailableToken = async (forceRefresh = false) => {
  try {
    // First check if the user is logged in
    const currentUser = auth.currentUser;
    if (currentUser) {
      // If forceRefresh is true or we're handling an auth error, get a fresh token
      if (forceRefresh) {
        console.log('🔄 Forcing refresh of Firebase token');
        const freshToken = await currentUser.getIdToken(true);
        localStorage.setItem('token', freshToken);
        return freshToken;
      }
      
      // Otherwise use stored token if available
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        return storedToken;
      }
      
      // As a fallback, get a fresh token
      console.log('🔄 No stored token found, getting fresh Firebase token');
      const newToken = await currentUser.getIdToken();
      localStorage.setItem('token', newToken);
      return newToken;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  
  // If nothing works, return null
  return null;
};

// Add request interceptor for logging
apiInstance.interceptors.request.use(
  async (config) => {
    console.log(`🔄 API Request: ${config.method.toUpperCase()} ${config.url}`, 
      config.data ? JSON.stringify(config.data).substring(0, 100) : 'No data');
    
    // Debug: Log all headers to see what's actually there
    console.log('🔑 Request Headers:', JSON.stringify(config.headers, null, 2));
    
    // Check if we have an Authorization header - need to check headers common/get/post/etc
    const hasAuthHeader = 
      (config.headers.Authorization) || 
      (config.headers.common && config.headers.common.Authorization) ||
      (config.headers[config.method] && config.headers[config.method].Authorization);
    
    if (!hasAuthHeader) {
      // Get the best available token
      const token = await getBestAvailableToken();
      if (token) {
        console.log('🔑 Using token from helper function for authentication');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('⚠️ No token available for request');
      }
    } else {
      console.log('🔑 Using provided Authorization header');
    }
    
    // Debug: Log final headers after modifications
    console.log('🔑 Final Request Headers:', JSON.stringify(config.headers, null, 2));
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with improved CORS error handling
apiInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error(`❌ Response Error: ${error.response.status}`, error.response.data);
      // Log response headers for debugging
      console.error('❌ Response Headers:', error.response.headers);
      
      // If we get a 401 (Unauthorized) or 403 (Forbidden), try to refresh the token
      if (error.response.status === 401 || error.response.status === 403) {
        console.log('🔄 Authentication error, attempting to refresh token');
        
        try {
          // Get a fresh token
          const freshToken = await getBestAvailableToken(true);
          
          if (freshToken) {
            console.log('🔄 Token refreshed, retrying request');
            // Retry the request with the new token
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${freshToken}`;
            return apiInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('❌ Failed to refresh token:', refreshError);
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ No response received:', error.request);
      
      // Check for CORS errors
      if (error.message && (
        error.message.includes('CORS') || 
        error.message.includes('Access-Control-Allow-Origin') ||
        error.message.includes('cross-origin')
      )) {
        console.error('🚫 CORS error detected:', error.message);
        
        // Enhance the error for better debugging
        error.isCorsError = true;
        error.message = `CORS Error: ${error.message}. Server: ${backendUrl}`;
        
        // Add CORS debugging information
        error.corsDebugInfo = {
          url: error.config.url,
          baseURL: backendUrl,
          fullURL: `${backendUrl}${error.config.url}`,
          method: error.config.method?.toUpperCase(),
          headers: error.config.headers
        };
        
        console.error('🚫 CORS Debug Info:', error.corsDebugInfo);
      }
    } else {
      console.error('❌ Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API service with methods for common operations
const apiService = {
  // Helper method to ensure we have a valid token
  refreshToken: async () => {
    return await getBestAvailableToken(true);
  },
  
  // GET request with optional config
  get: (endpoint, config = {}) => {
    console.log(`🔍 GET request to ${endpoint} with config:`, config);
    return apiInstance.get(endpoint, config);
  },
  
  // POST request with optional config
  post: (endpoint, data, config = {}) => {
    console.log(`📝 POST request to ${endpoint} with config:`, config);
    return apiInstance.post(endpoint, data, config);
  },
  
  // PUT request with optional config
  put: (endpoint, data, config = {}) => {
    console.log(`📝 PUT request to ${endpoint} with config:`, config);
    return apiInstance.put(endpoint, data, config);
  },
  
  // DELETE request with optional config
  delete: (endpoint, config = {}) => {
    console.log(`🗑️ DELETE request to ${endpoint} with config:`, config);
    return apiInstance.delete(endpoint, config);
  },
  
  // Helper for file uploads
  uploadFile: (endpoint, formData, config = {}) => {
    const uploadConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config.headers || {})
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
  
  // Alias method for getFullUrl for backward compatibility
  getUrl: (endpoint) => {
    return apiService.getFullUrl(endpoint);
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