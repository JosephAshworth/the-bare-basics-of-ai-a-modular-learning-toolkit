import React, { useState } from 'react';
import { Button, CircularProgress, Box, Typography, Alert } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { uploadCSVFile } from './ApiService';

/**
 * FileUploader component for handling file uploads in the ML application
 * This component handles CSV file uploads by sending them to the backend
 * for processing using Python's pandas library
 */
const FileUploader = ({ onFileLoaded, onError, columnsToDiscard = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [currentFile, setCurrentFile] = useState(null);

  /**
   * Check if a file is a CSV file
   * 
   * @param {File} file - The file to check
   * @returns {boolean} Whether the file is a CSV file
   */
  const isCSVFile = (file) => {
    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase();
    return extension === 'csv' || file.type === 'text/csv';
  };

  /**
   * Process the file with the backend
   * 
   * @param {File} file - The file to process
   * @param {Array} columnsToDiscard - Columns to discard
   */
  const processFile = async (file, columnsToDiscard = []) => {
    if (!file) return;
    
    setIsLoading(true);
    setFileName(file.name);
    setDebugInfo(`Processing ${file.name}${columnsToDiscard.length > 0 ? ` (discarding ${columnsToDiscard.length} columns)` : ''}...`);
    
    try {
      // Validate file type - only accept CSV files
      if (!isCSVFile(file)) {
        onError?.('Please upload a CSV (.csv) file only');
        setDebugInfo('Invalid file type. Only CSV files are supported.');
        setIsLoading(false);
        return;
      }
      
      try {
        // Upload the CSV file to the backend for Python processing
        const result = await uploadCSVFile(file, columnsToDiscard);
        
        // Extract data from the result
        const { data, features, suitable_targets, dropped_columns, all_columns } = result;
        
        // Show success information
        let successMessage = `Success! Found ${features.length} original features and ${data.length} rows.`;
        if (all_columns && all_columns.length > features.length) {
          successMessage += ` (${all_columns.length - features.length} encoded columns created)`; 
        }
        
        if (dropped_columns && dropped_columns.length > 0) {
          successMessage += ` Dropped columns: ${dropped_columns.join(', ')}.`;
        }
        
        if (suitable_targets && suitable_targets.length > 0) {
          successMessage += ` Recommended target features: ${suitable_targets.join(', ')}`;
        }
        
        setDebugInfo(successMessage);
        
        // Pass the processed data back to the parent component
        onFileLoaded?.(data, features);
        
      } catch (error) {
        // Handle specific errors
        if (error.message && error.message.includes('Failed to fetch')) {
          setDebugInfo('Cannot connect to backend server. Please ensure the Python backend is running at http://localhost:5000');
          onError?.('Cannot connect to backend server. Please ensure the Python backend is running.');
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
  };

  /**
   * Handle file upload event
   * 
   * @param {Event} event - File input change event
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Store the current file for potential reprocessing
    setCurrentFile(file);
    
    // Process the file
    await processFile(file, columnsToDiscard);
  };

  /**
   * Reprocess the current file with updated columns to discard
   */
  const reprocessFile = async () => {
    if (!currentFile) {
      setDebugInfo('No file to reprocess. Please upload a file first.');
      return;
    }
    
    await processFile(currentFile, columnsToDiscard);
  };

  // If we have columns to discard and a current file, expose the reprocess method
  React.useEffect(() => {
    if (currentFile && columnsToDiscard.length > 0) {
      // Make reprocessFile available to parent components
      if (typeof window !== 'undefined') {
        window.reprocessCurrentFile = reprocessFile;
      }
    }
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        delete window.reprocessCurrentFile;
      }
    };
  }, [currentFile, columnsToDiscard]);

  return (
    <Box>
      <input
        accept=".csv"
        style={{ display: 'none' }}
        id="file-upload-input"
        type="file"
        onChange={handleFileUpload}
        disabled={isLoading}
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
        <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
          File: {fileName}
        </Typography>
      )}
      {currentFile && columnsToDiscard.length > 0 && (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={reprocessFile}
          disabled={isLoading}
          sx={{ mt: 2, mb: 1 }}
          fullWidth
        >
          Reprocess with Selected Columns Discarded
        </Button>
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