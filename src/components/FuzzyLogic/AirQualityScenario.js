import
  { useState } // import useState, this is used to manage state in functional components
from 'react';

import {
  Box, // import Box from MUI 
  Typography, // import Typography from MUI
  Slider, // import Slider from MUI
  Button, // import Button from MUI
  Paper, // import Paper from MUI
  Dialog, // import Dialog from MUI
  IconButton, // import IconButton from MUI
  DialogTitle, // import DialogTitle from MUI
  DialogContent, // import DialogContent from MUI
  DialogContentText, // import DialogContentText from MUI
  DialogActions, // import DialogActions from MUI
} from '@mui/material';

import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material'; // import HelpOutlineIcon from MUI

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import apiService from '../../services/apiService'; // import apiService, this is used to make API requests to the backend

const AirQualityScenario = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // for checking if the theme is dark mode
  const [loading, setLoading] = useState(false); // state variable to store the loading state
  const [co2, setCo2] = useState(800); // state variable to store the CO2 value
  const [pm25, setPm25] = useState(20); // state variable to store the PM2.5 value
  const [airQualityResult, setAirQualityResult] = useState(''); // state variable to store the air quality result
  const [error, setError] = useState(null); // state variable to store the error
  
  const [isCo2InfoOpen, setCo2InfoOpen] = useState(false); // state variable to store the CO2 info open state
  const [isPm25InfoOpen, setPm25InfoOpen] = useState(false); // state variable to store the PM2.5 info open state

  const handleOpenCo2Info = () => setCo2InfoOpen(true); // for opening the CO2 info dialog
  const handleCloseCo2Info = () => setCo2InfoOpen(false); // for closing the CO2 info dialog

  const handleOpenPm25Info = () => setPm25InfoOpen(true); // for opening the PM2.5 info dialog
  const handleClosePm25Info = () => setPm25InfoOpen(false); // for closing the PM2.5 info dialog

  const handleCo2Change = (event, newValue) => {
    setCo2(newValue); // for setting the CO2 value
  };

  const handlePm25Change = (event, newValue) => {
    setPm25(newValue); // for setting the PM2.5 value
  };

  const calculateAirQuality = async () => {
    try {
      setLoading(true); // for setting the loading state to true
      setError(null); // for setting the error state to null
      
      try { // try to calculate the air quality
        console.log('Attempting to calculate air quality with /api prefix...'); // log the message
        const response = await apiService.post('/api/fuzzy-logic/air-quality', { // send the request to the backend
          co2, // for sending the CO2 value to the backend
          pm25 // for sending the PM2.5 value to the backend
        });
        setAirQualityResult(response.data.result); // for setting the air quality result
      } catch (apiError) { // if the first attempt fails
        console.log('Retrying without /api prefix...', apiError); // log the message
        
        const response = await apiService.post('/fuzzy-logic/air-quality', { // send the request to the backend, without the /api prefix
          co2, // for sending the CO2 value to the backend
          pm25 // for sending the PM2.5 value to the backend
        });
        setAirQualityResult(response.data.result); // for setting the air quality result
      }
    } catch (error) { // if an error occurs
      console.error('Error calculating air quality result:', error); // log the message
      setError('Could not connect to the backend service. Please try again later.'); // set the error message
      setAirQualityResult(''); // set the air quality result to an empty string
    } finally {
      setLoading(false); // for setting the loading state to false
    }
  };

  return (
    <Box>
      <Typography
        variant="h6" // set the variant of the typography to h6, this is used to create a heading
        sx={{
          mb: 3, // set the margin bottom of the typography to 3
          color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
        }}
      >
        Adjust the CO2 and PM2.5 values to determine air quality
      </Typography>

      <Box sx={{ mb: 4 }}> 
        <Typography id="co2-slider" // set the id of the typography to co2-slider
          gutterBottom // set the gutter bottom of the typography to true
        >
          CO2 Level: {co2} ppm
          <IconButton
            size="small" // set the size of the icon button to small
            sx={{ ml: 0.5 }} // set the margin left of the icon button to 0.5
            onClick={handleOpenCo2Info} // set the onClick of the icon button to the handleOpenCo2Info function
            aria-label="CO2 Information" // set the aria-label of the icon button to CO2 Information
          >
            <HelpOutlineIcon fontSize="inherit" /> {/* set the font size of the icon to inherit, this is used to inherit the font size of the icon */}
          </IconButton>
        </Typography>
        <Slider
          value={co2} // set the value of the slider to the co2 value
          onChange={handleCo2Change} // set the onChange of the slider to the handleCo2Change function
          aria-labelledby="co2-slider" // set the aria-labelledby of the slider to co2-slider
          valueLabelDisplay="auto" // set the value label display of the slider to auto
          step={10} // set the step of the slider to 10
          marks // set the marks of the slider to true
          min={300} // set the min of the slider to 300
          max={2000} // set the max of the slider to 2000
          sx={{ color: theme.palette.primary.main }} // set the colour of the slider to the primary colour of the theme
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{ 
              display: 'inline-block', // set the display of the typography to inline-block, this allows the typography to be displayed inline with the slider
              width: '33%', // set the width of the typography to 33%
              textAlign: 'left', // set the text align of the typography to left
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}>Good</Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{ 
              display: 'inline-block', // set the display of the typography to inline-block, this allows the typography to be displayed inline with the slider
              width: '34%', // set the width of the typography to 34%
              textAlign: 'center', // set the text align of the typography to centre
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}>Moderate</Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{ 
              display: 'inline-block', // set the display of the typography to inline-block, this allows the typography to be displayed inline with the slider
              width: '33%', // set the width of the typography to 33%
              textAlign: 'right', // set the text align of the typography to right
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}>Poor</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography id="pm25-slider" // set the id of the typography to pm25-slider
          gutterBottom // set the gutter bottom of the typography to true
        >
          PM2.5 Level: {pm25} μg/m³
          <IconButton
            size="small" // set the size of the icon button to small
            sx={{ ml: 0.5 }} // set the margin left of the icon button to 0.5
            onClick={handleOpenPm25Info} // set the onClick of the icon button to the handleOpenPm25Info function
            aria-label="PM2.5 Information" // set the aria-label of the icon button to PM2.5 Information
          >
            <HelpOutlineIcon fontSize="inherit" /> {/* set the font size of the icon to inherit, this is used to inherit the font size of the icon */}
          </IconButton>
        </Typography>
        <Slider
          value={pm25} // set the value of the slider to the pm25 value
          onChange={handlePm25Change} // set the onChange of the slider to the handlePm25Change function
          aria-labelledby="pm25-slider" // set the aria-labelledby of the slider to pm25-slider
          valueLabelDisplay="auto" // set the value label display of the slider to auto
          step={1} // set the step of the slider to 1
          marks // set the marks of the slider to true
          min={0} // set the min of the slider to 0
          max={100} // set the max of the slider to 100
          sx={{ color: theme.palette.primary.main }} // set the colour of the slider to the primary colour of the theme
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              display: 'inline-block', // set the display of the typography to inline-block, this allows the typography to be displayed inline with the slider
              width: '33%', // set the width of the typography to 33%
              textAlign: 'left', // set the text align of the typography to left
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}>Low</Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              display: 'inline-block', // set the display of the typography to inline-block, this allows the typography to be displayed inline with the slider
              width: '34%', // set the width of the typography to 34%
              textAlign: 'center', // set the text align of the typography to centre
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}>Medium</Typography>
          <Typography variant="body2" // set the variant of the typography to body2
            sx={{ 
              display: 'inline-block', // set the display of the typography to inline-block, this allows the typography to be displayed inline with the slider
              width: '33%', // set the width of the typography to 33%
              textAlign: 'right', // set the text align of the typography to right
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}>High</Typography>
        </Box>
      </Box>

      {error && ( // if the error is found
        <Paper 
          sx={{ 
            p: 2, // set the padding of the paper to 2
            mb: 3, // set the margin bottom of the paper to 3
            borderRadius: '8px', // set the border radius of the paper to 8px
            backgroundColor: theme.palette.error.light, // set the background colour of the paper to the error light colour of the theme
            border: `1px solid ${theme.palette.error.main}`, // set the border of the paper to the error main colour of the theme
            color: theme.palette.error.contrastText // set the colour of the paper to the error contrast text colour of the theme
          }}
        >
          <Typography color="inherit">
            {error} {/* set the error to the error message */}
          </Typography>
        </Paper>
      )}

      <Button 
        variant="contained" // set the variant of the button to contained
        onClick={calculateAirQuality} // set the onClick of the button to the calculateAirQuality function
        disabled={loading} // set the disabled of the button to the loading state
      >
        {loading ? 'Processing...' : 'Calculate Air Quality'} {/* set the text of the button to Processing... if the loading state is true, otherwise set the text of the button to Calculate Air Quality */}
      </Button>

      <Dialog
        open={isCo2InfoOpen} // set the open of the dialog to the isCo2InfoOpen state
        onClose={handleCloseCo2Info} // set the onClose of the dialog to the handleCloseCo2Info function
        aria-labelledby="co2-info-dialog-title" // set the aria-labelledby of the dialog to co2-info-dialog-title
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the PaperProps of the dialog to the background paper of the theme
      >
        <DialogTitle id="co2-info-dialog-title" sx={{ color: 'text.primary' }}>CO2 Level Information</DialogTitle> {/* set the DialogTitle of the dialog to CO2 Level Information */}
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}> {/* set the DialogContentText of the dialog to the secondary colour of the theme */}
            Carbon Dioxide (CO2) level in parts per million (ppm). Indoor levels are typically 400-1000 ppm. Higher levels can affect concentration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCo2Info}>Close</Button> {/* set the onClick of the button to the handleCloseCo2Info function */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isPm25InfoOpen} // set the open of the dialog to the isPm25InfoOpen state
        onClose={handleClosePm25Info} // set the onClose of the dialog to the handleClosePm25Info function
        aria-labelledby="pm25-info-dialog-title" // set the aria-labelledby of the dialog to pm25-info-dialog-title
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the PaperProps of the dialog to the background paper of the theme
      >
        <DialogTitle id="pm25-info-dialog-title" sx={{ color: 'text.primary' }}>PM2.5 Level Information</DialogTitle> {/* set the DialogTitle of the dialog to PM2.5 Level Information */}
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}> {/* set the DialogContentText of the dialog to the secondary colour of the theme */}
            Particulate Matter 2.5 (PM2.5) concentration in micrograms per cubic meter (μg/m³). These are fine inhalable particles, with diameters generally 2.5 micrometers and smaller.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePm25Info}>Close</Button> {/* set the onClick of the button to the handleClosePm25Info function */}
        </DialogActions>
      </Dialog>

      {airQualityResult && ( // if the air quality result is found
        <Paper 
          sx={{ 
            p: 3, // set the padding of the paper to 3
            mt: 3, // set the margin top of the paper to 3
            borderRadius: '8px', // set the border radius of the paper to 8px
            backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40', // set the background colour of the paper to the primary dark colour of the theme with 30% opacity, or the primary light colour of the theme with 40% opacity
            border: `1px solid ${theme.palette.primary.main}` // set the border of the paper to the primary main colour of the theme
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}> {/* set the variant of the typography to h6, this is used to create a heading */}
            Fuzzy Logic Result:
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}> {/* set the variant of the typography to body1, this is used to create a body text */}
            {airQualityResult}
          </Typography>
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}> {/* set the variant of the typography to body2, this is used to create a body text */}
            The air quality level is calculated by applying fuzzy rules that combine CO2 and PM2.5 levels.
            CO2 levels above 1000 ppm can cause drowsiness, while PM2.5 particles can penetrate deep into the lungs.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AirQualityScenario; // export the AirQualityScenario component as the default export, this allows the component to be used in other files
