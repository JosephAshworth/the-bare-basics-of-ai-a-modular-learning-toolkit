import
  { 
    useState, // import useState, this is used to manage the state of the component
    useEffect, // import useEffect, this is used to manage the side effects of the component
    useMemo // import useMemo, this is used to memoise a value, recalculating it only when dependencies change
  }
from 'react';

import { useAuth } from '../context/AuthContext'; // import useAuth, this is used to access the auth context, which is used to track the user's authentication status

import { useProgress } from '../context/ProgressContext'; // import useProgress, this is used to access the progress context, which is used to track the user's progress

import {
  Container, // import Container from MUI
  Typography, // import Typography from MUI
  Paper, // import Paper from MUI
  Box, // import Box from MUI
  Avatar, // import Avatar from MUI
  List, // import List from MUI
  ListItem, // import ListItem from MUI
  ListItemText, // import ListItemText from MUI
  ListItemIcon, // import ListItemIcon from MUI
  CircularProgress, // import CircularProgress from MUI
  Alert, // import Alert from MUI
  Divider, // import Divider from MUI
  Tooltip, // import Tooltip from MUI
  Button // import Button from MUI
} from '@mui/material';

import { 
  Person, // import Person from MUI
  CheckCircle, // import CheckCircle from MUI
  RadioButtonUnchecked, // import RadioButtonUnchecked from MUI
  HelpOutline, // import HelpOutline from MUI
  ErrorOutline, // import ErrorOutline from MUI
  AccessTime, // import AccessTime from MUI
  Refresh // import Refresh from MUI
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

const formatElapsedTime = (seconds) => { // define the formatElapsedTime function, this is used to format the elapsed time
  if (seconds === null || seconds === undefined || seconds < 0) { // if the seconds are null, undefined, or less than 0
    return '-'; // return '-'
  }
  const totalSeconds = Math.round(seconds); // round the seconds to the nearest integer
  const hours = Math.floor(totalSeconds / 3600); // calculate the hours
  const minutes = Math.floor((totalSeconds % 3600) / 60); // calculate the minutes
  const secs = totalSeconds % 60; // calculate the seconds
  
  let parts = []; // create an empty array to store the parts of the elapsed time
  if (hours > 0) parts.push(`${hours}h`); // if the hours are greater than 0, add the hours to the parts array
  if (minutes > 0) parts.push(`${minutes}m`); // if the minutes are greater than 0, add the minutes to the parts array
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`); // if the seconds are greater than 0, or the parts array is empty, add the seconds to the parts array
  
  return parts.join(' '); // join the parts array into a string
};

function ProfilePage() {
  const { currentUser } = useAuth(); // access the current user from the auth context
  const theme = useTheme(); // for getting the MUI theme object

  const {
    progressData, // get the progress data from the progress context
    isLoading: isProgressLoading, // get the loading status from the progress context
    error: progressError, // get the error from the progress context
    fetchProgress, // get the fetchProgress function from the progress context
    resetAllModuleTimes, // get the resetAllModuleTimes function from the progress context
  } = useProgress(); // destructure the progress data from the progress context

  const [availableModules, setAvailableModules] = useState([]); // state variable to store the available modules
  const [isModulesLoading, setIsModulesLoading] = useState(true); // state variable to store the loading status
  const [modulesError, setModulesError] = useState(null); // state variable to store the error

  const [isResetting, setIsResetting] = useState(false); // state variable to store the resetting status
  const [resetError, setResetError] = useState(null); // state variable to store the error

  useEffect(() => {

    const fetchModules = async () => {
      setIsModulesLoading(true); // set the loading status to true
      setModulesError(null); // set the error to null
      setAvailableModules([]); // set the available modules to an empty array
      try { 
        const apiService = (await import('../services/apiService')).default; // import the apiService from the apiService file
        const response = await apiService.get('/api/modules'); // fetch the modules from the api
        setAvailableModules(response.data || []); // set the available modules to the response data
        console.log('Available Modules Fetched:', response.data); // log the available modules
      } catch (err) { // catch any errors
        console.error('Failed to fetch available modules:', err); // log the error
        setModulesError('Failed to load the list of available modules.'); // set the error to the error message
      } finally {
        setIsModulesLoading(false); // set the loading status to false
      }
    };
    fetchModules(); // fetch the modules
  }, []);

  useEffect(() => {
      fetchProgress(); // fetch the progress
  }, [fetchProgress]);

  useEffect(() => {
      const timerId = setTimeout(() => {
        fetchProgress(); // fetch the progress
      }, 1200); // delay the fetchProgress function by 1200 milliseconds

      return () => clearTimeout(timerId); // return a cleanup function to clear the timeout
  }, [fetchProgress]);

  useEffect(() => {
      console.log("ProfilePage Effect: progressData updated:", progressData); // log the progress data
  }, [progressData]);

  const progressMap = useMemo(() => {
    if (!progressData) return new Map(); // if the progress data is not available, return a new Map
    return new Map(progressData.map(p => [p.id || p.moduleId, p])); // return a new Map with the progress data
  }, [progressData]);

  const handleResetTimes = async () => {
    setIsResetting(true); // set the resetting status to true
    setResetError(null); // set the error to null
    try {
      await resetAllModuleTimes(); // reset the all module times
    } catch (error) {
      console.error("ProfilePage: Reset failed", error); // log the error
      setResetError(progressError || 'An unexpected error occurred during reset.'); // set the error to the error message
    } finally {
      setIsResetting(false); // set the resetting status to false
    }
  };

  if (!currentUser) { // if the user is not logged in
    return <Typography>Please log in to view your profile.</Typography>; // return a Typography component with the message
  }

  return (
    <Box sx={{ 
      display: 'flex', // display the box as a flex container
      flexDirection: 'column', // display the box as a column
      minHeight: '100vh', // set the minimum height of the box to 100vh, so the page takes up the full height of the screen
      bgcolor: theme.palette.background.default // set the background color of the box to the default background color based on the theme
    }}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}> {/* sets the container to have a maximum width of md, and a margin top and bottom of 4 */}
        <Paper 
          elevation={3} // sets the elevation of the paper to 3, which is a shadow effect
          sx={{ 
            p: 4, // sets the padding of the paper to 4, which is a small amount of padding
            display: 'flex', // display the paper as a flex container
            flexDirection: 'column', // display the paper as a column
            alignItems: 'center', // align the items of the paper to the center
            backgroundColor: theme.palette.background.paper, // set the background color of the paper to the paper background color based on the theme
            color: theme.palette.text.primary // set the text color of the paper to the primary text color based on the theme
          }}
        >
          <Avatar 
            sx={{ 
              width: 80, // sets the width of the avatar to 80
              height: 80, // sets the height of the avatar to 80
              mb: 2 // sets the margin bottom of the avatar to 2
            }}
            src={currentUser.photoURL} // sets the source of the avatar to the photo URL of the current user
          >
            {!currentUser.photoURL && (currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <Person sx={{ fontSize: 40 }}/>)} {/* if the user does not have a photo URL, display the first letter of the display name, or the person icon */}
          </Avatar>
          
          <Typography variant="h4" component="h1" gutterBottom> {/* sets the typography to have a variant of h4, a component of h1, and a gutter bottom */}
            Profile
          </Typography>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}> {/* sets the box to have a margin top of 2, and a text alignment of center */}
            <Typography variant="h6"> {/* sets the typography to have a variant of h6 */}
              Display Name: {currentUser.displayName || 'Not Set'} {/* if the user does not have a display name, display 'Not Set' */}
            </Typography>
            <Typography variant="body1" color="text.secondary"> {/* sets the typography to have a variant of body1, and a color of text.secondary */}
              Email: {currentUser.email} {/* display the email of the current user */}
            </Typography>
          </Box>

          <Divider sx={{ my: 3, width: '80%' }} /> {/* sets the divider to have a margin top and bottom of 3, and a width of 80% */}

          <Box
            sx={{ 
              display: 'flex', // display the box as a flex container
              justifyContent: 'space-between', // justify the content to the space between, distributing the space evenly between the items
              alignItems: 'center', // align the items to the center
              width: '100%', // set the width of the box to 100%, making it full width
              maxWidth: 450, // set the maximum width of the box to 450
              mb: 2 // set the margin bottom of the box to 2, adding space below the box
            }}>
              <Typography variant="h5" component="h2"> {/* sets the typography to have a variant of h5, and a component of h2 */}
                Module Progress
              </Typography>
              <Tooltip title="Reset all time spent on modules to zero."> {/* sets the tooltip to have a title of 'Reset all time spent on modules to zero.' */}
                    <span>
                      <Button 
                          variant="outlined" // sets the variant of the button to outlined, creating a button with a border
                          color="warning" // sets the color of the button to warning, creating a button with a warning colour
                          size="small" // sets the size of the button to small, creating a button with a small size
                          startIcon={<Refresh />} // sets the start icon of the button to the refresh icon, creating a button with a refresh icon
                          onClick={handleResetTimes} // sets the onClick event of the button to the handleResetTimes function, creating a button that resets the times
                          disabled={isResetting || isProgressLoading} // sets the disabled state of the button to the isResetting or isProgressLoading state, creating a button that is disabled when the resetting or progress loading is true
                      >
                          {isResetting ? 'Resetting...' : 'Reset Times'} {/* if the resetting is true, display 'Resetting...', otherwise display 'Reset Times' */}
                      </Button>
                    </span>
              </Tooltip>
          </Box>
          
          {resetError && ( // if the reset error is true
              <Alert severity="error" sx={{ mt: 1, mb: 2, width: '100%', maxWidth: 450 }}>{resetError}</Alert> // display the reset error
          )}

          {isProgressLoading && !isResetting && ( // if the progress loading is true and the resetting is false
            <Box
              sx={{ 
                display: 'flex', // display the box as a flex container
                alignItems: 'center', // align the items to the center
                mb: 1, // add a margin bottom of 1
                width: '100%', // set the width of the box to 100%
                maxWidth: 450 // set the maximum width of the box to 450 pixels
              }}>
                <CircularProgress size={20} sx={{ mr: 1 }} /> {/* display the circular progress, setting the size to 20 and adding a margin right of 1 */}
                <Typography variant="body2">Loading progress...</Typography> {/* display the typography with a variant of body2 */}
            </Box>
          )}
          {progressError && !isResetting && ( // if the progress error is true and the resetting is false
            <Alert severity="error" sx={{ mt: 1, mb: 2, width: '100%', maxWidth: 450 }}>{progressError}</Alert> // display the alert with a severity of error, setting the margin top, bottom, width and maximum width
          )}


          {!isModulesLoading && !modulesError && ( // if the modules loading is false and the modules error is false
            <List sx={{ width: '100%', maxWidth: 450, borderRadius: '4px' }}> {/* display the list with a width of 100%, a maximum width of 450 pixels and a border radius of 4 */}
              {availableModules.map((module) => { // map over the available modules
                const currentProgress = progressMap.get(module.id); // get the current progress from the progress map
                const timeSpent = currentProgress ? currentProgress.timeSpent : null; // if the current progress is not null, set the time spent to the current progress time spent, otherwise set the time spent to null
                
                let statusIcon = null; // set the status icon to null
                let statusText = "Unknown"; // set the status text to unknown
                let statusColor = theme.palette.text.disabled; // set the status color to the disabled text color, currently the same as the text color

                if (isProgressLoading && !isResetting) { // if the progress loading is true and the resetting is false
                  statusIcon = <CircularProgress size={20} thickness={5} color="inherit" />; // set the status icon to the circular progress, setting the size to 20 and the thickness to 5
                  statusText = "Loading..."; // set the status text to loading
                } else if (progressError && !isResetting) { // if the progress error is true and the resetting is false
                  statusIcon = <ErrorOutline color="error" />; // set the status icon to the error outline, creating a button with a warning colour, which is orange
                  statusText = "Error"; // set the status text to error
                  statusColor = 'error.main'; // set the status color to the error main color, which is red
                } else if (currentProgress) { // if the current progress is not null
                  if (currentProgress.completed) { // if the current progress is completed
                    statusIcon = <CheckCircle color="success" />; // set the status icon to the check circle, creating a button with a success colour
                    statusText = "Completed"; // set the status text to completed
                    statusColor = 'success.main'; // set the status color to the success main color, which is green
                  } else { // otherwise
                    statusIcon = <RadioButtonUnchecked color="action" />; // set the status icon to the radio button unchecked, creating a button with a action colour
                    statusText = "Not Completed"; // set the status text to not completed
                  }
                } else { // otherwise
                  statusIcon = <HelpOutline color="disabled" />; // set the status icon to the help outline, creating a button with a disabled colour, currently the same as the text color
                  statusText = "Not Started"; // set the status text to not started
                }
                
                const secondaryInfo = ( // set the secondary info to the box component, displaying the status text, time spent and status color
                    <Box
                      sx={{
                        display: 'flex', // display the box as a flex container
                        alignItems: 'center', // align the items to the center
                        fontSize: '0.8rem', // set the font size to 0.8rem
                        color: statusColor // set the color to the status color
                      }}>
                        <Typography
                          variant="caption" // set the variant to caption
                          component="span" // set the component to span
                          sx={{ color: 'inherit' }}> {/* set the color to inherit, currently the same as the text color in the parent component */}
                            Status: {statusText} {/* display the status text */}
                        </Typography>
                        <Divider
                          orientation="vertical" // set the orientation to vertical
                          flexItem // set the flex item to true
                          sx={{
                            mx: 1, // set the horizontal margin to 1
                            my: 0.5, // set the vertical margin to 0.5
                            borderColor: 'inherit', // set the border color to inherit, the same as the parent component colour
                            opacity: 0.5 // set the opacity to 0.5
                          }}>
                        </Divider>
                        <AccessTime
                          sx={{
                            fontSize: '0.9rem', // set the font size to 0.9rem
                            mr: 0.5, // set the margin right to 0.5
                            verticalAlign: 'middle' // set the vertical align to middle
                          }}>
                        </AccessTime> 
                        <Typography
                          variant="caption" // set the variant to caption
                          component="span" // set the component to span
                          sx={{ color: 'inherit' }}> {/* set the color to inherit, currently the same as the text color in the parent component */}
                            Time: {formatElapsedTime(timeSpent)} {/* display the time spent */}
                        </Typography>
                    </Box>
                );

                return (
                  <ListItem key={module.id} sx={{ pt: 1, pb: 1 }}> {/* set the list item to have a padding top and bottom of 1 */}
                    <ListItemIcon sx={{ minWidth: 40 }}> {/* set the list item icon to have a minimum width of 40 */}
                      {statusIcon} {/* display the status icon */}
                    </ListItemIcon>
                    <ListItemText 
                      primary={module.name} // display the module name
                      secondary={secondaryInfo} // display the secondary info, which is the status text, time spent and status color
                    /> 
                  </ListItem>
                );
              })}
              {availableModules.length === 0 && (
                <ListItem> {/* set the list item to have a padding top and bottom of 1 */}
                  <ListItemText primary="No modules available." /> {/* display the list item text with a primary text of 'No modules available.' */}
                </ListItem>
              )}
            </List>
          )}

        </Paper>
      </Container>
    </Box> 
  );
}

export default ProfilePage; // export the ProfilePage component as the default export, this allows the component to be used in other files
