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
  Box // import Box from MUI
} from '@mui/material';

import { 
  trainModel // import trainModel from the ApiService, this is used to train the model
} from './ApiService';

const ModelTrainer = ({  
  trainingParams, // the training parameters for the model
  onTrainingComplete, // the function to call when the training is complete
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
      const errorMessage = err.message || 'Error training model';
      const errorDetails = err.details || err.originalError?.message || 'Unknown error';
      const troubleshootingInfo = err.troubleshooting || '';
      
      // Update state with error information
      setErrorMessage(errorMessage);
      setErrorDetails(errorDetails);
      setTroubleshooting(troubleshootingInfo);
      setShowError(true);
      

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
      <Button
        variant="contained" // set the variant of the button to contained, giving the button a background colour
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // if the loading state is true, display a circular progress indicator, otherwise display null
        onClick={handleTrainModel} // call the handleTrainModel function when the button is clicked
        disabled={isButtonDisabled} // disable the button if the button is disabled
        fullWidth // set the width of the button to 100%
      >
        {loading ? 'Training Model...' : 'Train Model'} {/* display the text of the button, which is 'Training Model...' if the loading state is true, otherwise 'Train Model' */}
      </Button>
        

      
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
