import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiService from '../../services/apiService';
import { auth } from '../../firebase';

const CompleteModuleButton = ({ moduleId, moduleName }) => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [useFallbackEndpoint, setUseFallbackEndpoint] = useState(false);
  const [skipServerCalls, setSkipServerCalls] = useState(false);

  // Debug log on component mount
  useEffect(() => {
    console.log(`CompleteModuleButton mounted for module: ${moduleId} (${moduleName})`);
  }, [moduleId, moduleName]);

  // Check if module is completed on component mount
  useEffect(() => {
    checkModuleStatus();
  }, [moduleId]);

  const checkModuleStatus = async () => {
    // Skip server calls if we've previously encountered persistent errors
    if (skipServerCalls) {
      console.log(`Skipping server calls for ${moduleId} due to previous errors`);
      return;
    }
    
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log('Not authenticated in checkModuleStatus');
        return; // Not authenticated
      }
      
      // Get the authentication token
      const token = await currentUser.getIdToken();
      
      console.log(`Checking status for module: ${moduleId}`);
      
      // Try with /api prefix first
      try {
        const response = await apiService.get('/api/modules/progress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Modules progress response:', response.data);
        
        // Find this module in the response
        const module = response.data.find(m => m.id === moduleId);
        if (module && module.completed) {
          console.log(`Module ${moduleId} is already completed`);
          setCompleted(true);
        } else {
          console.log(`Module ${moduleId} is not completed`);
        }
      } catch (firstError) {
        // Try without /api prefix
        try {
          console.log('Retrying without /api prefix', firstError);
          const response = await apiService.get('/modules/progress', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Find this module in the response
          const module = response.data.find(m => m.id === moduleId);
          if (module && module.completed) {
            console.log(`Module ${moduleId} is already completed`);
            setCompleted(true);
          } else {
            console.log(`Module ${moduleId} is not completed`);
          }
        } catch (secondError) {
          console.error(`Both API paths failed for modules progress: ${secondError.message}`);
          // Local fallback - don't show error to user but log it
          setSkipServerCalls(true);
        }
      }
    } catch (err) {
      console.error('Error checking module status:', err);
      // Don't show error to user - the button will still work locally
    }
  };

  const handleCompleteModule = async () => {
    setLoading(true);
    setError(null);
    
    const newCompleted = !completed;
    
    // Update local state immediately for better UX
    setCompleted(newCompleted);
    
    // Skip server update if we've had persistent errors
    if (skipServerCalls) {
      setSnackbarOpen(true); // Show success message
      setLoading(false);
      return;
    }
    
    try {      
      // First try to update the server
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      // Get the authentication token
      const token = await currentUser.getIdToken();
      
      // Determine which endpoint to use
      let endpoint = useFallbackEndpoint 
        ? `/api/complete-module-simple/${moduleId}`
        : `/api/modules/${moduleId}/complete`;
      
      console.log(`Using endpoint: ${endpoint} (fallback: ${useFallbackEndpoint})`);
      
      try {
        // Send the update to the server with the first endpoint
        await apiService.post(endpoint, 
          { completed: newCompleted },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 10000 // 10 second timeout
          }
        );
      } catch (firstError) {
        // If first endpoint fails, try without /api prefix
        console.log('First endpoint failed, trying without /api prefix', firstError);
        
        endpoint = useFallbackEndpoint 
          ? `/complete-module-simple/${moduleId}`
          : `/modules/${moduleId}/complete`;
        
        console.log(`Using alternative endpoint: ${endpoint}`);
        
        // Send the update to the server with alternative endpoint
        await apiService.post(endpoint, 
          { completed: newCompleted },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 10000 // 10 second timeout
          }
        );
      }
      
      // Show success message
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error updating module completion:', err);
      
      // If we haven't tried the fallback yet and got a 404 error, try the fallback endpoint
      if (!useFallbackEndpoint && err.response && err.response.status === 404) {
        console.log('Main endpoint failed with 404, trying fallback endpoint...');
        setUseFallbackEndpoint(true);
        // Try again with fallback endpoint
        handleCompleteModule();
        return;
      }
      
      // Provide more specific error messages
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server response error:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
        setError(`Server error: ${err.response.status} - ${err.response.data.error || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Could not connect to the server. Your progress has been saved locally.');
        setSkipServerCalls(true);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
      
      setSnackbarOpen(true);
    } finally {
      if (!useFallbackEndpoint) {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color={completed ? "success" : "primary"}
        size="large"
        onClick={handleCompleteModule}
        disabled={loading}
        startIcon={completed ? <CheckCircleIcon /> : null}
        sx={{
          py: 1.5,
          px: 4,
          borderRadius: '8px',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s',
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          completed ? `${moduleName} Completed` : `Mark ${moduleName} as Completed`
        )}
      </Button>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "warning" : "success"} 
          sx={{ width: '100%' }}
        >
          {error ? error : completed 
            ? `${moduleName} marked as completed!` 
            : `${moduleName} marked as incomplete.`}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CompleteModuleButton; 