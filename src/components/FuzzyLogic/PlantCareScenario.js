import
  { useState } // import useState, this is used to manage the state of the component
from 'react';

import {
  Box, // import Box from MUI
  Typography, // import Typography from MUI
  Slider, // import Slider from MUI
  Button, // import Button from MUI
  Paper, // import Paper from MUI
  Grid, // import Grid from MUI
  FormControl, // import FormControl from MUI
  InputLabel, // import InputLabel from MUI
  Select, // import Select from MUI
  MenuItem, // import MenuItem from MUI
  IconButton, // import IconButton from MUI
  Card, // import Card from MUI
  CardContent, // import CardContent from MUI
  List, // import List from MUI
  ListItem, // import ListItem from MUI
  ListItemText, // import ListItemText from MUI
  ListItemIcon, // import ListItemIcon from MUI
  Dialog, // import Dialog from MUI
  DialogTitle, // import DialogTitle from MUI
  DialogContent, // import DialogContent from MUI
  DialogContentText, // import DialogContentText from MUI
  DialogActions // import DialogActions from MUI
} from '@mui/material';

import { useTheme } from '@mui/material/styles'; // import useTheme, this is used to access the theme object, which styles the components based on dark or light mode

import apiService from '../../services/apiService'; // import apiService, this is used to make API calls to the backend service

import OpacityIcon from '@mui/icons-material/Opacity'; // import OpacityIcon from MUI
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // import WbSunnyIcon from MUI
import ThermostatIcon from '@mui/icons-material/Thermostat'; // import ThermostatIcon from MUI
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // import HelpOutlineIcon from MUI
import ScheduleIcon from '@mui/icons-material/Schedule'; // import ScheduleIcon from MUI
import WaterDropIcon from '@mui/icons-material/WaterDrop'; // import WaterDropIcon from MUI
import LightModeIcon from '@mui/icons-material/LightMode'; // import LightModeIcon from MUI
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'; // import DeviceThermostatIcon from MUI

