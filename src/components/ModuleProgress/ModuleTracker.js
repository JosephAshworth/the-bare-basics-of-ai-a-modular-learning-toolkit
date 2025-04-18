import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Link
} from '@mui/material';
import { CheckCircle, CheckCircleOutline, AccessTime, Refresh, ChevronRight } from '@mui/icons-material';
import apiService from '../../services/apiService';
import { Link as RouterLink } from 'react-router-dom';
import { auth, checkFirebaseConnection, firebaseInitialized } from '../../firebase';
import { useThemeContext } from '../../context/ThemeContext';

const ModuleTracker = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const { theme } = useThemeContext();
  const isDarkMode = theme === 'dark';

  // Function to fetch module progress via authenticated endpoint
  const fetchUserProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check Firebase connection first
      const isConnected = await checkFirebaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      if (!isConnected) {
        throw new Error('Firebase connection error');
      }
      
      // Check if user is authenticated
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      
      // Get the authentication token - with retry if needed
      let token;
      try {
        token = await currentUser.getIdToken(true); // Force refresh token
      } catch (tokenError) {
        console.error('Error getting token:', tokenError);
        // Wait a moment and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        token = await currentUser.getIdToken(true);
      }
      
      if (!token) {
        throw new Error('Failed to obtain authentication token');
      }
      
      console.log('Authentication token obtained successfully');
      
      // Request module progress from the server
      const response = await apiService.get('/api/modules/progress', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid server response format');
      }
      
      console.log('Modules progress data received:', response.data.length, 'modules');
      
      // Use the server data
      setModules(response.data);
    } catch (err) {
      console.error('Error fetching module progress:', err);
      setError(err.message || 'Could not connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    // Attempt to fetch modules progress
    fetchUserProgress();
    
    // Set up listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProgress();
      } else {
        setModules([]);
        setError('Please log in to view and track your progress.');
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [fetchUserProgress]);
  
  const getCompletedCount = () => {
    return modules.filter(module => module.completed).length;
  };
  
  const getCompletionPercentage = () => {
    if (!modules.length) return 0;
    return Math.round((getCompletedCount() / modules.length) * 100);
  };

  // Format time spent in human-readable format
  const formatTimeSpent = (seconds) => {
    if (!seconds || seconds <= 0) {
      return 'No time recorded';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getTotalTimeSpent = () => {
    if (!modules || modules.length === 0) return 0;
    return modules.reduce((total, module) => total + (module.timeSpent || 0), 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 3, 
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderRadius: 2,
      boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#333' }}>
          Your Module Progress
        </Typography>
        <Button 
          startIcon={<Refresh />} 
          size="small" 
          onClick={fetchUserProgress}
          sx={{ color: isDarkMode ? '#90caf9' : '#1976d2' }}
        >
          Refresh
        </Button>
      </Box>
      
      {error && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchUserProgress}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      
      {/* Connection status indicator */}
      {connectionStatus === 'disconnected' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Database connection issue. Please check your network connection.
        </Alert>
      )}
      
      {modules.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, color: isDarkMode ? '#e0e0e0' : '#555' }}>
            No module progress found
          </Typography>
          <Button 
            variant="contained" 
            onClick={fetchUserProgress}
            sx={{ 
              backgroundColor: isDarkMode ? '#90caf9' : '#1976d2',
              '&:hover': {
                backgroundColor: isDarkMode ? '#82b1ff' : '#1565c0',
              }
            }}
          >
            Search for Modules
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
              <CircularProgress 
                variant="determinate" 
                value={getCompletionPercentage()} 
                size={60} 
                thickness={4}
                sx={{ color: isDarkMode ? '#90caf9' : '#1976d2' }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  {`${getCompletionPercentage()}%`}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: isDarkMode ? '#e0e0e0' : '#555' }}>
                You've completed {getCompletedCount()} out of {modules.length} modules
              </Typography>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#aaa' : '#777', display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                Total time spent: {formatTimeSpent(getTotalTimeSpent())}
              </Typography>
            </Box>
          </Box>
          
          <List sx={{ p: 0 }}>
            {modules.filter(module => module.id !== 'welcome').map((module) => (
              <ListItem 
                key={module.id}
                component={RouterLink}
                to={module.path}
                sx={{ 
                  px: 1, 
                  py: 0.5,
                  textDecoration: 'none',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '4px'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {module.completed ? (
                    <CheckCircle sx={{ color: isDarkMode ? '#90caf9' : '#1976d2' }} />
                  ) : (
                    <CheckCircleOutline sx={{ color: isDarkMode ? '#666' : '#aaa' }} />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={module.name}
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: isDarkMode ? '#aaa' : '#777' 
                      }}
                    >
                      <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                      {module.timeSpent ? formatTimeSpent(module.timeSpent) : 'No time recorded'}
                    </Typography>
                  }
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      color: module.completed 
                        ? (isDarkMode ? '#90caf9' : '#1976d2') 
                        : (isDarkMode ? '#e0e0e0' : '#555'),
                      textDecoration: module.completed ? 'line-through' : 'none',
                      fontWeight: module.completed ? 400 : 500,
                    }
                  }}
                />
                <ChevronRight sx={{ color: isDarkMode ? '#666' : '#aaa', ml: 1 }} />
              </ListItem>
            ))}
          </List>
        </>
      )}
      
      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary', textAlign: 'center' }}>
        To mark modules as complete, use the buttons at the end of each module page.
      </Typography>
    </Paper>
  );
};

export default ModuleTracker; 