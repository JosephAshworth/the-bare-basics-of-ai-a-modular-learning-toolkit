// the profile page that displays the user's progress and allows them to reset it

import
  { 
    useState, 
    useEffect, 
    useMemo 
  }
from 'react';

// context for the authentication
import { useAuth } from '../context/AuthContext'; 

// context for the progress
import { useProgress } from '../context/ProgressContext'; 

// material ui components
import {
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  CircularProgress, 
  Alert, 
  Divider, 
  Tooltip, 
  Button 
} from '@mui/material';

// material ui icons
import { 
  Person, 
  CheckCircle, 
  RadioButtonUnchecked, 
  HelpOutline, 
  ErrorOutline, 
  AccessTime, 
  Refresh 
} from '@mui/icons-material';

// material ui theme
import { useTheme } from '@mui/material/styles'; 

// format the elapsed time
const formatElapsedTime = (seconds) => { 
  if (seconds === null || seconds === undefined || seconds < 0) { 
    return '-'; 
  }
  const totalSeconds = Math.round(seconds); // round the seconds to the nearest integer
  const hours = Math.floor(totalSeconds / 3600); // calculate the hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // calculate the minutes
  const secs = totalSeconds % 60; // calculate the seconds
  
  let parts = []; // initialise an empty array to store the parts of the time
  if (hours > 0) parts.push(`${hours}h`); // if the hours are greater than 0, add the hours to the parts
  if (minutes > 0) parts.push(`${minutes}m`); // if the minutes are greater than 0, add the minutes to the parts
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`); // if the seconds are greater than 0 or the parts array is empty, add the seconds to the parts
  
  return parts.join(' '); // join the parts with a space
};

function ProfilePage() {
  const { currentUser } = useAuth(); // get the current user
  const theme = useTheme(); 

  const {
    progressData, 
    isLoading: isProgressLoading, 
    error: progressError,
    resetAllModuleTimes, 
  } = useProgress(); // get the progress data, loading state, error and reset all module times

  const [availableModules, setAvailableModules] = useState([]); 
  const [isModulesLoading, setIsModulesLoading] = useState(true); 
  const [modulesError, setModulesError] = useState(null); 

  const [isResetting, setIsResetting] = useState(false); 
  const [resetError, setResetError] = useState(null); 

  // fetch the available modules
  useEffect(() => {
    const fetchModules = async () => {
      setIsModulesLoading(true); 
      setModulesError(null); 
      setAvailableModules([]); 
      try { 

        // asynchronously import the default export from the API service module for API requests
        // this will hold the default export once the module is successfully loaded
        const apiService = (await import('../services/APIService')).default; 
        const response = await apiService.get('/api/modules'); 
        setAvailableModules(response.data || []); 
        console.log('Available Modules Fetched:', response.data); 
      } catch (err) { 
        console.error('Failed to fetch available modules:', err); 
        setModulesError('Failed to load the list of available modules.'); 
      } finally {
        setIsModulesLoading(false); 
      }
    };
    fetchModules(); 
  }, []);

  // create a map of the progress data
  const progressMap = useMemo(() => {
    if (!progressData) return new Map(); 
    return new Map(progressData.map(p => [p.id || p.moduleId, p])); 
  }, [progressData]);


  const handleResetTimes = async () => {
    setIsResetting(true); 
    setResetError(null); 
    try {
      await resetAllModuleTimes(); 
    } catch (error) {
      console.error("ProfilePage: Reset failed", error); 
      setResetError(progressError || 'An unexpected error occurred during reset.'); 
    } finally {
      setIsResetting(false); 
    }
  };

  // if the current user is not logged in, return a message
  if (!currentUser) { 
    return <Typography>Please log in to view your profile.</Typography>; 
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      bgcolor: theme.palette.background.default 
    }}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            backgroundColor: theme.palette.background.paper, 
            color: theme.palette.text.primary 
          }}
        >
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mb: 2 
            }}
            src={currentUser.photoURL} // if the user has a photo URL use it
          >
            {/* if the user has no photo URL use the default avatar (usually their initials) */}
            {!currentUser.photoURL && (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <Person sx={{ fontSize: 40 }}/>)} 
          </Avatar>
          
          <Typography variant="h4" gutterBottom> 
            Profile
          </Typography>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}> 
            <Typography variant="h6"> 
              Display Name: {currentUser.displayName || 'Not Set'} 
            </Typography>
            <Typography variant="body1" color="text.secondary"> 
              Email: {currentUser.email} 
            </Typography>
          </Box>

          <Divider sx={{ my: 3, width: '80%' }} /> 

          <Box
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', // distribute space evenly between items, pushing them to the edges of the container
              alignItems: 'center', 
              width: '100%', 
              maxWidth: 450, 
              mb: 2 
            }}>
              <Typography variant="h5" component="h2"> 
                Module Progress
              </Typography>
              <Tooltip title="Reset all time spent on modules to zero."> 
                    <span>
                      <Button 
                          variant="outlined" 
                          color="warning" 
                          size="small" 
                          startIcon={<Refresh />} 
                          onClick={handleResetTimes} 
                          disabled={isResetting || isProgressLoading} 
                      >
                          {isResetting ? 'Resetting...' : 'Reset Times'} 
                      </Button>
                    </span>
              </Tooltip>
          </Box>
          
          {/* if there is a reset error, display an error message */}
          {resetError && ( 
              <Alert severity="error" sx={{ mt: 1, mb: 2, width: '100%', maxWidth: 450 }}>{resetError}</Alert> 
          )}

          {/* if the progress is loading, display a loading message */}
          {isProgressLoading && !isResetting && ( 
            <Box
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1, 
                width: '100%', 
                maxWidth: 450 
              }}>
                <CircularProgress size={20} sx={{ mr: 1 }} /> 
                <Typography variant="body2">Loading progress...</Typography> 
            </Box>
          )}

          {/* if there is a progress error, display an error message */}
          {progressError && !isResetting && ( 
            <Alert severity="error" sx={{ mt: 1, mb: 2, width: '100%', maxWidth: 450 }}>{progressError}</Alert> 
          )}

          {/* if the modules are not loading and there is no error, display the modules */}
          {!isModulesLoading && !modulesError && ( 
            <List sx={{ width: '100%', maxWidth: 450, borderRadius: '4px' }}> 
              {availableModules.map((module) => { 
                const currentProgress = progressMap.get(module.id); // get the current progress for the module
                const timeSpent = currentProgress ? currentProgress.timeSpent : null; // get the time spent on the module
                
                let statusIcon = null; 
                let statusText = "Unknown"; 
                let statusColor = theme.palette.text.disabled; 

                if (isProgressLoading && !isResetting) { // if the progress is loading and the reset is not happening
                  statusIcon = <CircularProgress size={20} thickness={5} color="inherit" />; // display a circular progress indicator
                  statusText = "Loading..."; // display a loading message
                } else if (progressError && !isResetting) { // if there is a progress error and the reset is not happening
                  statusIcon = <ErrorOutline color="error" />;
                  statusText = "Error"; 
                  statusColor = 'error.main'; 
                } else if (currentProgress) { // if there is current progress
                  if (currentProgress.completed) { // if the module is completed
                    statusIcon = <CheckCircle color="success" />; 
                    statusText = "Completed"; 
                    statusColor = 'success.main';
                  } else { 
                    statusIcon = <RadioButtonUnchecked color="action" />; 
                    statusText = "Not Completed"; 
                  }
                } else { 
                  statusIcon = <HelpOutline color="disabled" />; 
                  statusText = "Not Started"; 
                }
                
                // display the status and time spent on each module
                const secondaryInfo = ( 
                    <Box
                      sx={{
                        display: 'flex', 
                        alignItems: 'center', 
                        color: statusColor 
                      }}>
                        <Typography
                          variant="caption" 
                          component="span" 
                          sx={{ color: 'inherit' }}> 
                            Status: {statusText} 
                        </Typography>
                        <Divider
                          orientation="vertical" 
                          flexItem 
                          sx={{
                            mx: 1, 
                            my: 0.5, 
                            borderColor: 'inherit', 
                            opacity: 0.5 
                          }}>
                        </Divider>
                        <AccessTime
                          sx={{
                            fontSize: '0.9rem', 
                            mr: 0.5
                          }}>
                        </AccessTime> 
                        <Typography
                          variant="caption" 
                          component="span" 
                          sx={{ color: 'inherit' }}> 
                            Time: {formatElapsedTime(timeSpent)} 
                        </Typography>
                    </Box>
                );

                // display the module name and status, as well as the secondary info (status and time spent)
                return (
                  <ListItem key={module.id} sx={{ pt: 1, pb: 1 }}> 
                    <ListItemIcon sx={{ minWidth: 40 }}> 
                      {statusIcon} 
                    </ListItemIcon>
                    <ListItemText 
                      primary={module.name} 
                      secondary={secondaryInfo} 
                    /> 
                  </ListItem>
                );
              })}
              {/* if there are no modules, display a message */}
              {availableModules.length === 0 && (
                <ListItem> 
                  <ListItemText primary="No modules available." /> 
                </ListItem>
              )}
            </List>
          )}

        </Paper>
      </Container>
    </Box> 
  );
}

export default ProfilePage; 