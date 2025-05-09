import
  { 
    useState // import useState, this is used to manage state in functional components
  }
from 'react';

import { 
  Button, // import Button from MUI
  CircularProgress, // import CircularProgress from MUI
  Snackbar, // import Snackbar from MUI
  Alert, // import Alert from MUI
  Typography, // import Typography from MUI
  Box, // import Box from MUI
  Tooltip // import Tooltip from MUI
} from '@mui/material';

import { 
  trainModel // import trainModel from the ApiService, this is used to train the model
} from './ApiService';

const ModelTrainer = ({  
  trainingParams, // the training parameters for the model
  onTrainingComplete, // the function to call when the training is complete
  onTrainingError, // the function to call when the training fails
  onTrainingStart, // the function to call when the training starts
  targetCorrections, // the target corrections for the model
  targetFeature, // the target feature for the model
}) => {
  const [loading, setLoading] = useState(false); // state variable for loading
  const [errorMessage, setErrorMessage] = useState(''); // state variable for errorMessage
  const [errorDetails, setErrorDetails] = useState(''); // state variable for errorDetails
  const [troubleshooting, setTroubleshooting] = useState(''); // state variable for troubleshooting
  const [showError, setShowError] = useState(false); // state variable for showError

  const handleTrainModel = async () => {
    setLoading(true); // set the loading state to true
    setErrorMessage(''); // set the error message to an empty string
    setErrorDetails(''); // set the error details to an empty string
    setTroubleshooting(''); // set the troubleshooting to an empty string
    setShowError(false); // set the showError state to false
    onTrainingStart?.(); // call the onTrainingStart function

    try {
      
      let finalTrainingParams = { ...trainingParams }; // set the final training parameters to the training parameters
      
      finalTrainingParams.targetCorrections = targetCorrections; // set the target corrections to the target corrections
      finalTrainingParams.targetFeature = targetFeature; // set the target feature to the target feature
      
      const result = await trainModel(finalTrainingParams); // train the model
      
      onTrainingComplete?.(result.metrics, result.insights, result.visualisation_url); // call the onTrainingComplete function with the result metrics, insights, and visualisation URL
      
      console.log('Model training complete:', result); // log the model training complete
      

    } catch (err) { // catch any errors that occur
      console.error('API Error:', err); // log the API error
      
      // Extract error information from the error object
      const errorMsg = err.message || 'Error training model';
      const errorDet = err.details || err.originalError?.message || 'Unknown error';
      const troubleshootingInfo = err.troubleshooting || '';
      
      // Update state with error information
      setErrorMessage(errorMsg);
      setErrorDetails(errorDet);
      setTroubleshooting(troubleshootingInfo);
      setShowError(true);
      
      // Call the error callback with formatted error information
      const errorInfo = {
        message: errorMsg,
        details: errorDet,
        troubleshooting: troubleshootingInfo
      };
      onTrainingError?.(errorInfo);
    } finally {
      setLoading(false); // set the loading state to false
    }
  };

  const handleCloseError = () => { 
    setShowError(false); // set the showError state to false
  };

  const { 
    dataset, // set the dataset to the dataset
    customData, // set the custom data to the custom data
    targetWarning // set the target warning to the target warning
  } = trainingParams || {}; // set the training parameters to the training parameters, or an empty object if the training parameters are not available

  const isCustomDatasetNotReady = 
    dataset === 'custom' && (!customData || customData.length === 0); // if the dataset is custom and the custom data is not available or the custom data has no length, then the custom dataset is not ready
  const isTargetInvalid = 
    dataset === 'custom' && targetWarning && targetWarning !== ''; // if the dataset is custom and the target warning is available and the target warning is not an empty string, then the target is invalid
  const isTargetMissing = 
    dataset === 'custom' && !targetFeature; // if the dataset is custom and the target feature is not available, then the target is missing
    
  const isButtonDisabled = loading || 
                           !trainingParams || 
                           isCustomDatasetNotReady || 
                           isTargetInvalid ||
                           isTargetMissing; // if the loading state is true, or the training parameters are not available, or the custom dataset is not ready, or the target is invalid, or the target is missing, then the training button is disabled

  return (
    <>
      <Box sx={{ position: 'relative' }}> {/* display the box with a position of relative to the absolute position of the page */}
        <Button
          variant="contained" // set the variant of the button to contained, giving the button a background colour
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // if the loading state is true, display a circular progress indicator, otherwise display null
          onClick={handleTrainModel} // call the handleTrainModel function when the button is clicked
          disabled={isButtonDisabled} // disable the button if the button is disabled
          fullWidth // set the width of the button to 100%
        >
          {loading ? 'Training Model...' : 'Train Model'} {/* display the text of the button, which is 'Training Model...' if the loading state is true, otherwise 'Train Model' */}
        </Button>
        
        {isButtonDisabled && !loading && ( // display the tooltip when the button is disabled and the loading state is false
          <Tooltip title={ 
            isCustomDatasetNotReady ? "Please upload a custom dataset file first." // display the tooltip title, which is 'Please upload a custom dataset file first.' if the custom dataset is not ready
            : isTargetMissing ? "Please select a target feature for the custom dataset." // display the tooltip title, which is 'Please select a target feature for the custom dataset.' if the target is missing
            : isTargetInvalid ? targetWarning // display the tooltip title, which is the target warning if the target is invalid
            : "Training parameters are not ready." // display the tooltip title, which is 'Training parameters are not ready.' if the training parameters are not ready
          }>
            <span>
              <Button 
                variant="contained" // set the variant of the button to contained, giving the button a background colour
                disabled // disable the button
                fullWidth // set the width of the button to 100%, so the button takes the full width of the parent element
                sx={{ 
                  position: 'absolute', // set the position of the button to absolute, so the button is positioned relative to the parent element
                  top: 0, // set the top of the button to 0, so the button is aligned to the top of the parent element
                  left: 0, // set the left of the button to 0, so the button is aligned to the left of the parent element
                  width: '100%', // set the width of the button to 100%, so the button takes the full width of the parent element
                  height: '100%', // set the height of the button to 100%, so the button takes the full height of the parent element
                  zIndex: 1, // set the z-index of the button to 1, so the button is above other elements
                  backgroundColor: 'action.disabledBackground', // set the background colour of the button to the disabled background colour from the theme
                  pointerEvents: 'none' // set the pointer events of the button to none, so the button is not clickable
                }}
              >
                {loading ? 'Training Model...' : 'Train Model'} {/* display the text of the button, which is 'Training Model...' if the loading state is true, otherwise 'Train Model' */}
              </Button>
            </span>
          </Tooltip>
        )}

      </Box>
      
      <Snackbar 
        open={showError} // if the showError state is true, display the snackbar
        autoHideDuration={15000} // set the autoHideDuration of the snackbar to 15000, so the snackbar will close after 15 seconds
        onClose={handleCloseError} // call the handleCloseError function when the snackbar is closed
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // set the anchorOrigin of the snackbar to bottom and centre
      >
        <Alert 
          onClose={handleCloseError} // call the handleCloseError function when the alert is closed
          severity="error" // set the severity of the alert to error
          variant="filled" // set the variant of the alert to filled
          sx={{ width: '100%', maxWidth: '500px' }} // set the width of the alert to 100%, and the max width of the alert to 500px
        >
          <Typography fontWeight="bold">{errorMessage}</Typography> {/* display the error message in a typography component */}
          
          {errorDetails && ( // if the error details are available, display the error details
            <Box mt={1}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{errorDetails}</Typography> {/* display the error details in a typography component */}
            </Box>
          )}
          
          {troubleshooting && ( // if the troubleshooting is available, display the troubleshooting
            <Box mt={1}>
              <Typography variant="body2" fontWeight="bold">Troubleshooting:</Typography> {/* display the troubleshooting in a typography component */}
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{troubleshooting}</Typography> {/* display the troubleshooting in a typography component */}
            </Box>
          )}
          
          {errorMessage.includes('502') && ( // if the error message includes '502', display the troubleshooting
            <Box mt={1}>
              <Typography variant="body2" fontStyle="italic">
                Try refreshing the page or returning later when the server is available.
              </Typography>
            </Box>
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModelTrainer; // export the ModelTrainer component, so it can be used in other components
