// the button shown at the bottom of each module page
// that allows user to mark them as complete or incomplete

// useMemo is used to memoise a value, recalculating it only when dependencies change
// such as when the progress data or module id changes, ensuring efficient updates
import { useState, useMemo } from 'react';

// material ui components
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  Divider
} from '@mui/material';

import {
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// get the user's progress data
import { useProgress } from '../../context/ProgressContext';

import { useTheme } from '@mui/material/styles';

const CompleteModuleButton = ({ moduleId, moduleName }) => {
  const { progressData, markModuleComplete } = useProgress(); // extract progress data and function to mark a module as complete from the ProgressContext
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // check if the module has been completed
  const isCompleted = useMemo(() => {
    if (!progressData) return false;
    const moduleProgress = progressData.find(p => (p.id || p.moduleId) === moduleId); // find the module progress data for the current module by its id
    return moduleProgress ? moduleProgress.completed : false; // return true if the module has been completed, otherwise return false
  }, [progressData, moduleId]);

  const handleCompleteModule = async () => {
    setLoading(true);
    const newCompletedStatus = !isCompleted; // toggle the completed status of the module, setting it to the opposite of its current state
    
    try {
      await markModuleComplete(moduleId, moduleName, newCompletedStatus);
      
      setSnackbarMessage(
        newCompletedStatus
          ? `${moduleName} marked as completed!`
          : `${moduleName} marked as incomplete.`
      );
      setSnackbarSeverity('success'); // make the snackbar green to indicate success
      setSnackbarOpen(true);

    } catch (err) {
      console.error('Error in CompleteModuleButton:', err);
      setSnackbarMessage(`Error updating ${moduleName}: ${err.message || 'Please try again.'}`);
      setSnackbarSeverity('error'); // make the snackbar red to indicate an error
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box sx={{ 
        mt: 8,
        pt: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <Divider sx={{ width: '100%', mb: 4 }} />
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
          Ready to track your progress?
        </Typography>
        <Button
          variant="contained"
          color={isCompleted ? "success" : "primary"}
          size="large"
          onClick={handleCompleteModule}
          disabled={loading}
          startIcon={isCompleted ? <CheckCircleIcon /> : null}
          sx={{
            py: 1.5, // vertical padding
            px: 4, // horizontal padding
            borderRadius: '8px',
            fontWeight: 600
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            isCompleted ? `${moduleName} Completed` : `Mark ${moduleName} as Completed`
          )}
        </Button>

        <Snackbar 
          open={snackbarOpen}
          autoHideDuration={5000} // display the snackbar for 5 seconds
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // position the snackbar at the bottom center of the screen
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default CompleteModuleButton;