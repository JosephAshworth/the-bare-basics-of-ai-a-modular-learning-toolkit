// the button that allows the user to upload a CSV file
// shown when the dataset is custom

// useCallback is used to memoise a function so it's not redefined on every render
import React, { useState, useCallback } from 'react';

// material ui components
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Alert
} from '@mui/material';

import { Upload as UploadIcon } from '@mui/icons-material';

// for uploading the CSV file to the backend (for processing and cleaning)
import { uploadCSVFile } from './MachineLearningUtilities';

import { useTheme } from '@mui/material/styles';

const FileUploader = ({ onFileLoaded, onError }) => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [debugInfo, setDebugInfo] = useState('');


  const isCSVFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    return extension === 'csv' || file.type === 'text/csv';
  };

  const processFile = useCallback(async (file) => {
    if (!file) return;
    
    setIsLoading(true);
    setFileName(file.name);
    setDebugInfo(`Processing ${file.name}...`);
    
    try {
      if (!isCSVFile(file)) {
        onError?.('Please upload a CSV (.csv) file only');
        setDebugInfo('Invalid file type. Only CSV files are supported.');
        setIsLoading(false);
        return;
      }
      
      try {
        const result = await uploadCSVFile(file);
        
        // get the properties from the result
        const { data, features, suitable_targets, dropped_columns, all_columns } = result;
        
        let successMessage = `Success! Found ${features.length} original features and ${data.length} rows.`;
        if (all_columns && all_columns.length > features.length) {
          // if there are more columns in the original file than the features, add the encoded columns to the success message
          successMessage += ` (${all_columns.length - features.length} encoded columns created)`;
        }
        
        // check if there are any dropped columns
        if (dropped_columns && dropped_columns.length > 0) {
          successMessage += ` Dropped columns: ${dropped_columns.join(', ')}.`;
        }
        
        // check if there are any recommended target features
        if (suitable_targets && suitable_targets.length > 0) {
          successMessage += ` Recommended target features: ${suitable_targets.join(', ')}`;
        }
        
        setDebugInfo(successMessage);
        
        onFileLoaded?.(data, features);
        
      } catch (error) {
        if (error.message && error.message.includes('Failed to fetch')) {
          setDebugInfo('Cannot connect to backend server. Please ensure the backend API is running.');
          onError?.('Cannot connect to backend server. Please ensure the backend API is running.');
        } else {
          setDebugInfo(`Server error: ${error.message}`);
          onError?.(`Server error: ${error.message}`);
        }
      }
    } catch (err) {
      setDebugInfo(`Error: ${err.message}`);
      onError?.(`Error processing file: ${err.message}`);
      console.error('File processing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onFileLoaded, onError]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // get the first file from the event
    if (!file) return;
    
    await processFile(file);
  };

  return (
    <Box>
      <input
        accept=".csv" // only accept CSV files
        style={{ display: 'none' }} // hide the input element displayed by default
        id="file-upload-input"
        type="file"
        onChange={handleFileUpload}
        disabled={isLoading} // disable the button if the file is being processed
      />
      <label htmlFor="file-upload-input">
        <Button
          variant="outlined"
          component="span"
          startIcon={isLoading ? <CircularProgress size={20} /> : <UploadIcon />}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Processing...' : 'Upload CSV File'}
        </Button>
      </label>
      {fileName && (
        <Typography
          variant="caption"
          color={theme.palette.primary.main}
          sx={{ mt: 1, display: 'block' }}
        >
          File: {fileName}
        </Typography>
      )}
      {debugInfo && (
        <Alert severity="info" sx={{ mt: 2, mb: 1 }}>
          {debugInfo}
        </Alert>
      )}
    </Box>
  );
};

export default FileUploader;