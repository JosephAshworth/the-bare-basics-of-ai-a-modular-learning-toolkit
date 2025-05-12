import
  { 
    useState, // import useState, this is used to manage state in functional components
    useMemo // import useMemo, this is used to memoise a value, recalculating it only when dependencies change
  } from 'react';

import {
  Button, // import Button from MUI
  CircularProgress, // import CircularProgress from MUI
  Snackbar, // import Snackbar from MUI
  Alert, // import Alert from MUI
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  Divider // import Divider from MUI
} from '@mui/material';

import {
  CheckCircle as CheckCircleIcon // import CheckCircleIcon from MUI
} from '@mui/icons-material';

import { useProgress } from '../../context/ProgressContext'; // import useProgress, this is used to access the progress data from the ProgressContext

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const CompleteModuleButton = ({ moduleId, moduleName }) => { // define the CompleteModuleButton component, this is used to complete a module
  const { progressData, markModuleComplete } = useProgress(); // access the progress data from the ProgressContext
  const theme = useTheme(); // for getting the MUI theme object
  const [loading, setLoading] = useState(false); // state variable for loading, this is used to show a loading spinner when the module is being completed
  const [snackbarOpen, setSnackbarOpen] = useState(false); // state variable for snackbarOpen, this is used to show a snackbar when the module is being completed
  const [snackbarMessage, setSnackbarMessage] = useState(''); // state variable for snackbarMessage, this is used to show a message in the snackbar when the module is being completed
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // state variable for snackbarSeverity, this is used to set the severity of the snackbar when the module is being completed

  const isCompleted = useMemo(() => { // useMemo is used to memoise the module progress, which means that the module progress is only recalculated when the moduleId or progressData changes
    if (!progressData) return false; // if there is no progress data, return false
    const moduleProgress = progressData.find(p => (p.id || p.moduleId) === moduleId); // find the module progress in the progressData array
    return moduleProgress ? moduleProgress.completed : false; // return the completed status of the module
  }, [progressData, moduleId]); // the useMemo hook will only re-run when the progressData or moduleId changes

  const handleCompleteModule = async () => { // define the handleCompleteModule function, this is used to complete a module
    setLoading(true); // set the loading state to true
    const newCompletedStatus = !isCompleted; // set the newCompletedStatus to the opposite of the current completed status
    
    try {
      await markModuleComplete(moduleId, moduleName, newCompletedStatus); // call the markModuleComplete function, this is used to mark the module as completed
      
      setSnackbarMessage(
        newCompletedStatus
          ? `${moduleName} marked as completed!` // if the newCompletedStatus is true, set the snackbar message to the module name marked as completed
          : `${moduleName} marked as incomplete.` // if the newCompletedStatus is false, set the snackbar message to the module name marked as incomplete
      );
      setSnackbarSeverity('success'); // set the snackbar severity to success
      setSnackbarOpen(true); // set the snackbar open state to true

    } catch (err) { // catch any errors that occur when marking the module as completed
      console.error('Error in CompleteModuleButton:', err); // log the error to the console
      setSnackbarMessage(`Error updating ${moduleName}: ${err.message || 'Please try again.'}`); // set the snackbar message to the error message
      setSnackbarSeverity('error'); // set the snackbar severity to error
      setSnackbarOpen(true); // set the snackbar open state to true
    } finally {
      setLoading(false); // set the loading state to false
    }
  };

  const handleCloseSnackbar = () => { // define the handleCloseSnackbar function, this is used to close the snackbar
    setSnackbarOpen(false); // set the snackbar open state to false
  };

  return (
    <>
      <Box sx={{ 
        mt: 8, // set the margin top of the box to 8, this adds space above the box
        pt: 4, // set the padding top of the box to 4, this adds space inside the box
        display: 'flex', // set the display of the box to flex, this allows the box to be flexed
        justifyContent: 'center', // set the justify content of the box to centre, this centres the box
        alignItems: 'center', // set the align items of the box to centre, this centres the box
        flexDirection: 'column', // set the flex direction of the box to column, this stacks the box vertically
      }}>
        <Divider sx={{ width: '100%', mb: 4 }} /> {/* set the divider to the box, this adds a divider to the box */}
        <Typography
          variant="h5" // set the variant of the typography to h5, this is used to create a heading
          sx={{
            mb: 2, // set the margin bottom of the typography to 2, this adds space below the typography
            fontWeight: 600, // set the font weight of the typography to 600, this is used to create a heading with a large font weight
            color: theme.palette.text.primary // set the colour of the typography to the theme text primary, this is used to create a heading with a large colour
          }}>
          Ready to track your progress?
        </Typography>
        <Button
          variant="contained" // set the variant of the button to contained, this is used to create a button with a background colour
          color={isCompleted ? "success" : "primary"} // set the colour of the button to success if the module is completed and primary if the module is not completed
          size="large" // set the size of the button to large, this is used to create a large button
          onClick={handleCompleteModule} // set the onClick event of the button to the handleCompleteModule function
          disabled={loading} // set the disabled state of the button to true if the loading state is true
          startIcon={isCompleted ? <CheckCircleIcon /> : null} // set the startIcon of the button to the CheckCircleIcon if the module is completed and null if the module is not completed
          sx={{
            py: 1.5, // set the padding of the button to 1.5, this is used to create a button with a large padding
            px: 4, // set the padding of the button to 4, this is used to create a button with a large padding
            borderRadius: '8px', // set the border radius of the button to 8px, this is used to create a button with a large border radius
            fontWeight: 600 // set the font weight of the button to 600, this is used to create a button with a large font weight
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" /> // set the CircularProgress of the button to 24, this is used to create a button with a large CircularProgress
          ) : (
            isCompleted ? `${moduleName} Completed` : `Mark ${moduleName} as Completed` // set the text of the button to the module name completed if the module is completed and the module name marked as completed if the module is not completed
          )}
        </Button>

        <Snackbar 
          open={snackbarOpen} // set the snack bar to open when completed or incompleted
          autoHideDuration={5000} // set the autoHideDuration of the snack bar to 5000, this is used to create a snack bar that automatically closes after 5 seconds
          onClose={handleCloseSnackbar} // set the onClose event of the snack bar to the handleCloseSnackbar function
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // set the anchorOrigin of the snack bar to the bottom and centre
        >
          <Alert // set the Alert to the snackbarMessage
            onClose={handleCloseSnackbar} // set the onClose event of the Alert to the handleCloseSnackbar function
            severity={snackbarSeverity} // set the severity of the Alert to the snackbarSeverity, which is either success or error
            sx={{ width: '100%' }} // set the width of the Alert to 100%, this is used to create a button with a large width
          >
            {snackbarMessage} {/* set the text of the Alert to the snackbarMessage */}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default CompleteModuleButton; // export the CompleteModuleButton component as the default export, this is used to allow the component to be used in other files