const PlantCareScenario = () => {
  const theme = useTheme(); // for getting the MUI theme object
  const isDarkMode = theme.palette.mode === 'dark'; // check if the theme is dark mode
  const [loading, setLoading] = useState(false); // state variable to store the loading state
  const [soilMoisture, setSoilMoisture] = useState(40); // state variable to store the soil moisture value
  const [lightLevel, setLightLevel] = useState(50); // state variable to store the light level value
  const [plantTemp, setPlantTemp] = useState(22); // state variable to store the plant temperature value
  const [plantType, setPlantType] = useState('General'); // state variable to store the plant type value
  const [plantCareResult, setPlantCareResult] = useState(null); // state variable to store the plant care result
  const [error, setError] = useState(null); // state variable to store the error
  
  const [isSoilMoistureInfoOpen, setSoilMoistureInfoOpen] = useState(false); // state variable to store the soil moisture info open state
  const [isLightLevelInfoOpen, setLightLevelInfoOpen] = useState(false); // state variable to store the light level info open state
  const [isPlantTempInfoOpen, setPlantTempInfoOpen] = useState(false); // state variable to store the plant temperature info open state

  const handleOpenSoilMoistureInfo = () => setSoilMoistureInfoOpen(true); // function to open the soil moisture info dialog
  const handleCloseSoilMoistureInfo = () => setSoilMoistureInfoOpen(false); // function to close the soil moisture info dialog

  const handleOpenLightLevelInfo = () => setLightLevelInfoOpen(true); // function to open the light level info dialog
  const handleCloseLightLevelInfo = () => setLightLevelInfoOpen(false); // function to close the light level info dialog

  const handleOpenPlantTempInfo = () => setPlantTempInfoOpen(true); // function to open the plant temperature info dialog
  const handleClosePlantTempInfo = () => setPlantTempInfoOpen(false); // function to close the plant temperature info dialog
  
  const handleSoilMoistureChange = (event, newValue) => {
    setSoilMoisture(newValue); // function to set the soil moisture value
  };
  
  const handleLightLevelChange = (event, newValue) => {
    setLightLevel(newValue); // function to set the light level value
  };
  
  const handlePlantTempChange = (event, newValue) => {
    setPlantTemp(newValue); // function to set the plant temperature value
  };
  
  const handlePlantTypeChange = (event) => {
    setPlantType(event.target.value); // function to set the plant type value
  };
  
  const calculatePlantCare = async () => {
    try {
      setLoading(true); // function to set the loading state to true
      setError(null); // function to set the error to null
      setPlantCareResult(null); // function to set the plant care result to null
      
      const requestData = { // create the request data object
        soil_moisture: soilMoisture, // send the soil moisture value
        light_level: lightLevel, // send the light level value
        temperature: plantTemp, // send the plant temperature value
        plant_type: plantType // send the plant type value
      };
      
      try {
        console.log('Attempting to calculate plant care with /api prefix...'); // log the attempt to calculate plant care with the /api prefix
        const response = await apiService.post('/api/fuzzy-logic/plant-care', requestData); // make a POST request to the /api/fuzzy-logic/plant-care endpoint, with the request data
        setPlantCareResult(response.data); // set the plant care result to the response data
      } catch (apiError) { // catch the API error (if the initial attempt fails)
        console.log('Retrying without /api prefix...', apiError); // log the error
        const response = await apiService.post('/fuzzy-logic/plant-care', requestData); // make a POST request to the /fuzzy-logic/plant-care endpoint, with the request data
        setPlantCareResult(response.data); // set the plant care result to the response data
      }
    } catch (error) { // catch the error
      console.error('Error calculating plant care recommendations:', error); // log the error
      setError('Could not connect to the backend service. Please try again later.'); // set the error to the error message
    } finally { // finally block
      setLoading(false); // function to set the loading state to false
    }
  };

  return (
    <Box>
      <Typography
        variant="h6" // set the variant of the typography to h6
        sx={{
          mb: 3, // set the margin bottom to 3
          color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
        }}
      >
        Plant Care Assistant. Get personalised care recommendations for your plants
      </Typography>
      
      <Grid container spacing={3}> {/* create a grid container with 3 spacing, making sure there is space between the grid items */}
        <Grid item xs={12} md={7}> {/* create a grid item with 12 columns on small screens and 7 columns on medium screens */}
          <Paper sx={{ p: 3, borderRadius: '12px', mb: 3, backgroundColor: theme.palette.background.paper }}> {/* create a paper component with 3 padding, a border radius of 12px, a margin bottom of 3, and a background colour of the theme's background paper */}
            <Typography
              variant="subtitle1" // set the variant of the typography to subtitle1
              sx={{
                mb: 2, // set the margin bottom to 2
                fontWeight: 500, // set the font weight to 500
                color: theme.palette.text.primary // set the colour of the typography to the primary colour of the theme
              }}
            >
              Input Current Plant Conditions
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex', // set the display to flex
                  alignItems: 'center' // set the alignment of the items to centre
                }}
              >
                <OpacityIcon
                  color="primary" // set the colour of the icon to primary
                  fontSize="small" // set the font size of the icon to small
                  sx={{ mr: 1 }} // set the margin right of the icon to 1
                />
                <Typography
                  id="soil-moisture-slider" // set the id of the typography to soil-moisture-slider
                  gutterBottom // set the gutter bottom of the typography
                  sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
                >
                  Soil Moisture: {soilMoisture}%
                </Typography>
                <IconButton
                  size="small" // set the size of the icon button to small
                  sx={{ ml: 1 }} // set the margin left of the icon button to 1
                  onClick={handleOpenSoilMoistureInfo} // set the onClick of the icon button to the handleOpenSoilMoistureInfo function
                  aria-label="Soil Moisture Information" // set the aria-label of the icon button to Soil Moisture Information
                >
                  <HelpOutlineIcon fontSize="small" /> {/* for setting the font size to inherit, this is used to make the icon the same size as the text */}
                </IconButton>
              </Box>
              <Slider
                value={soilMoisture} // set the value of the slider to the soil moisture value
                onChange={handleSoilMoistureChange} // set the onChange of the slider to the handleSoilMoistureChange function
                aria-labelledby="soil-moisture-slider" // set the aria-labelledby of the slider to soil-moisture-slider
                valueLabelDisplay="auto" // set the value label display of the slider to auto
                step={1} // set the step of the slider to 1
                marks={[
                  { value: 0, label: '0%' }, // set the value of the mark to 0 and the label to 0%
                  { value: 50, label: '50%' }, // set the value of the mark to 50 and the label to 50%
                  { value: 100, label: '100%' } // set the value of the mark to 100 and the label to 100%
                ]}
                min={0} // set the minimum value of the slider to 0
                max={100} // set the maximum value of the slider to 100
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
                  }}>Dry</Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2
                  sx={{ 
                    display: 'inline-block', // set the display of the typography to inline-block
                    width: '34%', // set the width of the typography to 34%, this is used to make the typography take up 34% of the width of the container
                    textAlign: 'center', // set the text alignment of the typography to centre
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}>Moist</Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2
                  sx={{ 
                    display: 'inline-block', // set the display of the typography to inline-block
                    width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
                    textAlign: 'right', // set the text alignment of the typography to right
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}>Wet</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex', // set the display to flex
                  alignItems: 'center' // set the alignment of the items to centre
                }}
              >
                <WbSunnyIcon
                  color="primary" // set the colour of the icon to primary
                  fontSize="small" // set the font size of the icon to small
                  sx={{ mr: 1 }} // set the margin right of the icon to 1
                />
                <Typography
                  id="light-level-slider" // set the id of the typography to light-level-slider
                  gutterBottom // set the gutter bottom of the typography
                  sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
                >
                  Light Level: {lightLevel}%
                </Typography>
                <IconButton
                  size="small" // set the size of the icon button to small
                  sx={{ ml: 1 }} // set the margin left of the icon button to 1
                  onClick={handleOpenLightLevelInfo} // set the onClick of the icon button to the handleOpenLightLevelInfo function
                  aria-label="Light Level Information" // set the aria-label of the icon button to Light Level Information
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Slider
                value={lightLevel} // set the value of the slider to the light level value
                onChange={handleLightLevelChange} // set the onChange of the slider to the handleLightLevelChange function
                aria-labelledby="light-level-slider" // set the aria-labelledby of the slider to light-level-slider
                valueLabelDisplay="auto" // set the value label display of the slider to auto
                step={1} // set the step of the slider to 1
                marks={[
                  { value: 0, label: '0%' }, // set the value of the mark to 0 and the label to 0%
                  { value: 50, label: '50%' }, // set the value of the mark to 50 and the label to 50%
                  { value: 100, label: '100%' } // set the value of the mark to 100 and the label to 100%
                ]}
                min={0} // set the minimum value of the slider to 0
                max={100} // set the maximum value of the slider to 100
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
                  }}>Dark</Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2
                  sx={{ 
                    display: 'inline-block', // set the display of the typography to inline-block
                    width: '34%', // set the width of the typography to 34%, this is used to make the typography take up 34% of the width of the container
                    textAlign: 'center', // set the text alignment of the typography to centre
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}>Medium</Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2
                  sx={{ 
                    display: 'inline-block', // set the display of the typography to inline-block
                    width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
                    textAlign: 'right', // set the text alignment of the typography to right
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}>Bright</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex', // set the display to flex
                  alignItems: 'center' // set the alignment of the items to centre
                }}
              >
                <ThermostatIcon
                  color="primary" // set the colour of the icon to primary
                  fontSize="small" // set the font size of the icon to small
                  sx={{ mr: 1 }} // set the margin right of the icon to 1
                />
                <Typography id="plant-temp-slider" // set the id of the typography to plant-temp-slider
                  gutterBottom // set the gutter bottom of the typography
                  sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary colour of the theme
                >
                  Temperature: {plantTemp}°C
                </Typography>
                <IconButton
                  size="small" // set the size of the icon button to small
                  sx={{ ml: 1 }} // set the margin left of the icon button to 1
                  onClick={handleOpenPlantTempInfo} // set the onClick of the icon button to the handleOpenPlantTempInfo function
                  aria-label="Temperature Information" // set the aria-label of the icon button to Temperature Information
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Slider
                value={plantTemp} // set the value of the slider to the plant temperature value
                onChange={handlePlantTempChange} // set the onChange of the slider to the handlePlantTempChange function
                aria-labelledby="plant-temp-slider" // set the aria-labelledby of the slider to plant-temp-slider
                valueLabelDisplay="auto" // set the value label display of the slider to auto
                step={1} // set the step of the slider to 1
                marks={[
                  { value: 0, label: '0°C' }, // set the value of the mark to 0 and the label to 0°C
                  { value: 20, label: '20°C' }, // set the value of the mark to 20 and the label to 20°C
                  { value: 40, label: '40°C' } // set the value of the mark to 40 and the label to 40°C
                ]}
                min={0} // set the minimum value of the slider to 0
                max={40} // set the maximum value of the slider to 40
                sx={{ color: theme.palette.primary.main }} // set the colour of the slider to the primary colour of the theme
              />
              <Box sx={{ mt: 1 }}> {/* create a box with a margin top of 1 */}
                <Typography
                  variant="body2" // set the variant of the typography to body2
                  sx={{ 
                    display: 'inline-block', // set the display of the typography to inline-block
                    width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
                    textAlign: 'left', // set the text alignment of the typography to left
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}>Cold</Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2
                  sx={{ 
                    display: 'inline-block', // set the display of the typography to inline-block
                    width: '34%', // set the width of the typography to 34%, this is used to make the typography take up 34% of the width of the container
                    textAlign: 'center', // set the text alignment of the typography to centre
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}>Moderate</Typography>
                <Typography
                  variant="body2" // set the variant of the typography to body2
                  sx={{ 
                    display: 'inline-block', // set the display of the typography to inline-block
                    width: '33%', // set the width of the typography to 33%, this is used to make the typography take up 33% of the width of the container
                    textAlign: 'right', // set the text alignment of the typography to right
                    color: theme.palette.text.secondary // set the colour of the typography to the secondary colour of the theme
                  }}>Hot</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <FormControl fullWidth> {/* create a form control with a full width */}
                <InputLabel id="plant-type-select-label">Plant Type</InputLabel> {/* create an input label with an id of plant-type-select-label */}
                <Select
                  labelId="plant-type-select-label" // set the label id of the select to plant-type-select-label
                  id="plant-type-select" // set the id of the select to plant-type-select
                  value={plantType} // set the value of the select to the plant type value
                  label="Plant Type" // set the label of the select to Plant Type
                  onChange={handlePlantTypeChange} // set the onChange of the select to the handlePlantTypeChange function
                >
                  <MenuItem value="General">General Houseplant</MenuItem> {/* create a menu item with a value of General */}
                  <MenuItem value="Succulent">Succulent/Cactus</MenuItem> {/* create a menu item with a value of Succulent/Cactus */}
                  <MenuItem value="Fern">Fern</MenuItem> {/* create a menu item with a value of Fern */}
                  <MenuItem value="Orchid">Orchid</MenuItem> {/* create a menu item with a value of Orchid */}
                </Select>
              </FormControl>
            </Box>
            
            {error && ( // if there is an error, create a paper with a background colour of the error light and a border of the error main
              <Paper 
                sx={{ 
                  p: 2, // set the padding of the paper to 2
                  mb: 3, // set the margin bottom of the paper to 3
                  borderRadius: '8px', // set the border radius of the paper to 8px
                  backgroundColor: theme.palette.error.light, // set the background colour of the paper to the error light
                  border: `1px solid ${theme.palette.error.main}`, // set the border of the paper to the error main
                  color: theme.palette.error.contrastText // set the colour of the paper to the error contrast text
                }}
              >
                <Typography color="inherit">
                  {error} {/* display the error */}
                </Typography>
              </Paper>
            )}
            
            <Button 
              variant="contained" // set the variant of the button to contained, this is used to create a button with a background colour of the primary main
              onClick={calculatePlantCare} // set the onClick of the button to the calculatePlantCare function
              disabled={loading} // set the disabled of the button to the loading state
              fullWidth // set the full width of the button
            >
              {loading ? 'Processing...' : 'Generate Plant Care Recommendations'} {/* if the loading state is true, display Processing..., otherwise display Generate Plant Care Recommendations */}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}> {/* create a grid item with a width of 12 on mobile and 5 on desktop */}
          {plantCareResult && !plantCareResult.error ? ( // if the plant care result is not an error, create a paper with a background colour of the paper and a border of the divider
            <Paper 
              sx={{ 
                p: 3, // set the padding of the paper to 3
                borderRadius: '12px', // set the border radius of the paper to 12px
                border: `1px solid ${theme.palette.divider}`, // set the border of the paper to the divider
                height: '100%', // set the height of the paper to 100%, this is used to make the paper take up the full height of the container
                bgcolor: theme.palette.background.paper, // set the background colour of the paper to the background paper
              }}
            >
              <Typography
                variant="h6" // set the variant of the typography to h6
                sx={{ 
                  color: theme.palette.primary.main, // set the colour of the typography to the primary main
                  mb: 2, // set the margin bottom of the typography to 2
                  pb: 1, // set the padding bottom of the typography to 1
                  borderBottom: `1px solid ${theme.palette.divider}` // set the border bottom of the typography to the divider
                }}>
                Plant Care Recommendations
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2" // set the variant of the typography to subtitle2
                  sx={{ 
                    color: theme.palette.text.primary, // set the colour of the typography to the primary text
                    mb: 1, // set the margin bottom of the typography to 1
                    display: 'flex', // set the display of the typography to flex
                    alignItems: 'center' // set the alignment of the items to centre
                  }}>
                  <ScheduleIcon
                    fontSize="small" // set the font size of the icon to small
                    sx={{ mr: 1, color: theme.palette.info.main }} // set the margin right of the icon to 1 and the colour of the icon to the info main
                  />
                  Watering Schedule
                </Typography>
                <Card
                  sx={{ 
                    backgroundColor: theme.palette.info.light + '40', // set the background colour of the card to the info light
                    mb: 2, // set the margin bottom of the card to 2
                    border: `1px solid ${theme.palette.info.main + '60'}` // set the border of the card to the info main
                  }}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography
                    variant="body2" // set the variant of the typography to body2
                    sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary text
                    >
                      {plantCareResult.recommendations.watering} {/* display the watering recommendation */}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography
                  variant="subtitle2" // set the variant of the typography to subtitle2
                  sx={{
                    color: theme.palette.text.primary, // set the colour of the typography to the primary text
                    mb: 1, // set the margin bottom of the typography to 1
                    display: 'flex', // set the display of the typography to flex
                    alignItems: 'center' // set the alignment of the items to centre
                  }}>
                  <LightModeIcon
                    fontSize="small" // set the font size of the icon to small
                    sx={{
                      mr: 1, // set the margin right of the icon to 1
                      color: theme.palette.warning.main // set the colour of the icon to the warning main
                    }} // set the margin right of the icon to 1 and the colour of the icon to the warning main
                  />
                  Light Recommendation
                </Typography>
                <Card
                  sx={{
                    backgroundColor: theme.palette.warning.light + '40', // set the background colour of the card to the warning light
                    mb: 2, // set the margin bottom of the card to 2
                    border: `1px solid ${theme.palette.warning.main + '60'}` // set the border of the card to the warning main
                  }}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2" // set the variant of the typography to body2
                      sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary text
                    >
                      {plantCareResult.recommendations.light} {/* display the light recommendation */}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography
                  variant="subtitle2" // set the variant of the typography to subtitle2
                  sx={{
                    color: theme.palette.text.primary, // set the colour of the typography to the primary text
                    mb: 1, // set the margin bottom of the typography to 1
                    display: 'flex', // set the display of the typography to flex
                    alignItems: 'center' // set the alignment of the items to centre
                  }}>
                  <DeviceThermostatIcon
                    fontSize="small" // set the font size of the icon to small
                    sx={{
                      mr: 1, // set the margin right of the icon to 1
                      color: theme.palette.error.main // set the colour of the icon to the error main
                    }} // set the margin right of the icon to 1 and the colour of the icon to the error main
                  />
                  Temperature Recommendation
                </Typography>
                <Card
                  sx={{
                    backgroundColor: theme.palette.error.light + '40', // set the background colour of the card to the error light
                    mb: 2, // set the margin bottom of the card to 2
                    border: `1px solid ${theme.palette.error.main + '60'}` // set the border of the card to the error main
                  }}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2" // set the variant of the typography to body2
                      sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary text
                    >
                      {plantCareResult.recommendations.temperature} {/* display the temperature recommendation */}
                    </Typography>
                  </CardContent>
                </Card>
                
                {plantCareResult.plant_specific_advice && (
                  <>
                    <Typography
                      variant="subtitle2" // set the variant of the typography to subtitle2
                      sx={{
                        color: theme.palette.text.primary, // set the colour of the typography to the primary text
                        mb: 1, // set the margin bottom of the typography to 1
                        display: 'flex', // set the display of the typography to flex
                        alignItems: 'center' // set the alignment of the items to centre
                      }}>
                      <HelpOutlineIcon
                        fontSize="small" // set the font size of the icon to small
                        sx={{
                          mr: 1, // set the margin right of the icon to 1
                          color: theme.palette.success.main // set the colour of the icon to the success main
                        }} // set the margin right of the icon to 1 and the colour of the icon to the success main
                      />
                      Plant-Specific Advice
                    </Typography>
                    <Card
                      sx={{
                        backgroundColor: theme.palette.success.light + '40', // set the background colour of the card to the success light
                        mb: 2, // set the margin bottom of the card to 2
                        border: `1px solid ${theme.palette.success.main + '60'}` // set the border of the card to the success main
                      }}
                    >
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="body2" // set the variant of the typography to body2
                          sx={{ color: theme.palette.text.primary }} // set the colour of the typography to the primary text
                        >
                          {plantCareResult.plant_specific_advice} {/* display the plant-specific advice */}
                        </Typography>
                      </CardContent>
                    </Card>
                  </>
                )}
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2" // set the variant of the typography to subtitle2
                  sx={{ color: theme.palette.text.primary, mb: 1 }} // set the colour of the typography to the primary text and the margin bottom of the typography to 1
                >
                  Current Conditions:
                </Typography>
                <List dense> {/* create a list with a dense style, which is used to make the list items more compact */}
                  <ListItem> {/* create a list item */}
                    <ListItemIcon sx={{ minWidth: 36 }}> {/* create a list item icon with a minimum width of 36 */}
                      <WaterDropIcon fontSize="small" color="info" /> {/* create a water drop icon with a font size of small and a colour of info */}
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Soil: ${plantCareResult.current_conditions.soil_moisture.status} (${plantCareResult.current_conditions.soil_moisture.value}%)`} // set the text to the soil moisture status and value
                    />
                  </ListItem>
                  <ListItem> {/* create a list item */}
                    <ListItemIcon sx={{ minWidth: 36 }}> {/* create a list item icon with a minimum width of 36 */}
                      <WbSunnyIcon fontSize="small" color="warning" /> {/* create a sun icon with a font size of small and a colour of warning */}
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Light: ${plantCareResult.current_conditions.light_level.status} (${plantCareResult.current_conditions.light_level.value}%)`} // set the text to the light level status and value
                    />
                  </ListItem>
                  <ListItem> {/* create a list item */}
                    <ListItemIcon sx={{ minWidth: 36 }}> {/* create a list item icon with a minimum width of 36 */}
                      <ThermostatIcon fontSize="small" color="error" /> {/* create a thermostat icon with a font size of small and a colour of error */}
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Temperature: ${plantCareResult.current_conditions.temperature.status} (${plantCareResult.current_conditions.temperature.value}°C)`} // set the text to the temperature status and value
                    />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          ) : plantCareResult && plantCareResult.error ? ( // if the plant care result is an error, create a paper with a background colour of the error light and a border of the error main
            <Paper sx={{ p: 3, borderRadius: '12px', backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }}> {/* create a paper with a padding of 3, a border radius of 12, a background colour of the error light and a colour of the error contrast text */}
              <Typography color="inherit" variant="subtitle1"> {/* create a typography with a colour of inherit and a variant of subtitle1 */}
                {plantCareResult.error} {/* display the error */}
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ 
              p: 3, // set the padding of the paper to 3
              borderRadius: '12px', // set the border radius of the paper to 12
              height: '100%', // set the height of the paper to 100%
              display: 'flex', // set the display of the paper to flex
              flexDirection: 'column', // set the flex direction of the paper to column
              justifyContent: 'center', // set the justify content of the paper to centre
              alignItems: 'center', // set the align items of the paper to centre
              backgroundColor: isDarkMode ? theme.palette.action.hover : theme.palette.grey[100], // set the background colour of the paper to the action hover if the theme is dark mode, otherwise set it to the grey 100
              border: `1px dashed ${theme.palette.divider}` // set the border of the paper to the divider
            }}>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 2 }}> {/* create a typography with a variant of body1, a colour of text secondary, an alignment of centre and a margin bottom of 2 */}
                Enter your plant's conditions and click "Generate" to get personalised care recommendations.
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center"> {/* create a typography with a variant of body2, a colour of text secondary, an alignment of centre */}
                Our fuzzy logic system will analyse multiple factors to provide optimal care advice.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={isSoilMoistureInfoOpen} // set the open state of the dialog to the soil moisture info open state
        onClose={handleCloseSoilMoistureInfo} // set the on close of the dialog to the handle close soil moisture info function
        aria-labelledby="soil-moisture-info-dialog-title" // set the aria labelled by of the dialog to the soil moisture info dialog title
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the paper props of the dialog to the background paper
      >
        <DialogTitle id="soil-moisture-info-dialog-title" sx={{ color: 'text.primary' }}>Soil Moisture Information</DialogTitle> {/* create a dialog title with an id of soil-moisture-info-dialog-title and a style of text primary */}
        <DialogContent> {/* create a dialog content */}
          <DialogContentText sx={{ color: 'text.secondary' }}> {/* create a dialog content text with a style of text secondary */}
            How moist the soil feels. 0% is completely dry, 100% is saturated.
          </DialogContentText>
        </DialogContent>
        <DialogActions> {/* create a dialog actions */}
          <Button onClick={handleCloseSoilMoistureInfo}>Close</Button> {/* create a button with an onClick of the handle close soil moisture info function */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isLightLevelInfoOpen} // set the open state of the dialog to the light level info open state
        onClose={handleCloseLightLevelInfo} // set the on close of the dialog to the handle close light level info function
        aria-labelledby="light-level-info-dialog-title" // set the aria labelled by of the dialog to the light level info dialog title
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the paper props of the dialog to the background paper
      >
        <DialogTitle id="light-level-info-dialog-title" sx={{ color: 'text.primary' }}>Light Level Information</DialogTitle> {/* create a dialog title with an id of light-level-info-dialog-title and a style of text primary */}
        <DialogContent> {/* create a dialog content */}
          <DialogContentText sx={{ color: 'text.secondary' }}> {/* create a dialog content text with a style of text secondary */}
            Amount of light the plant receives. 0% is complete darkness, 100% is direct bright sunlight.
          </DialogContentText>
        </DialogContent>
        <DialogActions> {/* create a dialog actions */}
          <Button onClick={handleCloseLightLevelInfo}>Close</Button> {/* create a button with an onClick of the handle close light level info function */}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isPlantTempInfoOpen} // set the open state of the dialog to the plant temp info open state
        onClose={handleClosePlantTempInfo} // set the on close of the dialog to the handle close plant temp info function
        aria-labelledby="plant-temp-info-dialog-title" // set the aria labelled by of the dialog to the plant temp info dialog title
        PaperProps={{ sx: { bgcolor: 'background.paper' } }} // set the paper props of the dialog to the background paper
      >
        <DialogTitle id="plant-temp-info-dialog-title" sx={{ color: 'text.primary' }}>Temperature Information</DialogTitle> {/* create a dialog title with an id of plant-temp-info-dialog-title and a style of text primary */}
        <DialogContent> {/* create a dialog content */}
          <DialogContentText sx={{ color: 'text.secondary' }}> {/* create a dialog content text with a style of text secondary */}
            The ambient temperature around your plant.
          </DialogContentText>
        </DialogContent>
        <DialogActions> {/* create a dialog actions */}
          <Button onClick={handleClosePlantTempInfo}>Close</Button> {/* create a button with an onClick of the handle close plant temp info function */}
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PlantCareScenario; // export the PlantCareScenario component as the default export, this is used to make the component available to other files
