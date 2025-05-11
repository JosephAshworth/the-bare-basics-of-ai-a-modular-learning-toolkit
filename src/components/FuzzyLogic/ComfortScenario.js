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

import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material'; // import HelpOutlineIcon from MUI

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import apiService from '../../services/apiService'; // import apiService, this is used to make API requests to the backend

const ComfortScenario = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // state variable to store the dark mode
  const [loading, setLoading] = useState(false); // state variable to store the loading state
  const [temperature, setTemperature] = useState(25); // state variable to store the temperature
  const [humidity, setHumidity] = useState(50); // state variable to store the humidity
  const [comfortResult, setComfortResult] = useState(''); // state variable to store the comfort result
  const [error, setError] = useState(null); // state variable to store the error
  
  const [isTempInfoOpen, setTempInfoOpen] = useState(false); // state variable to store the temperature info open state
  const [isHumidityInfoOpen, setHumidityInfoOpen] = useState(false); // state variable to store the humidity info open state

  const handleOpenTempInfo = () => setTempInfoOpen(true); // for handling the open temperature info event
  const handleCloseTempInfo = () => setTempInfoOpen(false); // for handling the close temperature info event

  const handleOpenHumidityInfo = () => setHumidityInfoOpen(true); // for handling the open humidity info event
  const handleCloseHumidityInfo = () => setHumidityInfoOpen(false); // for handling the close humidity info event

  const handleTemperatureChange = (event, newValue) => {
    setTemperature(newValue); // for setting the temperature to the new value
  };

  const handleHumidityChange = (event, newValue) => {
    setHumidity(newValue); // for setting the humidity to the new value
  };

  const calculateComfort = async () => {
    try {
      setLoading(true); // for setting the loading state to true
      setError(null); // for setting the error to null
      
      try {
        console.log('Attempting to calculate comfort with /api prefix...'); // for logging the attempt to calculate comfort with the /api prefix
        const response = await apiService.post('/api/fuzzy-logic/comfort', { // for making the API request to the backend
          temperature, // for sending the temperature to the backend
          humidity // for sending the humidity to the backend
        });
        setComfortResult(response.data.result); // for setting the comfort result to the response data result
      } catch (apiError) { // for catching the API error
        console.log('Retrying without /api prefix...', apiError); // for logging the retry without the /api prefix
        
        const response = await apiService.post('/fuzzy-logic/comfort', { // for making the API request to the backend
          temperature, // for sending the temperature to the backend
          humidity // for sending the humidity to the backend
        });
        setComfortResult(response.data.result); // for setting the comfort result to the response data result
      }
    } catch (error) { // for catching the error
      console.error('Error calculating comfort result:', error); // for logging the error calculating the comfort result
      setError('Could not connect to the backend service. Please try again later.'); // for setting the error to the error message
      setComfortResult(''); // for setting the comfort result to an empty string
    } finally {
      setLoading(false); // for setting the loading state to false
    }
  };

  return (
    <Box>
      <Typography
        variant="h6" // for setting the variant to h6
        sx={{
          mb: 3, // for setting the margin bottom to 3, this is the space between the title and the next element
          color: theme.palette.text.primary // for setting the text colour to the primary colour
        }}
      >
        Adjust the temperature and humidity values to determine comfort level
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="temperature-slider" // for setting the id to temperature-slider
          gutterBottom // for setting the gutter bottom to true, this is the space between the title and the next element
        >
          Temperature: {temperature}°C
          <IconButton
            size="small" // for setting the size to small, this is used to make the icon small
            sx={{ ml: 0.5 }} // for setting the margin left to 0.5, this is used to add space between the text and the icon
            onClick={handleOpenTempInfo} // for setting the onClick to the handleOpenTempInfo function, this is used to open the temperature info dialog
            aria-label="Temperature Information" // for setting the aria-label to Temperature Information, this is used to provide a description of the icon
          >
            <HelpOutlineIcon fontSize="inherit" /> {/* for setting the font size to inherit, this is used to make the icon the same size as the text */}
          </IconButton>
        </Typography>
        <Slider
          value={temperature} // for setting the value to the temperature
          onChange={handleTemperatureChange} // for setting the onChange to the handleTemperatureChange function, this is used to handle the temperature change
          aria-labelledby="temperature-slider" // for setting the aria-labelledby to temperature-slider, this is used to provide a description of the slider
          valueLabelDisplay="auto" // for setting the value label display to auto, this is used to display the value label
          step={1} // for setting the step to 1, this is used to set the step of the slider
          marks // for setting the marks to true, this is used to display the marks on the slider
          min={0} // for setting the min to 0, this is used to set the minimum value of the slider
          max={50} // for setting the max to 50, this is used to set the maximum value of the slider
          sx={{ color: theme.palette.primary.main }} // for setting the colour to the primary colour of the theme
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2" // for setting the variant to body2, this is used to set the size of the text
            sx={{
              display: 'inline-block', // for setting the display to inline-block, this is used to display the text in a block
              width: '33%', // for setting the width to 33%, this is used to set the width of the text
              textAlign: 'left', // for setting the text align to left, this is used to align the text to the left
              color: theme.palette.text.secondary // for setting the colour to the secondary colour of the theme
            }}
          >Cold</Typography>
          <Typography
            variant="body2" // for setting the variant to body2, this is used to set the size of the text
            sx={{
              display: 'inline-block', // for setting the display to inline-block, this is used to display the text in a block
              width: '34%', // for setting the width to 34%, this is used to set the width of the text
              textAlign: 'center', // for setting the text align to centre, this is used to align the text to the centre
              color: theme.palette.text.secondary // for setting the colour to the secondary colour of the theme
            }}
          >Moderate</Typography>
          <Typography
            variant="body2" // for setting the variant to body2, this is used to set the size of the text
            sx={{
              display: 'inline-block', // for setting the display to inline-block, this is used to display the text in a block
              width: '33%', // for setting the width to 33%, this is used to set the width of the text
              textAlign: 'right', // for setting the text align to right, this is used to align the text to the right
              color: theme.palette.text.secondary // for setting the colour to the secondary colour of the theme
            }}
          >Hot</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          id="humidity-slider" // for setting the id to humidity-slider
          gutterBottom // for setting the gutter bottom to true, this is the space between the title and the next element
        >
          Humidity: {humidity}%
          <IconButton
            size="small" // for setting the size to small, this is used to make the icon small
            sx={{ ml: 0.5 }} // for setting the margin left to 0.5, this is used to add space between the text and the icon
            onClick={handleOpenHumidityInfo} // for setting the onClick to the handleOpenHumidityInfo function, this is used to open the humidity info dialog
            aria-label="Humidity Information" // for setting the aria-label to Humidity Information, this is used to provide a description of the icon
          >
            <HelpOutlineIcon fontSize="inherit" /> {/* for setting the font size to inherit, this is used to make the icon the same size as the text */}
          </IconButton>
        </Typography>
        <Slider
          value={humidity} // for setting the value to the humidity
          onChange={handleHumidityChange} // for setting the onChange to the handleHumidityChange function, this is used to handle the humidity change
          aria-labelledby="humidity-slider" // for setting the aria-labelledby to humidity-slider, this is used to provide a description of the slider
          valueLabelDisplay="auto" // for setting the value label display to auto, this is used to display the value label
          step={1} // for setting the step to 1, this is used to set the step of the slider
          marks // for setting the marks to true, this is used to display the marks on the slider
          min={0} // for setting the min to 0, this is used to set the minimum value of the slider
          max={100} // for setting the max to 100, this is used to set the maximum value of the slider
          sx={{ color: theme.palette.primary.main }} // for setting the colour to the primary colour of the theme
        />
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="body2" // for setting the variant to body2, this is used to set the size of the text
            sx={{
              display: 'inline-block', // for setting the display to inline-block, this is used to display the text in a block
              width: '33%', // for setting the width to 33%, this is used to set the width of the text
              textAlign: 'left', // for setting the text align to left, this is used to align the text to the left
              color: theme.palette.text.secondary // for setting the colour to the secondary colour of the theme
            }}>Dry</Typography>
          <Typography
            variant="body2" // for setting the variant to body2, this is used to set the size of the text
            sx={{
              display: 'inline-block', // for setting the display to inline-block, this is used to display the text in a block
              width: '34%', // for setting the width to 34%, this is used to set the width of the text
              textAlign: 'center', // for setting the text align to centre, this is used to align the text to the centre
              color: theme.palette.text.secondary // for setting the colour to the secondary colour of the theme
            }}>Normal</Typography>
          <Typography
            variant="body2" // for setting the variant to body2, this is used to set the size of the text
            sx={{
              display: 'inline-block', // for setting the display to inline-block, this is used to display the text in a block
              width: '33%', // for setting the width to 33%, this is used to set the width of the text
              textAlign: 'right', // for setting the text align to right, this is used to align the text to the right
              color: theme.palette.text.secondary // for setting the colour to the secondary colour of the theme
            }}>Humid</Typography>
        </Box>
      </Box>

      {error && ( // for checking if the error is true
        <Paper 
          sx={{ 
            p: 2, // for setting the padding to 2, this is used to set the padding of the paper
            mb: 3, // for setting the margin bottom to 3, this is used to set the margin bottom of the paper
            borderRadius: '8px', // for setting the border radius to 8px, this is used to set the border radius of the paper
            backgroundColor: theme.palette.error.light, // for setting the background colour to the error light colour of the theme
            border: `1px solid ${theme.palette.error.main}`, // for setting the border to the error main colour of the theme
            color: theme.palette.error.contrastText // for setting the colour to the error contrast text colour of the theme
          }}
        >
          <Typography color="inherit">
            {error} {/* for setting the text to the error */}
          </Typography>
        </Paper>
      )}

      <Button 
        variant="contained" // for setting the variant to contained, this makes the button a solid colour
        onClick={calculateComfort} // for setting the onClick to the calculateComfort function, this is used to calculate the comfort level
        disabled={loading} // for setting the disabled to the loading state, this is used to disable the button if the loading state is true
      >
        {loading ? 'Processing...' : 'Calculate Comfort Level'} {/* for setting the text to Processing... if the loading state is true, otherwise set the text to Calculate Comfort Level */}
      </Button>

      {comfortResult && ( // for checking if the comfort result is true
        <Paper 
          sx={{ 
            p: 3, // for setting the padding to 3, this is used to set the padding of the paper
            mt: 3, // for setting the margin top to 3, this is used to set the margin top of the paper
            borderRadius: '8px', // for setting the border radius to 8px, this is used to set the border radius of the paper
            backgroundColor: isDarkMode ? theme.palette.primary.dark + '30' : theme.palette.primary.light + '40', // for setting the background colour to the primary dark colour of the theme with 30% opacity, or the primary light colour of the theme with 40% opacity
            border: `1px solid ${theme.palette.primary.main}` // for setting the border to the primary main colour of the theme
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1 }}> {/* for setting the variant to h6, this is used to set the size of the text */}
            Fuzzy Logic Result:
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.primary }}> {/* for setting the variant to body1, this is used to set the size of the text */}
            {comfortResult}
          </Typography>
          
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 2 }}> {/* for setting the variant to body2, this is used to set the size of the text */}
            The comfort level is calculated by applying fuzzy rules that combine temperature and humidity. 
            Each rule assigns a different weight based on how much each input belongs to categories like "cold," "moderate," or "hot."
          </Typography>
        </Paper>
      )}

      <Dialog
        open={isTempInfoOpen} // for setting the open to the isTempInfoOpen state, this is used to open the temperature info dialog
        onClose={handleCloseTempInfo} // for setting the onClose to the handleCloseTempInfo function, this is used to close the temperature info dialog
        aria-labelledby="temp-info-dialog-title" // for setting the aria-labelledby to temp-info-dialog-title, this is used to provide a description of the dialog
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // for setting the PaperProps to the background paper of the theme
      >
        <DialogTitle id="temp-info-dialog-title" sx={{ color: 'text.primary' }}>Temperature Information</DialogTitle> {/* for setting the DialogTitle to Temperature Information */}
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}> {/* for setting the DialogContentText to the secondary colour of the theme */}
            Ambient air temperature in degrees Celsius (°C).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTempInfo}>Close</Button> {/* for setting the onClick to the handleCloseTempInfo function, this is used to close the temperature info dialog */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isHumidityInfoOpen} // for setting the open to the isHumidityInfoOpen state, this is used to open the humidity info dialog
        onClose={handleCloseHumidityInfo} // for setting the onClose to the handleCloseHumidityInfo function, this is used to close the humidity info dialog
        aria-labelledby="humidity-info-dialog-title" // for setting the aria-labelledby to humidity-info-dialog-title, this is used to provide a description of the dialog
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // for setting the PaperProps to the background paper of the theme
      >
        <DialogTitle id="humidity-info-dialog-title" sx={{ color: 'text.primary' }}>Humidity Information</DialogTitle> {/* for setting the DialogTitle to Humidity Information */}
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}> {/* for setting the DialogContentText to the secondary colour of the theme */}
            Relative Humidity (RH) as a percentage (%). It measures the amount of water vapor present in the air compared to the maximum amount it could hold at that temperature.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHumidityInfo}>Close</Button> {/* for setting the onClick to the handleCloseHumidityInfo function, this is used to close the humidity info dialog */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComfortScenario; // for exporting the ComfortScenario component as the default export, this allows the component to be used in other files
