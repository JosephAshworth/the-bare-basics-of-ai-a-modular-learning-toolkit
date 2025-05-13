// the button that triggers the model training
// defining the conditions for the button to be disabled

import { useState } from 'react';

// material ui components
import { 
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Box
} from '@mui/material';

import { 
  trainModel
} from './MachineLearningUtilities';

const ModelTrainer = ({  
  trainingParams,
  onTrainingComplete,
  targetCorrections,
  targetFeature,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [troubleshooting, setTroubleshooting] = useState('');
  const [showError, setShowError] = useState(false);

  const handleTrainModel = async () => {
    setLoading(true);
    setErrorMessage('');
    setErrorDetails('');
    setTroubleshooting('');
    setShowError(false);

    try {
      let finalTrainingParams = { ...trainingParams }; // create a copy of the training parameters to avoid messing up the original ones
      finalTrainingParams.targetCorrections = targetCorrections; // add or update the target corrections in the copied training parameters
      finalTrainingParams.targetFeature = targetFeature; // add or update the target feature in the copied training parameters
      
      const result = await trainModel(finalTrainingParams);
      
      if (result.error) {
        setErrorMessage(result.error);
        setShowError(true);
      } else {
        // if there is no error, render the results after the model has been trained
        onTrainingComplete?.(result.metrics, result.insights, result.visualisation_url);
        console.log('Model training complete:', result);
      }
    } catch (err) {
      console.error('API Error:', err);
      
      const errorMessage = err.message || 'Error training model';
      const errorDetails = err.details || err.originalError?.message || 'Unknown error';
      const troubleshootingInfo = err.troubleshooting || '';
      
      setErrorMessage(errorMessage);
      setErrorDetails(errorDetails);
      setTroubleshooting(troubleshootingInfo);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => { 
    setShowError(false);
  };

  const { 
    dataset,
    customData,
    targetWarning
  } = trainingParams || {};

  // check if the different conditions for the button to be disabled are met (it cannot be clicked if so)
  const isCustomDatasetNotReady = 
    dataset === 'custom' && (!customData || customData.length === 0);
  const isTargetInvalid = 
    dataset === 'custom' && targetWarning && targetWarning !== '';
  const isTargetMissing = 
    dataset === 'custom' && !targetFeature;
    
  const isButtonDisabled = loading || 
                           !trainingParams || 
                           isCustomDatasetNotReady || 
                           isTargetInvalid ||
                           isTargetMissing;

  return (
    <>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        onClick={handleTrainModel}
        disabled={isButtonDisabled}
        fullWidth
      >
        {loading ? 'Training Model...' : 'Train Model'}
      </Button>
      
      <Snackbar 
        open={showError}
        autoHideDuration={15000} // the error message will be displayed for 15 seconds
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: '100%', maxWidth: '500px' }}
        >
          <Typography fontWeight="bold">{errorMessage}</Typography>
          
          {errorDetails && (
            <Box mt={1}>
              {/* use a smaller font size and allow the text to wrap */}
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{errorDetails}</Typography>
            </Box>
          )}
          
          {troubleshooting && (
            <Box mt={1}>
              <Typography variant="body2" fontWeight="bold">Troubleshooting:</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{troubleshooting}</Typography>
            </Box>
          )}
          
          {errorMessage.includes('502') && ( // bad gateway
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

export default ModelTrainer;