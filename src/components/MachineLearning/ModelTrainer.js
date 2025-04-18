import React, { useState, useEffect } from 'react';
import { 
  Button, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Typography, 
  Box, 
  Link,
  Chip
} from '@mui/material';
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
  const [troubleshooting, setTroubleshooting] = useState('');
  const [showError, setShowError] = useState(false);
  const [isUsingProxy, setIsUsingProxy] = useState(false);

  /**
   * Train a machine learning model with the given parameters
   */
  const handleTrainModel = async () => {
    setLoading(true);
    setErrorMessage('');
    setErrorDetails('');
    setTroubleshooting('');
    setShowError(false);
    setIsUsingProxy(false);
    onTrainingStart?.();

    try {
      // First perform a connection test
      try {
        const corsTest = await testCORS();
        console.log('✅ Backend connection test result:', corsTest);
        // Check if we're using a proxy
        if (corsTest.via_proxy) {
          setIsUsingProxy(true);
          console.log('⚠️ Using proxy for API communications');
        }
      } catch (corsError) {
        console.warn('⚠️ Backend connection test failed, but continuing with training attempt:', corsError);
      }
      
      const result = await trainModel(trainingParams);
      
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
      
      // Extract error details from the enhanced error object
      setErrorMessage(err.message || 'Error training model');
      
      // Add helpful details based on error type
      if (err.originalError) {
        // This is our enhanced error format
        setErrorDetails(err.details || err.originalError.message || 'Unknown error');
        setTroubleshooting(err.troubleshooting || '');
        
        // Handle proxy-specific information
        if (err.isProxyError) {
          setErrorDetails(`All connection methods failed, including ${err.proxyAttempts || 'multiple'} proxy attempts`);
          setTroubleshooting('The server might be completely unreachable or experiencing severe issues. Try again later.');
        }
      } else {
        // Standard error format
        setErrorDetails(err.details || err.message || 'Unknown error occurred');
      }
      
      // Show error message
      setShowError(true);
      
      // Notify parent component
      const errorInfo = `${errorMessage}: ${errorDetails || ''}`;
      onTrainingError?.(errorInfo);
    } finally {
      setLoading(false);
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
      <Box sx={{ position: 'relative' }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          onClick={handleTrainModel}
          disabled={loading || !trainingParams}
          fullWidth
        >
          {loading ? 'Training Model...' : 'Train Model'}
        </Button>
        
        {isUsingProxy && (
          <Chip 
            label="Proxy Mode" 
            color="warning" 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: -10, 
              right: -10,
              fontSize: '0.7rem'
            }}
          />
        )}
      </Box>
      
      {/* Error Snackbar with expanded details */}
      <Snackbar 
        open={showError} 
        autoHideDuration={15000} 
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
              <Typography variant="body2">{errorDetails}</Typography>
            </Box>
          )}
          
          {troubleshooting && (
            <Box mt={1}>
              <Typography variant="body2" fontWeight="bold">Troubleshooting:</Typography>
              <Typography variant="body2">{troubleshooting}</Typography>
            </Box>
          )}
          
          {/* Common fallback instructions for server errors */}
          {errorMessage.includes('502') && (
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