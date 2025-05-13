// this file provides utilities for the machine learning page
// it aims to provide utility functions to interact with the backend
// it encapsulates API call logic, ensuring consistency and reusability across different components of the machine learning page

import apiService from '../../services/APIService';

const MLUtilities = () => {
  return null; // prevent the service from being started by default 
};

export const trainModel = async (params) => {
  try {
    const response = await apiService.post('/api/train-model', params);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'An error occurred while training the model' };
  }
};

export const uploadCSVFile = async (file, columnsToDiscard = []) => {
  try {
    console.log('Uploading CSV file to server for processing:', file.name);
    console.log('Columns to discard:', columnsToDiscard);

    const formData = new FormData(); // create a new form data object to store the file and any additional parameters
    formData.append('file', file); // append the uploaded file to the form data

    if (columnsToDiscard && columnsToDiscard.length > 0) { // if there are columns to discard, append them to the form data
      formData.append('columns_to_drop', columnsToDiscard.join(','));
    }

    const response = await apiService.uploadFile('/api/process-csv', formData);

    const result = response.data;

    // if the result is empty or not an array, or the array is empty, return an error
    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
      console.error('Empty or invalid data returned from server:', result);
      return { error: 'No valid data found in the uploaded file' };
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
    return { error: error.response?.data?.error || 'An error occurred while processing the CSV file' };
  }
};

export default MLUtilities;