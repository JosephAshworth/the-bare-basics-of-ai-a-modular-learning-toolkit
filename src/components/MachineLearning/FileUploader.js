import
  React, // import React
  { useState, // import useState, this is used to manage the state of the component
    useCallback // import useCallback, this is used to memoise a function so it's not redefined on every render
  }
from 'react';

import {
  Button, // import Button from @mui/material
  CircularProgress, // import CircularProgress from @mui/material
  Box, // import Box from @mui/material
  Typography, // import Typography from @mui/material
  Alert // import Alert from @mui/material
} from '@mui/material';

import { Upload as UploadIcon } from '@mui/icons-material'; // import UploadIcon from @mui/icons-material

import { uploadCSVFile } from './ApiService'; // import uploadCSVFile from ./ApiService, which is a separate component for the upload of the CSV file

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on the theme

const FileUploader = ({ onFileLoaded, onError, columnsToDiscard = [] }) => { // define a functional component named FileUploader, which handles the upload of the CSV file
  const theme = useTheme(); // for getting the MUI theme object

  const [isLoading, setIsLoading] = useState(false); // state variable for the loading state
  const [fileName, setFileName] = useState(''); // state variable for the file name
  const [debugInfo, setDebugInfo] = useState(''); // state variable for the debug info
  const [currentFile, setCurrentFile] = useState(null); // state variable for the current file

  const isCSVFile = (file) => { // function to check if the file is a CSV file
    const extension = file.name.split('.').pop().toLowerCase(); // get the extension of the file
    return extension === 'csv' || file.type === 'text/csv'; // return true if the extension is CSV or the type is text/csv
  };

  const processFile = useCallback(async (file, columnsToDiscard = []) => { // function to process the file
    if (!file) return; // if the file is not found, return
    
    setIsLoading(true); // set the loading state to true
    setFileName(file.name); // set the file name
    setDebugInfo(`Processing ${file.name}${columnsToDiscard.length > 0 ? ` (discarding ${columnsToDiscard.length} columns)` : ''}...`); // set the debug info, showing the file name and the number of columns to discard
    
    try {
      if (!isCSVFile(file)) { // if the file is not a CSV file, return
        onError?.('Please upload a CSV (.csv) file only'); // call the onError function, if an error occurs
        setDebugInfo('Invalid file type. Only CSV files are supported.'); // set the debug info, showing that only CSV files are supported
        setIsLoading(false); // set the loading state to false
        return;
      }
      
      try {
        const result = await uploadCSVFile(file, columnsToDiscard); // upload the file to the server
        
        const { data, features, suitable_targets, dropped_columns, all_columns } = result; // get the data from the result
        
        let successMessage = `Success! Found ${features.length} original features and ${data.length} rows.`; // set the success message
        if (all_columns && all_columns.length > features.length) { // if the all_columns is not null and the length of the all_columns is greater than the length of the features
          successMessage += ` (${all_columns.length - features.length} encoded columns created)`; // add the encoded columns to the success message
        }
        
        if (dropped_columns && dropped_columns.length > 0) { // if the dropped_columns is not null and the length of the dropped_columns is greater than 0
          successMessage += ` Dropped columns: ${dropped_columns.join(', ')}.`; // add the dropped columns to the success message
        }
        
        if (suitable_targets && suitable_targets.length > 0) { // if the suitable_targets is not null and the length of the suitable_targets is greater than 0
          successMessage += ` Recommended target features: ${suitable_targets.join(', ')}`; // add the suitable targets to the success message
        }
        
        setDebugInfo(successMessage); // set the debug info to the success message
        
        onFileLoaded?.(data, features); // call the onFileLoaded function, if it exists
        
      } catch (error) { // catch any errors
        if (error.message && error.message.includes('Failed to fetch')) { // if the error message includes 'Failed to fetch'
          setDebugInfo('Cannot connect to backend server. Please ensure the backend API is running.'); // set the debug info, showing that the backend server is not running
          onError?.('Cannot connect to backend server. Please ensure the backend API is running.'); // call the onError function, if an error occurs
        } else {
          setDebugInfo(`Server error: ${error.message}`); // set the debug info, showing the server error
          onError?.(`Server error: ${error.message}`); // call the onError function, if an error occurs
        }
      }
    } catch (err) { // catch any errors
      setDebugInfo(`Error: ${err.message}`); // set the debug info, showing the error
      onError?.(`Error processing file: ${err.message}`); // call the onError function, if an error occurs
      console.error('File processing error:', err); // log the error
    } finally { // finally, set the loading state to false
      setIsLoading(false); // set the loading state to false
    }
  }, [onFileLoaded, onError]); // use the onFileLoaded and onError functions as dependencies

  const handleFileUpload = async (event) => { // function to handle the file upload
    const file = event.target.files[0]; // get the file from the event
    if (!file) return; // if the file is not found, return
    
    setCurrentFile(file); // set the current file
    
    await processFile(file, columnsToDiscard); // process the file
  };

  const reprocessFile = useCallback(async () => { // function to reprocess the file
    if (!currentFile) { // if the current file is not found, return
      setDebugInfo('No file to reprocess. Please upload a file first.'); // set the debug info, showing that no file is found
      return;
    }
    
    await processFile(currentFile, columnsToDiscard); // process the file
  }, [currentFile, columnsToDiscard, processFile]); // use the current file and the columns to discard as dependencies

  React.useEffect(() => { 
    if (currentFile && columnsToDiscard.length > 0) { // if the current file is found and the columns to discard is greater than 0
      if (typeof window !== 'undefined') { // if the window is defined
        window.reprocessCurrentFile = reprocessFile; // set the reprocessCurrentFile function to the reprocessFile function
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') { // if the window is defined
        delete window.reprocessCurrentFile; // delete the reprocessCurrentFile function
      }
    };
  }, [currentFile, columnsToDiscard, reprocessFile]); // use the current file and the columns to discard as dependencies

  return (
    <Box>
      <input
        accept=".csv" // accept only CSV files
        style={{ display: 'none' }} // hide the input element
        id="file-upload-input" // id of the input element
        type="file" // type of the input element
        onChange={handleFileUpload} // on change, handle the file upload
        disabled={isLoading} // disable the input element if the loading state is true
      />
      <label htmlFor="file-upload-input"> {/* label for the input element */}
        <Button
          variant="outlined" // variant of the button, giving it an outlined style
          component="span" // component of the button
          startIcon={isLoading ? <CircularProgress size={20} /> : <UploadIcon />} // if the loading state is true, show a circular progress icon, otherwise show an upload icon
          disabled={isLoading} // disable the button if the loading state is true
          fullWidth // use the full width of the parent element
        >
          {isLoading ? 'Processing...' : 'Upload CSV File'} {/* if the loading state is true, show 'Processing...', otherwise show 'Upload CSV File' */}
        </Button>
      </label>
      {fileName && ( // if the file name is found
        <Typography
          variant="caption" // variant of the typography, giving it a caption style
          color={theme.palette.primary.main} // colour of the typography, which is the primary colour from the theme
          sx={{ mt: 1, display: 'block' }} // style of the typography, giving it a margin top of 1 unit and displaying it as a block element
        >
          File: {fileName} {/* show the file name */}
        </Typography>
      )}
      {currentFile && columnsToDiscard.length > 0 && ( // if the current file is found and the columns to discard is greater than 0
        <Button
          variant="outlined" // variant of the button, giving it an outlined style
          color="secondary" // colour of the button, which is the secondary colour from the theme
          size="small" // size of the button, which is small
          onClick={reprocessFile} // on click, reprocess the file
          disabled={isLoading} // disable the button if the loading state is true
          sx={{ mt: 2, mb: 1 }} // style of the button, giving it a margin top of 2 units and a margin bottom of 1 unit
          fullWidth // use the full width of the parent element
        >
          Reprocess with Selected Columns Discarded
        </Button>
      )}
      {debugInfo && ( // if the debug info is found
        <Alert severity="info" sx={{ mt: 2, mb: 1 }}>
          {debugInfo} {/* show the debug info */}
        </Alert>
      )}
    </Box>
  );
};

export default FileUploader; // export the FileUploader component as the default export, so it can be used in other components
