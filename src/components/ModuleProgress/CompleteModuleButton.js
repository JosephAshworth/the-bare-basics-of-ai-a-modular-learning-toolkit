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

  // Debug log on component mount
  useEffect(() => {
    console.log(`CompleteModuleButton mounted for module: ${moduleId} (${moduleName})`);
  }, [moduleId, moduleName]);

  // Check if module is completed on component mount
  useEffect(() => {
    checkModuleStatus();
  }, [moduleId]);

  const checkModuleStatus = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log('Not authenticated in checkModuleStatus');
        return; // Not authenticated
      }
      
      // Get the authentication token
      const token = await currentUser.getIdToken();
      
      console.log(`Checking status for module: ${moduleId}`);
      const response = await apiService.get('/modules/progress', {
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
    } catch (err) {
      console.error('Error checking module status:', err);
    }
  };

  const handleCompleteModule = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newCompleted = !completed;
      
      // First try to update the server
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      // Get the authentication token
      const token = await currentUser.getIdToken();
      
      // Determine which endpoint to use
      const endpoint = useFallbackEndpoint 
        ? `/api/complete-module-simple/${moduleId}`
        : `/api/modules/${moduleId}/complete`;
        
      console.log(`Using endpoint: ${endpoint} (fallback: ${useFallbackEndpoint})`);
      
      // Send the update to the server
      await apiService.post(endpoint, 
        { completed: newCompleted },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Now update local state since server update was successful
      setCompleted(newCompleted);
      
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
        setError('Could not connect to the server. Please try again later.');
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
          severity={error ? "error" : "success"} 
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