import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Snackbar, Alert, Typography, Box, Link } from '@mui/material';
import { trainModel, fetchTreeExplanation, cleanupFiles, testCORS } from './ApiService';

/**
 * Component for handling model training
 */
const ModelTrainer = ({ 
  trainingParams, 
  onTrainingComplete, 
  onTrainingError,
  onTrainingStart
}) => {
  const [loading, setLoading] = useState(false);
  const [modelPath, setModelPath] = useState(null);
  const [explainerPath, setExplainerPath] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [showError, setShowError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  /**
   * Train a machine learning model with the given parameters
   */
  const handleTrainModel = async () => {
    setLoading(true);
    setErrorMessage('');
    setErrorDetails('');
    setShowError(false);
    onTrainingStart?.();

    try {
      // Check backend connection first
      try {
        await testCORS();
        console.log('✅ Backend connection test passed');
      } catch (corsError) {
        console.warn('⚠️ Backend connection test failed:', corsError);
        // We'll continue anyway but log the warning
      }
      
      const result = await trainModel(trainingParams);
      
      // Reset retry count on success
      setRetryCount(0);
      
      // Set model and explainer paths if they're in the response
      if (result.model_path) {
        setModelPath(result.model_path);
      }
      
      if (result.explainer_path) {
        setExplainerPath(result.explainer_path);
      }
      
      // Notify parent component of completion
      onTrainingComplete?.(result.metrics, result.insights, result.visualization);
      
      console.log('Model training complete:', result);
      
      // If it's a decision tree, fetch detailed explanations
      if (trainingParams.modelType === 'decision_tree' && result.model_path) {
        try {
          const explanationParams = {
            model_path: result.model_path,
            explainer_path: result.explainer_path || '',
            features: trainingParams.selectedFeatures && trainingParams.selectedFeatures.length > 0 
              ? trainingParams.selectedFeatures 
              : trainingParams.features,
            target: trainingParams.targetFeature,
            dataset: trainingParams.dataset
          };
          
          const detailedResult = await fetchTreeExplanation(explanationParams);
          console.log('Detailed explanations:', detailedResult);
        } catch (err) {
          console.error('Error fetching detailed explanations:', err.message);
          // Don't bubble up this error as it's an enhancement
        }
      }
    } catch (err) {
      console.error('API Error:', err);
      
      // Handle specific error types
      if (err.status === 502 || (err.message && err.message.includes('502'))) {
        // Backend server error (Bad Gateway)
        setErrorMessage('Backend server error (502 Bad Gateway)');
        setErrorDetails('The server is currently experiencing issues. This may be due to high load, maintenance, or server restart.');
        
        // Attempt retry for 502 errors if we haven't exceeded the limit
        if (retryCount < MAX_RETRIES) {
          setErrorMessage(`Backend server error (502). Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          setRetryCount(prev => prev + 1);
          
          // Retry after 3 seconds
          setTimeout(() => {
            handleTrainModel();
          }, 3000);
          return;
        }
      } else if (err.isCorsError || (err.message && (
        err.message.includes('CORS') || 
        err.message.includes('Access-Control-Allow-Origin') ||
        err.message.includes('cross-origin')
      ))) {
        // CORS error
        setErrorMessage('Cross-Origin Request Blocked (CORS Error)');
        setErrorDetails('The server is not allowing cross-origin requests. This is a server configuration issue that needs to be fixed on the backend.');
      } else if (err.message && err.message.includes('timeout')) {
        // Timeout error
        setErrorMessage('Request Timeout');
        setErrorDetails('The server took too long to respond. This may be due to high load or complex model training.');
      } else if (err.status >= 400 && err.status < 500) {
        // Client errors
        setErrorMessage(`Client Error (${err.status})`);
        setErrorDetails(err.data?.error || err.message || 'The request was invalid. Please check your data and try again.');
      } else if (err.status >= 500) {
        // Server errors
        setErrorMessage(`Server Error (${err.status})`);
        setErrorDetails(err.data?.error || err.message || 'The server encountered an error while processing your request.');
      } else {
        // General error
        setErrorMessage('Error Training Model');
        setErrorDetails(err.message || 'An unknown error occurred while training the model.');
      }
      
      // Show error message
      setShowError(true);
      
      // Notify parent component
      onTrainingError?.(errorMessage + (errorDetails ? ': ' + errorDetails : ''));
    } finally {
      if (retryCount >= MAX_RETRIES || !errorMessage.includes('Retrying')) {
        setLoading(false);
      }
    }
  };

  // Handle closing the error Snackbar
  const handleCloseError = () => {
    setShowError(false);
  };

  // Cleanup function to remove temporary files
  useEffect(() => {
    return () => {
      if (modelPath || explainerPath) {
        cleanupFiles({
          model_path: modelPath,
          explainer_path: explainerPath
        });
      }
    };
  }, [modelPath, explainerPath]);

  return (
    <>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        onClick={handleTrainModel}
        disabled={loading || !trainingParams}
        fullWidth
      >
        {loading ? (retryCount > 0 ? `Retrying (${retryCount}/${MAX_RETRIES})...` : 'Training Model...') : 'Train Model'}
      </Button>
      
      {/* Error Snackbar with expanded details */}
      <Snackbar 
        open={showError} 
        autoHideDuration={10000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          <Typography fontWeight="bold">{errorMessage}</Typography>
          {errorDetails && (
            <Box mt={1}>
              <Typography variant="body2">{errorDetails}</Typography>
              {errorMessage.includes('502') && (
                <Typography variant="body2" mt={1}>
                  Try refreshing the page or coming back later. If the problem persists, 
                  please contact support.
                </Typography>
              )}
            </Box>
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModelTrainer; 