import React from 'react';
import apiService from '../../services/apiService';

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
    console.log('🧠 Sending model training request with params:', params);
    
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
    return response.data;
  } catch (error) {
    console.error('❌ Model training error:', error);
    
    // Create an enhanced error object with more useful information
    const enhancedError = {
      message: error.message || 'Unknown error',
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: !error.response,
      isCorsError: false,
      isTimeout: error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))
    };
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('❌ Server responded with error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 502) {
        enhancedError.message = 'Backend server error (502 Bad Gateway)';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ No response received from server:', error.request);
      
      // Check for timeout
      if (enhancedError.isTimeout) {
        enhancedError.message = 'Request timed out. The operation may be taking too long or the server is unavailable.';
      }
      
      // Check for CORS errors
      if (error.message && (
        error.message.includes('CORS') || 
        error.message.includes('Access-Control-Allow-Origin') ||
        error.message.includes('cross-origin')
      )) {
        console.error('🚫 CORS error detected:', error.message);
        enhancedError.isCorsError = true;
        enhancedError.message = 'CORS error: The server is rejecting cross-origin requests';
        
        // Try the CORS test endpoint as a diagnostic
        try {
          console.log('🔄 Trying CORS test endpoint...');
          const testResponse = await testCORS();
          console.log('✅ CORS test endpoint response:', testResponse);
          enhancedError.corsTestResponse = testResponse;
        } catch (corsTestError) {
          console.error('❌ CORS test endpoint also failed:', corsTestError);
          enhancedError.corsTestError = corsTestError.message;
        }
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('❌ Error setting up request:', error.message);
    }
    
    // Collect details about the request for debugging
    enhancedError.requestInfo = {
      url: '/api/train-model',
      method: 'POST',
      timestamp: new Date().toISOString(),
      params: JSON.stringify(params).substring(0, 100) + '...' // Truncate for safety
    };
    
    throw enhancedError;
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