// display the plant care scenario inside the interactive demo

import { useState } from 'react';

// material ui components
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import apiService from '../../services/APIService';

import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LightModeIcon from '@mui/icons-material/LightMode';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

const PlantCareScenario = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(false);
  const [soilMoisture, setSoilMoisture] = useState(40);
  const [lightLevel, setLightLevel] = useState(50);
  const [plantTemp, setPlantTemp] = useState(22);
  const [plantType, setPlantType] = useState('General'); // default plant type to general houseplant
  const [plantCareResult, setPlantCareResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [isSoilMoistureInfoOpen, setSoilMoistureInfoOpen] = useState(false);
  const [isLightLevelInfoOpen, setLightLevelInfoOpen] = useState(false);
  const [isPlantTempInfoOpen, setPlantTempInfoOpen] = useState(false);

  const handleOpenSoilMoistureInfo = () => setSoilMoistureInfoOpen(true);
  const handleCloseSoilMoistureInfo = () => setSoilMoistureInfoOpen(false);

  const handleOpenLightLevelInfo = () => setLightLevelInfoOpen(true);
  const handleCloseLightLevelInfo = () => setLightLevelInfoOpen(false);

  const handleOpenPlantTempInfo = () => setPlantTempInfoOpen(true);
  const handleClosePlantTempInfo = () => setPlantTempInfoOpen(false);
  
  const handleSoilMoistureChange = (event, newValue) => {
    setSoilMoisture(newValue);
  };
  
  const handleLightLevelChange = (event, newValue) => {
    setLightLevel(newValue);
  };
  
  const handlePlantTempChange = (event, newValue) => {
    setPlantTemp(newValue);
  };
  
  const handlePlantTypeChange = (event) => {
    setPlantType(event.target.value);
  };
  
  const calculatePlantCare = async () => {
    try {
      setLoading(true);
      setError(null);
      setPlantCareResult(null);
      
      // send the plant care data to the backend
      const requestData = {
        soil_moisture: soilMoisture,
        light_level: lightLevel,
        temperature: plantTemp,
        plant_type: plantType
      };
      
      try {
        const response = await apiService.post('/api/fuzzy-logic/plant-care', requestData);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setPlantCareResult(response.data);
        }
      } catch (apiError) {
        console.error('Error with /api prefix:', apiError);
        try {
          const response = await apiService.post('/fuzzy-logic/plant-care', requestData);
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setPlantCareResult(response.data);
          }
        } catch (retryError) {
          console.error('Error without /api prefix:', retryError);
          setError('Could not connect to the backend service. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error calculating plant care recommendations:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: theme.palette.text.primary
        }}
      >
        Plant Care Assistant. Get personalised care recommendations for your plants
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}> {/* take full width on extra small screens and 7/12 width on medium screens */}
          <Paper sx={{ p: 3, borderRadius: '12px', mb: 3, backgroundColor: theme.palette.background.paper }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              Input Current Plant Conditions
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <OpacityIcon
                  color="primary"
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography
                  id="soil-moisture-slider"
                  gutterBottom
                  sx={{ color: theme.palette.text.primary }}
                >
                  Soil Moisture: {soilMoisture}%
                </Typography>
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={handleOpenSoilMoistureInfo}
                  aria-label="Soil Moisture Information"
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Slider
                value={soilMoisture}
                onChange={handleSoilMoistureChange}
                aria-labelledby="soil-moisture-slider"
                valueLabelDisplay="auto"
                step={1}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' }
                ]}
                min={0}
                max={100}
                sx={{ color: theme.palette.primary.main }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography 
                  variant="body2"
                  sx={{ 
                    display: 'inline-block', // display inline with other elements, while still allowing width and height to be set
                    width: '33%',
                    textAlign: 'left',
                    color: theme.palette.text.secondary
                  }}>Dry</Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '34%',
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                  }}>Moist</Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '33%',
                    textAlign: 'right',
                    color: theme.palette.text.secondary
                  }}>Wet</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <WbSunnyIcon
                  color="primary"
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography
                  id="light-level-slider"
                  gutterBottom
                  sx={{ color: theme.palette.text.primary }}
                >
                  Light Level: {lightLevel}%
                </Typography>
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={handleOpenLightLevelInfo}
                  aria-label="Light Level Information"
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Slider
                value={lightLevel}
                onChange={handleLightLevelChange}
                aria-labelledby="light-level-slider"
                valueLabelDisplay="auto"
                step={1}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' }
                ]}
                min={0}
                max={100}
                sx={{ color: theme.palette.primary.main }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '33%',
                    textAlign: 'left',
                    color: theme.palette.text.secondary
                  }}>Dark</Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '34%',
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                  }}>Medium</Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '33%',
                    textAlign: 'right',
                    color: theme.palette.text.secondary
                  }}>Bright</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ThermostatIcon
                  color="primary"
                  fontSize="small"
                  sx={{ mr: 1 }}
                />
                <Typography id="plant-temp-slider"
                  gutterBottom
                  sx={{ color: theme.palette.text.primary }}
                >
                  Temperature: {plantTemp}°C
                </Typography>
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={handleOpenPlantTempInfo}
                  aria-label="Temperature Information"
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
              <Slider
                value={plantTemp}
                onChange={handlePlantTempChange}
                aria-labelledby="plant-temp-slider"
                valueLabelDisplay="auto"
                step={1}
                marks={[
                  { value: 0, label: '0°C' },
                  { value: 20, label: '20°C' },
                  { value: 40, label: '40°C' }
                ]}
                min={0}
                max={40}
                sx={{ color: theme.palette.primary.main }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '33%',
                    textAlign: 'left',
                    color: theme.palette.text.secondary
                  }}>Cold</Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '34%',
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                  }}>Moderate</Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    display: 'inline-block',
                    width: '33%',
                    textAlign: 'right',
                    color: theme.palette.text.secondary
                  }}>Hot</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="plant-type-select-label">Plant Type</InputLabel>
                <Select
                  labelId="plant-type-select-label"
                  id="plant-type-select"
                  value={plantType}
                  label="Plant Type"
                  onChange={handlePlantTypeChange}
                >
                  <MenuItem value="General">General Houseplant</MenuItem>
                  <MenuItem value="Succulent">Succulent/Cactus</MenuItem>
                  <MenuItem value="Fern">Fern</MenuItem>
                  <MenuItem value="Orchid">Orchid</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {error && (
              <Paper 
                sx={{ 
                  p: 2,
                  mb: 3,
                  borderRadius: '8px',
                  backgroundColor: theme.palette.error.light,
                  border: `1px solid ${theme.palette.error.main}`,
                  color: theme.palette.error.contrastText
                }}
              >
                <Typography color="inherit">
                  {error}
                </Typography>
              </Paper>
            )}
            
            <Button 
              variant="contained"
              onClick={calculatePlantCare}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Processing...' : 'Generate Plant Care Recommendations'}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          {plantCareResult && !plantCareResult.error ? ( // if there are no errors, display the plant care recommendations
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h6"
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 2,
                  pb: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                Plant Care Recommendations
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ 
                    color: theme.palette.text.primary,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <ScheduleIcon
                    fontSize="small"
                    sx={{ mr: 1, color: theme.palette.info.main }}
                  />
                  Watering Schedule
                </Typography>
                <Card
                  sx={{ 
                    backgroundColor: theme.palette.info.light + '40',
                    mb: 2,
                    border: `1px solid ${theme.palette.info.main + '60'}`
                  }}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.primary }}
                    >
                      {plantCareResult.recommendations.watering} {/* display the watering recommendation */}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <LightModeIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: theme.palette.warning.main
                    }}
                  />
                  Light Recommendation
                </Typography>
                <Card
                  sx={{
                    backgroundColor: theme.palette.warning.light + '40',
                    mb: 2,
                    border: `1px solid ${theme.palette.warning.main + '60'}`
                  }}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {plantCareResult.recommendations.light}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <DeviceThermostatIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: theme.palette.error.main
                    }}
                  />
                  Temperature Recommendation
                </Typography>
                <Card
                  sx={{
                    backgroundColor: theme.palette.error.light + '40',
                    mb: 2,
                    border: `1px solid ${theme.palette.error.main + '60'}`
                  }}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {plantCareResult.recommendations.temperature} {/* display the temperature recommendation */}
                    </Typography>
                  </CardContent>
                </Card>
                
                {plantCareResult.plant_specific_advice && ( // if there is plant-specific advice, display it
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.primary,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                      <HelpOutlineIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          color: theme.palette.success.main
                        }}
                      />
                      Plant-Specific Advice
                    </Typography>
                    <Card
                      sx={{
                        backgroundColor: theme.palette.success.light + '40',
                        mb: 2,
                        border: `1px solid ${theme.palette.success.main + '60'}`
                      }}
                    >
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="body2"
                          sx={{ color: theme.palette.text.primary }}
                        >
                          {plantCareResult.plant_specific_advice}
                        </Typography>
                      </CardContent>
                    </Card>
                  </>
                )}
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.text.primary, mb: 1 }}
                >
                  Current Conditions:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WaterDropIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      // display the soil moisture status and value
                      primary={`Soil: ${plantCareResult.current_conditions.soil_moisture.status} (${plantCareResult.current_conditions.soil_moisture.value}%)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WbSunnyIcon fontSize="small" color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Light: ${plantCareResult.current_conditions.light_level.status} (${plantCareResult.current_conditions.light_level.value}%)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ThermostatIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Temperature: ${plantCareResult.current_conditions.temperature.status} (${plantCareResult.current_conditions.temperature.value}°C)`}
                    />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          ) : plantCareResult && plantCareResult.error ? ( // otherwise, display the error message
            <Paper sx={{ p: 3, borderRadius: '12px', backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }}>
              <Typography color="inherit" variant="subtitle1">
                {plantCareResult.error}
              </Typography>
            </Paper>
          ) : ( // if neither of the above, display the default placeholder message
            <Paper sx={{ 
              p: 3,
              borderRadius: '12px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode ? theme.palette.action.hover : theme.palette.grey[100],
              border: `1px dashed ${theme.palette.divider}`
            }}>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 2 }}>
                Enter your plant's conditions and click "Generate" to get personalised care recommendations.
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Our fuzzy logic system will analyse multiple factors to provide optimal care advice.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={isSoilMoistureInfoOpen}
        onClose={handleCloseSoilMoistureInfo}
        aria-labelledby="soil-moisture-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="soil-moisture-info-dialog-title" sx={{ color: 'text.primary' }}>Soil Moisture Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            How moist the soil feels. 0% is completely dry, 100% is saturated.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSoilMoistureInfo}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isLightLevelInfoOpen}
        onClose={handleCloseLightLevelInfo}
        aria-labelledby="light-level-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="light-level-info-dialog-title" sx={{ color: 'text.primary' }}>Light Level Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Amount of light the plant receives. 0% is complete darkness, 100% is direct bright sunlight.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLightLevelInfo}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isPlantTempInfoOpen}
        onClose={handleClosePlantTempInfo}
        aria-labelledby="plant-temp-info-dialog-title"
        PaperProps={{ sx: { bgcolor: 'background.paper' } }}
      >
        <DialogTitle id="plant-temp-info-dialog-title" sx={{ color: 'text.primary' }}>Temperature Information</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            The ambient temperature around your plant.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePlantTempInfo}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PlantCareScenario;