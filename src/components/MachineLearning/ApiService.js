import React from 'react';

/**
 * API Service component providing API-related functionality
 * This component doesn't render anything but exports API utility functions
 * to be used by other components in the ML application
 */
const ApiService = () => {
  return null; // This component doesn't render anything
};

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Train a machine learning model with the provided parameters
 * 
 * @param {Object} params - Training parameters
 * @returns {Promise<Object>} API response
 */
export const trainModel = async (params) => {
  const response = await fetch(`${API_BASE_URL}/train-model`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'An error occurred while training the model');
  }
  
  return result;
};

/**
 * Fetch detailed explanation for a decision tree model
 * 
 * @param {Object} params - Parameters for fetching explanations
 * @returns {Promise<Object>} API response
 */
export const fetchTreeExplanation = async (params) => {
  const response = await fetch(`${API_BASE_URL}/explain-tree`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'An error occurred while fetching explanations');
  }
  
  return result;
};

/**
 * Clean up temporary files on the server
 * 
 * @param {Object} params - Cleanup parameters
 * @returns {Promise<void>}
 */
export const cleanupFiles = async (params) => {
  try {
    await fetch(`${API_BASE_URL}/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
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
    
    // Make the API call to the backend
    const response = await fetch(`${API_BASE_URL}/process-csv`, {
      method: 'POST',
      body: formData
    });
    
    // If the response is not OK, handle the error
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
    
    // Parse the response JSON
    const result = await response.json();
    
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