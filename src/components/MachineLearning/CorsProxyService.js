/**
 * Direct Backend Connection Service
 * 
 * This service provides optimized ways to connect directly to your backend API
 * without using third-party proxies. It includes:
 * 
 * 1. Detection for CORS browser extensions
 * 2. Optimized request headers for direct API access
 * 3. Clear error messages with actionable troubleshooting steps
 */

import apiService from '../../services/apiService';

// Backend URL to check
const BACKEND_URL = 'https://emotion-detector-backend-test.onrender.com/api/train-model';

/**
 * Check if a CORS bypass extension is installed in the browser
 * @returns {Promise<boolean>}
 */
const checkForCorsExtension = async () => {
  try {
    // Test if the browser has modified CORS behavior
    const testUrl = 'https://cors-test.appspot.com/test';
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
      headers: { 'X-Test-CORS-Extension': 'true' }
    });
    
    return response.ok;
  } catch (error) {
    console.log('No CORS extension detected');
    return false;
  }
};

/**
 * Make an optimized direct request to the backend
 * @param {Object} params - Request parameters
 * @returns {Promise<Object>} - Response data
 */
const makeOptimizedRequest = async (params) => {
  console.log('Making optimized direct request to backend...');
  
  // Enhanced request configuration with optimized headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': window.location.origin
    },
    withCredentials: false,
    timeout: 90000 // 90 seconds for ML training
  };
  
  const response = await apiService.post('/api/train-model', params, config);
  return response.data;
};

/**
 * Train a model with direct connection to your backend
 * @param {Object} params - Training parameters 
 * @returns {Promise<Object>} - Response data
 */
export const trainModelDirect = async (params) => {
  console.log('Training model with direct backend connection...');
  
  try {
    // First try a basic direct request
    try {
      console.log('Attempting direct API call');
      const response = await apiService.post('/api/train-model', params, {
        timeout: 90000
      });
      console.log('✅ Direct API call successful!');
      return response.data;
    } catch (directError) {
      console.warn('⚠️ Direct API call failed:', directError.message);
      
      // Check if CORS extension is installed
      const hasExtension = await checkForCorsExtension();
      
      if (hasExtension) {
        // Try with optimized request settings if an extension is detected
        console.log('CORS extension detected, attempting optimized request');
        return await makeOptimizedRequest(params);
      } else {
        // No extension detected, provide clear guidance
        throw new Error(
          'CORS policy is blocking access to your backend API. ' +
          'To fix this, install a CORS browser extension like "CORS Unblock" or "Allow CORS".'
        );
      }
    }
  } catch (error) {
    console.error('❌ All connection attempts failed:', error);
    
    // Create an enhanced error with clear troubleshooting steps
    const enhancedError = new Error(
      error.message || 'Failed to connect to your backend API'
    );
    
    enhancedError.originalError = error;
    enhancedError.timestamp = new Date().toISOString();
    enhancedError.suggestions = [
      'Install a CORS browser extension like "CORS Unblock" or "Allow CORS"',
      'Activate the extension and reload this page',
      'If you have access to the backend code, add proper CORS headers',
      'Check if your backend server is running at: ' + BACKEND_URL
    ];
    
    throw enhancedError;
  }
};

/**
 * Check if the backend is accessible
 * @returns {Promise<Object>} - Connection status
 */
export const checkBackendConnection = async () => {
  console.log('Checking backend connection...');
  
  try {
    // Try a simple HEAD request to check connectivity
    const response = await fetch(BACKEND_URL, { 
      method: 'HEAD',
      mode: 'cors',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    
    return {
      direct: true,
      status: response.status,
      message: 'Direct connection to backend API available',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn('⚠️ Direct backend connection failed:', error.message);
    
    // Check if a CORS extension is installed
    const hasExtension = await checkForCorsExtension();
    
    return {
      direct: false,
      corsExtension: hasExtension,
      error: error.message,
      message: hasExtension 
        ? 'CORS extension detected but connection still failed' 
        : 'Connection blocked by CORS policy',
      suggestions: hasExtension 
        ? ['Ensure your CORS extension is enabled for this site'] 
        : ['Install a CORS browser extension like "CORS Unblock"'],
      timestamp: new Date().toISOString()
    };
  }
}; 