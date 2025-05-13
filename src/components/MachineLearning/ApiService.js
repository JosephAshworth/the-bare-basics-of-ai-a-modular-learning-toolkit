// this file serves as an API service for the Machine Learning application
// it aims to provide utility functions to interact with the backend
// it encapsulates API call logic, ensuring consistency and reusability across different components of the application

import apiService from '../../services/apiService'; // import the apiService from the services folder, this is used to make API requests

const ApiService = () => {
  return null; // return null, this is used to prevent the ApiService from being instantiated by default
};

export const trainModel = async (params) => { // function to train the models
  try { // try to make a POST request to the backend API to train the model
    const response = await apiService.post('/api/train-model', params); // make a POST request to the backend API to train the model
    return response.data; // return the data from the response
  } catch (error) { // catch any errors that occur
    return { error: error.response?.data?.error || 'An error occurred while training the model' }; // return an error object
  }
};

export const uploadCSVFile = async (file, columnsToDiscard = []) => { // function to upload the CSV file
  try { // try to make a POST request to the backend API to upload the CSV file
    console.log('Uploading CSV file to server for processing:', file.name); // print the name of the file to the console
    console.log('Columns to discard:', columnsToDiscard); // print the columns to discard to the console

    const formData = new FormData(); // create a new FormData object, this is used to send the file and the columns to discard to the backend API
    formData.append('file', file); // append the file to the FormData object

    if (columnsToDiscard && columnsToDiscard.length > 0) { // if the columns to discard are not empty
      formData.append('columns_to_drop', columnsToDiscard.join(',')); // append the columns to discard to the FormData object
    }

    const response = await apiService.uploadFile('/api/process-csv', formData); // make a POST request to the backend API to upload the CSV file

    const result = response.data; // set the result to the data from the response

    if (!result.data || !Array.isArray(result.data) || result.data.length === 0) { // if the result is empty or not an array or the length of the result is 0
      console.error('Empty or invalid data returned from server:', result); // print the result to the console
      return { error: 'No valid data found in the uploaded file' }; // return an error object
    }

    console.log('Server successfully processed CSV file with:', { // print the result to the console
      rows: result.data.length, // print the length of the result to the console
      features: result.features, // print the features to the console
      suitableTargets: result.suitable_targets || [], // print the suitable targets to the console
      allColumns: result.all_columns || result.features, // print the all columns to the console
      encodedColumns: result.encoded_columns || {} // print the encoded columns to the console
    });

    return result; // return the result
  } catch (error) { // catch any errors that occur
    console.error('Error processing CSV file:', error); // print the error to the console
    return { error: error.response?.data?.error || 'An error occurred while processing the CSV file' }; // return an error object
  }
};

export default ApiService; // export the ApiService, this is used to make it available to other files
