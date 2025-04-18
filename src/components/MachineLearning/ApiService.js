import React from 'react';
import apiService from '../../services/apiService';
import { trainModelWithProxy, checkBackendConnection } from './CorsProxyService';

/**
 * API Service component providing API-related functionality
 * This component doesn't render anything but exports API utility functions
 * to be used by other components in the ML application
 */
const ApiService = () => {
  return null; // This component doesn't render anything
};

// We don't need this since we're using the centralized apiService
// const API_BASE_URL = apiService.getUrl('/api');

/**
 * Train a machine learning model with the provided parameters
 * 
 * @param {Object} params - Training parameters
 * @returns {Promise<Object>} API response
 */
export const trainModel = async (params) => {
  try {
    console.log('🧠 Preparing to send model training request with params:', params);
    
    // Check backend connection status first
    const connectionStatus = await checkBackendConnection();
    console.log('🔍 Backend connection status:', connectionStatus);
    
    // If direct connection is not available, use proxy immediately
    if (!connectionStatus.direct) {
      console.log('⚠️ Direct connection not available, using proxy fallback');
      return await trainModelWithProxy(params);
    }
    
    // For direct connections, proceed with normal flow but with fallback
    try {
      console.log('🧠 Sending model training request directly');
      
      // Add additional headers to help with CORS
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: false, // Set to false to avoid preflight complexity
        timeout: 60000 // 60 second timeout for model training
      };
      
      const response = await apiService.post('/api/train-model', params, config);
      console.log('✅ Direct API call successful');
      return response.data;
    } catch (directError) {
      console.warn('⚠️ Direct API call failed, trying proxy fallback:', directError.message);
      
      // Only use proxy fallback for network/CORS errors
      if (!directError.response || 
          directError.message.includes('Network') || 
          directError.message.includes('CORS') ||
          (directError.response && directError.response.status === 502)) {
        console.log('🔄 Attempting proxy fallback for CORS/network error');
        return await trainModelWithProxy(params);
      } else {
        // For other errors, propagate the original error
        console.error('❌ API error not related to CORS/network:', directError);
        throw directError;
      }
    }
  } catch (error) {
    console.error('❌ Model training completely failed:', error);
    
    // Create a user-friendly error object with diagnostic information
    const friendlyError = {
      message: error.message || 'An error occurred while training the model',
      originalError: error,
      isProxyError: error.proxyAttempts !== undefined,
      timestamp: new Date().toISOString()
    };
    
    // Add extra debugging info for network errors
    if (error.message && error.message.includes('Network')) {
      friendlyError.message = 'Network error: Unable to connect to the ML training server';
      friendlyError.troubleshooting = 'Please check your internet connection and try again later.';
    }
    
    // Add extra help for CORS errors
    if (error.message && error.message.includes('CORS')) {
      friendlyError.message = 'CORS policy error: The server rejected cross-origin request';
      friendlyError.troubleshooting = 'This is a server configuration issue. Try using a CORS browser extension as a temporary workaround.';
    }
    
    // Add suggestions for 502 errors
    if (error.status === 502 || (error.message && error.message.includes('502'))) {
      friendlyError.message = 'Server error (502 Bad Gateway): The ML server is currently unavailable';
      friendlyError.troubleshooting = 'The server might be down for maintenance or experiencing high load. Please try again later.';
    }
    
    throw friendlyError;
  }
};

/**
 * Test CORS configuration with a simple endpoint
 * 
 * @returns {Promise<Object>} API response
 */
export const testCORS = async () => {
  try {
    console.log('🧪 Testing CORS configuration...');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      withCredentials: false
    };
    
    // Try the connection check first which is more reliable
    const connectionStatus = await checkBackendConnection();
    if (!connectionStatus.direct) {
      console.log('⚠️ Using proxy for CORS test');
      // If direct connection fails, use a proxy for the test
      const proxyUrl = connectionStatus.proxyUrl || 'https://cors-anywhere.herokuapp.com/';
      const backendUrl = apiService.getFullUrl('/api/train-model/cors-test').replace(/^https?:\/\//, '');
      const response = await fetch(`${proxyUrl}${backendUrl}`);
      const data = await response.json();
      return {
        ...data,
        via_proxy: true,
        proxy_url: proxyUrl
      };
    }
    
    // Regular direct request if connection is fine
    const response = await apiService.get('/api/train-model/cors-test', config);
    return response.data;
  } catch (error) {
    console.error('❌ CORS test error:', error);
    throw error;
  }
};

/**
 * Fetch detailed explanation for a decision tree model
 * 
 * @param {Object} params - Parameters for fetching explanations
 * @returns {Promise<Object>} API response
 */
export const fetchTreeExplanation = async (params) => {
  try {
    console.log('🔍 Requesting tree explanation with params:', params);
    const response = await apiService.post('/api/explain-tree', params);
    return response.data;
  } catch (error) {
    console.error('❌ Tree explanation error:', error);
    throw new Error(error.response?.data?.error || 'An error occurred while fetching explanations');
  }
};

/**
 * Clean up temporary files on the server
 * 
 * @param {Object} params - Cleanup parameters
 * @returns {Promise<void>}
 */
export const cleanupFiles = async (params) => {
  try {
    console.log('🧹 Cleaning up files with params:', params);
    await apiService.post('/api/cleanup', params);
  } catch (err) {
    console.error('Error cleaning up files:', err);
  }
};

/**
 * Upload and process a CSV file using the backend Python processing
 * 
 * @param {File} file - The CSV file to upload and process
 * @param {Array} columnsToDiscard - Optional array of column names to exclude
 * @returns {Promise<Object>} The processed data including:
 *   - data: Array of data records
 *   - features: Array of column names
 *   - suitable_targets: Array of columns with 5 or fewer unique values
 *   - unique_counts: Object mapping column names to their unique value counts
 */
export const uploadCSVFile = async (file, columnsToDiscard = []) => {
  try {
    console.log('📤 Uploading CSV file to server for processing:', file.name);
    console.log('Columns to discard:', columnsToDiscard);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Add columns to discard if provided
    if (columnsToDiscard && columnsToDiscard.length > 0) {
      formData.append('columns_to_drop', columnsToDiscard.join(','));
    }
    
    // Make the API call to the backend using apiService
    const response = await apiService.uploadFile('/api/process-csv', formData);
    
    // Parse the response data
    const result = response.data;
    
    // Validate the result
    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
      console.error('Empty or invalid data returned from server:', result);
      throw new Error('No valid data found in the uploaded file');
    }
    
    console.log('✅ Server successfully processed CSV file with:', {
      rows: result.data.length,
      features: result.features,
      suitableTargets: result.suitable_targets || [],
      allColumns: result.all_columns || result.features,
      encodedColumns: result.encoded_columns || {}
    });
    
    return result;
  } catch (error) {
    console.error('❌ Error processing CSV file:', error);
    // Re-throw the error for the component to handle
    throw error;
  }
};

export default ApiService; 