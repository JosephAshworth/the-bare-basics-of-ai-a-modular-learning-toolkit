import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
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
  const [showError, setShowError] = useState(false);

  /**
   * Train a machine learning model with the given parameters
   */
  const handleTrainModel = async () => {
    setLoading(true);
    setErrorMessage('');
    setShowError(false);
    onTrainingStart?.();

    try {
      // First perform a CORS test to check connectivity
      try {
        await testCORS();
        console.log('✅ CORS pre-check passed');
      } catch (corsError) {
        console.warn('⚠️ CORS pre-check failed, but continuing with training attempt:', corsError);
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
      
      // Set local error state for the Snackbar
      setErrorMessage(err.message || 'Failed to communicate with the server');
      setShowError(true);
      
      // Notify parent component
      onTrainingError?.(err.message || 'Failed to communicate with the server');
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
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        onClick={handleTrainModel}
        disabled={loading || !trainingParams}
        fullWidth
      >
        {loading ? 'Training Model...' : 'Train Model'}
      </Button>
      
      {/* Error Snackbar */}
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ModelTrainer; 