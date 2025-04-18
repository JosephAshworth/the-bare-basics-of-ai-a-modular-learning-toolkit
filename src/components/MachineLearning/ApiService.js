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

// Use the backend URL from centralized apiService
const API_BASE_URL = apiService.getUrl('/api');

/**
 * Train a machine learning model with the provided parameters
 * 
 * @param {Object} params - Training parameters
 * @returns {Promise<Object>} API response
 */
export const trainModel = async (params) => {
  try {
    const response = await apiService.post('/api/train-model', params);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'An error occurred while training the model');
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
    const response = await apiService.post('/api/explain-tree', params);
    return response.data;
  } catch (error) {
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
    console.log('Uploading CSV file to server for processing:', file.name);
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
    
    console.log('Server successfully processed CSV file with:', {
      rows: result.data.length,
      features: result.features,
      suitableTargets: result.suitable_targets || [],
      allColumns: result.all_columns || result.features,
      encodedColumns: result.encoded_columns || {}
    });
    
    return result;
  } catch (error) {
    console.error('Error processing CSV file:', error);
    // Re-throw the error for the component to handle
    throw error;
  }
};

export default ApiService; 