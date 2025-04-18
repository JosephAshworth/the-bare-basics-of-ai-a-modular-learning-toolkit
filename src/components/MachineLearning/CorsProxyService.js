import apiService from '../../services/apiService';

/**
 * CorsProxyService provides fallback functionality for handling CORS issues
 * by using public CORS proxies when direct API calls fail
 */

// List of available public CORS proxies (use only in development/testing)
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];

/**
 * Attempts to make an API call using various CORS proxies if the direct call fails
 * 
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} data - The data to send in the request
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} - The API response
 */
export const proxyFetch = async (endpoint, data, options = {}) => {
  // First try the direct API call
  try {
    console.log('🔄 Attempting direct API call to:', endpoint);
    const response = await apiService.post(endpoint, data, options);
    console.log('✅ Direct API call successful');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Direct API call failed:', error.message);
    
    // Check if it's a CORS error or network error that might benefit from proxy
    if (!error.response || 
        error.message.includes('CORS') || 
        error.message.includes('Network') ||
        (error.response && error.response.status === 502)) {
      
      // Try each CORS proxy in sequence
      for (const proxy of CORS_PROXIES) {
        try {
          console.log(`🔄 Attempting API call via proxy: ${proxy}`);
          
          // Build full URL including the proxy
          const fullProxyUrl = `${proxy}${apiService.getFullUrl(endpoint).replace(/^https?:\/\//, '')}`;
          
          // Make the request through the proxy
          const proxyResponse = await fetch(fullProxyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(data)
          });
          
          // Check if the response is successful
          if (proxyResponse.ok) {
            const responseData = await proxyResponse.json();
            console.log('✅ Proxy API call successful');
            return responseData;
          }
          
          // If we get here, the proxy request was made but returned an error status
          console.warn(`⚠️ Proxy returned status ${proxyResponse.status}`);
        } catch (proxyError) {
          console.warn(`⚠️ Proxy attempt failed:`, proxyError.message);
          // Continue to next proxy
        }
      }
    }
    
    // If we get here, all proxy attempts failed or it wasn't a CORS/network error
    console.error('❌ All API attempts failed');
    
    // Enhance the error with more information
    const enhancedError = {
      originalError: error,
      message: 'API request failed with all available methods',
      endpoint: endpoint,
      proxyAttempts: CORS_PROXIES.length
    };
    
    throw enhancedError;
  }
};

/**
 * Special version of the train model function that uses proxy fallback
 * 
 * @param {Object} params - Model training parameters
 * @returns {Promise<Object>} - Training results
 */
export const trainModelWithProxy = async (params) => {
  try {
    return await proxyFetch('/api/train-model', params, {
      timeout: 90000, // 90 seconds for model training
    });
  } catch (error) {
    throw {
      message: 'Model training failed with all connection methods',
      details: error.message || 'Unknown error',
      originalError: error
    };
  }
};

/**
 * Checks if the backend is accessible directly or needs a proxy
 * 
 * @returns {Promise<Object>} - Connection status information
 */
export const checkBackendConnection = async () => {
  try {
    // Try a direct connection to the backend health endpoint
    const response = await apiService.get('/');
    return {
      direct: true,
      status: 'connected',
      message: 'Direct connection to backend successful'
    };
  } catch (error) {
    console.warn('⚠️ Direct backend connection check failed:', error.message);
    
    // Try with proxy
    try {
      const proxy = CORS_PROXIES[0]; // Use first proxy for quick check
      const backendUrl = apiService.getFullUrl('/').replace(/^https?:\/\//, '');
      const response = await fetch(`${proxy}${backendUrl}`);
      
      if (response.ok) {
        return {
          direct: false,
          proxy: true,
          proxyUrl: proxy,
          status: 'connected-via-proxy',
          message: 'Backend connection established through CORS proxy'
        };
      } else {
        return {
          direct: false,
          proxy: false,
          status: 'backend-error',
          message: `Backend returned status ${response.status}`,
          statusCode: response.status
        };
      }
    } catch (proxyError) {
      return {
        direct: false,
        proxy: false,
        status: 'disconnected',
        message: 'Backend is unreachable directly or through proxies',
        error: proxyError.message
      };
    }
  }
};

export default {
  proxyFetch,
  trainModelWithProxy,
  checkBackendConnection
}; 