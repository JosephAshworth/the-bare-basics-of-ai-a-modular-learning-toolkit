import
  { useState } // import useState, this is used to manage state in functional components
from 'react';

import {
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  Slider, // import Slider from MUI
  Button, // import Button from MUI
  Paper, // import Paper from MUI
  IconButton, // import IconButton from MUI
  Dialog, // import Dialog from MUI
  DialogTitle, // import DialogTitle from MUI
  DialogContent, // import DialogContent from MUI
  DialogContentText, // import DialogContentText from MUI
  DialogActions, // import DialogActions from MUI
} from '@mui/material';

import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material'; // import HelpOutline as HelpOutlineIcon from MUI

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import apiService from '../../services/apiService'; // import apiService, this is used to make API calls to the backend service

const LightComfortScenario = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode
  const [loading, setLoading] = useState(false); // state variable to store the loading state
  const [intensity, setIntensity] = useState(500); // state variable to store the intensity value
  const [colourTemp, setColourTemp] = useState(4000); // state variable to store the colour temperature value
  const [lightComfortResult, setLightComfortResult] = useState(''); // state variable to store the light comfort result
  const [error, setError] = useState(null); // state variable to store the error
  
  const [isIntensityInfoOpen, setIntensityInfoOpen] = useState(false); // state variable to store the intensity info open state
  const [isColourTempInfoOpen, setColourTempInfoOpen] = useState(false); // state variable to store the colour temperature info open state

  const handleOpenIntensityInfo = () => setIntensityInfoOpen(true); // function to open the intensity info dialog
  const handleCloseIntensityInfo = () => setIntensityInfoOpen(false); // function to close the intensity info dialog

  const handleOpenColourTempInfo = () => setColourTempInfoOpen(true); // function to open the colour temperature info dialog
  const handleCloseColourTempInfo = () => setColourTempInfoOpen(false); // function to close the colour temperature info dialog

  const handleIntensityChange = (event, newValue) => {
    setIntensity(newValue); // function to set the intensity value
  };

  const handleColourTempChange = (event, newValue) => {
    setColourTemp(newValue); // function to set the colour temperature value
  };

  const calculateLightComfort = async () => {
    try {
      setLoading(true); // function to set the loading state to true
      setError(null); // function to set the error to null
      
      try {
        console.log('Attempting to calculate light comfort with /api prefix...'); // log the attempt to calculate light comfort with the /api prefix
        const response = await apiService.post('/api/fuzzy-logic/light-comfort', { // make a POST request to the /api/fuzzy-logic/light-comfort endpoint,
          intensity, // send the intensity value
          colour_temp: colourTemp // send the colour temperature value
        });
        setLightComfortResult(response.data.result); // set the light comfort result to the response data result
      } catch (apiError) { // catch the API error (if the initial attempt fails)
        console.log('Retrying without /api prefix...', apiError); // log the retry without the /api prefix

        const response = await apiService.post('/fuzzy-logic/light-comfort', { // make a POST request to the /fuzzy-logic/light-comfort endpoint,
          intensity, // send the intensity value
          colour_temp: colourTemp // send the colour temperature value
        });
        setLightComfortResult(response.data.result); // set the light comfort result to the response data result
      }
    } catch (error) { // catch the error
      console.error('Error calculating light comfort result:', error); // log the error
      setError('Could not connect to the backend service. Please try again later.'); // set the error to the error message
      setLightComfortResult(''); // set the light comfort result to an empty string
    } finally {
      setLoading(false); // function to set the loading state to false
    }
  };

  return (
    <Box>
      <Typography
        variant="h6" // set the variant of the typography to h6
        sx={{
          mb: 3, // set the margin bottom of the typography to 3
          color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
        }}
      >
        Adjust the light intensity and colour temperature to determine lighting comfort
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="intensity-slider" // set the id of the typography to intensity-slider
          gutterBottom // set the gutter bottom of the typography
        >
          Light Intensity: {intensity} lux
          <IconButton
            size="small" // set the size of the icon button to small
            sx={{ ml: 0.5 }} // set the margin left of the icon button to 0.5
            onClick={handleOpenIntensityInfo} // set the onClick of the icon button to the handleOpenIntensityInfo function
            aria-label="Light Intensity Information" // set the aria-label of the icon button to Light Intensity Information
          >
            <HelpOutlineIcon fontSize="inherit" /> {/* for setting the font size to inherit, this is used to make the icon the same size as the text */}
          </IconButton>
        </Typography>
        <Slider
          value={intensity} // set the value of the slider to the intensity value
          onChange={handleIntensityChange} // set the onChange of the slider to the handleIntensityChange function
          aria-labelledby="intensity-slider" // set the aria-labelledby of the slider to intensity-slider
          valueLabelDisplay="auto" // set the value label display of the slider to auto
          step={10} // set the step of the slider to 10
          marks // set the marks of the slider to true
          min={0} // set the min of the slider to 0
          max={1000} // set the max of the slider to 1000
          sx={{ color: theme.palette.primary.main }} // set the colour of the slider to the primary colour of the theme
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              display: 'inline-block', // set the display of the typography to inline-block
              width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
              textAlign: 'left', // set the text alignment of the typography to left
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}
          >
            Dim
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              display: 'inline-block', // set the display of the typography to inline-block
              width: '34%', // set the width of the typography to 34%, this is used to make the typography take up 34% of the width of the container
              textAlign: 'center', // set the text alignment of the typography to centre
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}
          >
            Moderate
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              display: 'inline-block', // set the display of the typography to inline-block
              width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
              textAlign: 'right', // set the text alignment of the typography to right
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}
          >
            Bright
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="colour-temp-slider" // set the id of the typography to colour-temp-slider
          gutterBottom // set the gutter bottom of the typography
          sx={{
            color: theme.palette.text.primary, // set the colour of the typography to the primary colour of the theme
            display: 'inline-flex', // set the display of the typography to inline-flex
            alignItems: 'center' // set the align items of the typography to centre
          }}
        >
          Colour Temperature: {colourTemp} K
          <IconButton
            size="small" // set the size of the icon button to small
            sx={{ ml: 0.5 }} // set the margin left of the icon button to 0.5
            onClick={handleOpenColourTempInfo} // set the onClick of the icon button to the handleOpenColourTempInfo function
            aria-label="Colour Temperature Information" // set the aria-label of the icon button to Colour Temperature Information
          >
            <HelpOutlineIcon fontSize="inherit" /> {/* for setting the font size to inherit, this is used to make the icon the same size as the text */}
          </IconButton>
        </Typography>
        <Slider
          value={colourTemp} // set the value of the slider to the colour temperature value
          onChange={handleColourTempChange} // set the onChange of the slider to the handleColourTempChange function
          aria-labelledby="colour-temp-slider" // set the aria-labelledby of the slider to colour-temp-slider
          valueLabelDisplay="auto" // set the value label display of the slider to auto
          step={100} // set the step of the slider to 100
          marks // set the marks of the slider to true
          min={2000} // set the min of the slider to 2000
          max={6500} // set the max of the slider to 6500
          sx={{ color: theme.palette.primary.main }} // set the colour of the slider to the primary colour of the theme
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              display: 'inline-block', // set the display of the typography to inline-block
              width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
              textAlign: 'left', // set the text alignment of the typography to left
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}
          >
            Warm
          </Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              display: 'inline-block', // set the display of the typography to inline-block
              width: '34%', // set the width of the typography to 34%, this is used to make the typography take up 34% of the width of the container
              textAlign: 'center', // set the text alignment of the typography to centre
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}
          >Neutral</Typography>
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{
              display: 'inline-block', // set the display of the typography to inline-block
              width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
              textAlign: 'right', // set the text alignment of the typography to right
              color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
            }}
          >
            Cool
          </Typography>
        </Box>
      </Box>

      {error && ( // check if the error is true
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
        variant="contained" // set the variant of the button to contained, this makes the button a solid colour
        onClick={calculateLightComfort} // set the onClick of the button to the calculateLightComfort function
        disabled={loading} // set the disabled of the button to the loading state
      >
        {loading ? 'Processing...' : 'Calculate Lighting Comfort'} {/* set the text of the button to Processing... if the loading state is true, otherwise set the text to Calculate Lighting Comfort */}
      </Button>

      {lightComfortResult && ( // check if the light comfort result is true
        <Paper 
          sx={{ 
            p: 3, // set the padding of the paper to 3
            mt: 3, // set the margin top of the paper to 3
            borderRadius: '8px', // set the border radius of the paper to 8px
            backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40', // set the background colour of the paper to the primary dark colour of the theme with 30% opacity, or the primary light colour of the theme with 40% opacity
            border: `1px solid ${theme.palette.primary.main}` // set the border of the paper to the primary main colour of the theme
          }}
        >
          <Typography
            variant="h6" // set the variant of the typography to h6
            sx={{ color: theme.palette.primary.main, mb: 1 }} // set the colour of the typography to the primary main colour of the theme, and the margin bottom to 1
          >
            Fuzzy Logic Result:
          </Typography>
          <Typography
            variant="body1" // set the variant of the typography to body1
            sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary text colour of the theme
          >
            {lightComfortResult}
          </Typography>
          
          <Typography
            variant="body2" // set the variant of the typography to body2
            sx={{ color: theme.palette.text.secondary, mt: 2 }} // set the colour of the typography to the secondary text colour of the theme, and the margin top to 2
          >
            The lighting comfort level is calculated by applying fuzzy rules that combine light intensity and colour temperature.
            Warmer light (2700-3000K) is generally better for relaxation, while cooler light (5000K+) is better for focus and productivity.
          </Typography>
        </Paper>
      )}

      <Dialog
        open={isIntensityInfoOpen} // set the open of the dialog to the intensity info open state
        onClose={handleCloseIntensityInfo} // set the onClose of the dialog to the handleCloseIntensityInfo function
        aria-labelledby="intensity-info-dialog-title" // set the aria-labelledby of the dialog to intensity-info-dialog-title
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the PaperProps of the dialog to the background paper colour of the theme
      >
        <DialogTitle id="intensity-info-dialog-title" // set the id of the dialog title to intensity-info-dialog-title
          sx={{ color: 'text.primary' }} // set the colour of the dialog title to the primary text colour of the theme
        >
          Light Intensity Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ color: 'text.secondary' }} // set the colour of the dialog content text to the secondary text colour of the theme
          >
            Illuminance measured in lux (lx). It represents the amount of light falling on a surface. Office lighting is often around 300-500 lux.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIntensityInfo}>Close</Button> {/* set the onClick of the button to the handleCloseIntensityInfo function */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isColourTempInfoOpen} // set the open of the dialog to the colour temperature info open state
        onClose={handleCloseColourTempInfo} // set the onClose of the dialog to the handleCloseColourTempInfo function
        aria-labelledby="colour-temp-info-dialog-title" // set the aria-labelledby of the dialog to colour-temp-info-dialog-title
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the PaperProps of the dialog to the background paper colour of the theme
      >
        <DialogTitle id="colour-temp-info-dialog-title" // set the id of the dialog title to colour-temp-info-dialog-title
          sx={{ color: 'text.primary' }} // set the colour of the dialog title to the primary text colour of the theme
        >
          Colour Temperature Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText // set the variant of the dialog content text to body2
            sx={{ color: 'text.secondary' }} // set the colour of the dialog content text to the secondary text colour of the theme
          >
            Correlated Colour Temperature (CCT) measured in Kelvin (K). Lower values (e.g., 2700K) are 'warm' (yellowish), higher values (e.g., 6500K) are 'cool' (bluish). Daylight is around 5000-6500K.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseColourTempInfo}>Close</Button> {/* set the onClick of the button to the handleCloseColourTempInfo function */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LightComfortScenario; // export the LightComfortScenario component, this is used to use the component in other files
