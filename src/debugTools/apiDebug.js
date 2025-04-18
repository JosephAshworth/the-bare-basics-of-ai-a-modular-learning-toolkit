/**
 * API Debug Utility
 * 
 * This utility helps troubleshoot API connection issues between the frontend and backend.
 * It provides functions to test connections, validate CORS settings, and trace requests.
 */

import axios from 'axios';

// Get the backend URL from environment variables or use default
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
console.log('API Debug Tool using backend URL:', backendUrl);

/**
 * Test the basic connection to the backend
 * @returns {Promise<Object>} Connection test results
 */
export const testConnection = async () => {
  console.log('Testing connection to:', backendUrl);
  try {
    const startTime = performance.now();
    const response = await axios.get(`${backendUrl}/`, {
      timeout: 5000 // 5 second timeout
    });
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    console.log('Connection test successful:', response.data);
    console.log('Latency:', latency.toFixed(2), 'ms');
    
    return {
      success: true,
      latency: latency.toFixed(2),
      serverPort: response.data.port,
      statusCode: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: error.message,
      errorCode: error.code,
      errorType: error.name
    };
  }
};

/**
 * Test the debug endpoint which returns detailed request information
 * @returns {Promise<Object>} Debug request results
 */
export const testDebugRequest = async () => {
  console.log('Testing debug request endpoint:', `${backendUrl}/debug/request`);
  try {
    const response = await axios.get(`${backendUrl}/debug/request`, {
      headers: {
        'X-Debug-Test': 'true',
        'Origin': window.location.origin
      },
      timeout: 5000
    });
    
    console.log('Debug request successful:', response.data);
    return {
      success: true,
      requestInfo: response.data
    };
  } catch (error) {
    console.error('Debug request failed:', error);
    return {
      success: false,
      error: error.message,
      errorCode: error.code,
      errorType: error.name
    };
  }
};

/**
 * Test CORS configuration by sending an OPTIONS request
 * @returns {Promise<Object>} CORS test results
 */
export const testCORS = async () => {
  console.log('Testing CORS configuration with endpoint:', `${backendUrl}/`);
  try {
    // We'll make a preflight OPTIONS request manually
    const response = await axios({
      method: 'OPTIONS',
      url: `${backendUrl}/`,
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('CORS test successful');
    return {
      success: true,
      headers: response.headers,
      allowOrigin: response.headers['access-control-allow-origin'],
      allowMethods: response.headers['access-control-allow-methods'],
      allowHeaders: response.headers['access-control-allow-headers']
    };
  } catch (error) {
    console.error('CORS test failed:', error);
    // Check if we got CORS headers in the error response
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        headers: error.response.headers,
        error: error.message,
        allowOrigin: error.response.headers['access-control-allow-origin'] || 'Not set'
      };
    }
    return {
      success: false,
      error: error.message,
      errorCode: error.code,
      errorType: error.name
    };
  }
};

/**
 * Test a specific API endpoint with optional request data
 * @param {string} endpoint - The API endpoint to test (without the base URL)
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Optional request data for POST/PUT requests
 * @returns {Promise<Object>} Test results
 */
export const testEndpoint = async (endpoint, method = 'GET', data = null) => {
  const fullUrl = `${backendUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  console.log(`Testing endpoint ${method} ${fullUrl}`);
  
  try {
    const startTime = performance.now();
    const response = await axios({
      method,
      url: fullUrl,
      data: data,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Test': 'true'
      }
    });
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    console.log(`Endpoint test successful (${latency.toFixed(2)}ms):`, response.data);
    return {
      success: true,
      latency: latency.toFixed(2),
      statusCode: response.status,
      data: response.data,
      headers: response.headers
    };
  } catch (error) {
    console.error('Endpoint test failed:', error);
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        error: error.message
      };
    }
    return {
      success: false,
      error: error.message,
      errorCode: error.code,
      errorType: error.name
    };
  }
};

/**
 * Run a comprehensive set of API connection tests
 * @returns {Promise<Object>} Comprehensive test results
 */
export const runDiagnostics = async () => {
  console.log('Running comprehensive API diagnostics...');
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      backendUrl,
      frontendUrl: window.location.origin,
      browser: navigator.userAgent
    },
    tests: {}
  };
  
  // Test basic connection
  results.tests.connection = await testConnection();
  
  // Only proceed with other tests if basic connection works
  if (results.tests.connection.success) {
    // Test CORS
    results.tests.cors = await testCORS();
    
    // Test debug endpoint
    results.tests.debugRequest = await testDebugRequest();
    
    // Test routes endpoint
    results.tests.routes = await testEndpoint('/debug/routes');
    
    // Test Firebase status
    results.tests.firebase = await testEndpoint('/firebase_status');
  }
  
  console.log('API diagnostics complete:', results);
  return results;
};

export default {
  testConnection,
  testCORS,
  testDebugRequest,
  testEndpoint,
  runDiagnostics,
  backendUrl
}; 