import React, { useState } from 'react';
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
  Tooltip,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import apiService from '../../services/apiService';
// Import icons
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LightModeIcon from '@mui/icons-material/LightMode';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

const PlantCareScenario = ({ isDarkMode, themeColors }) => {
  const [loading, setLoading] = useState(false);
  const [soilMoisture, setSoilMoisture] = useState(40);
  const [lightLevel, setLightLevel] = useState(50);
  const [plantTemp, setPlantTemp] = useState(22);
  const [plantType, setPlantType] = useState('General');
  const [plantCareResult, setPlantCareResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Default theme colors if props not provided
  const colors = themeColors || {
    primary: { main: '#1976d2', light: 'rgba(25, 118, 210, 0.1)' },
    text: { primary: '#1a1a1a', secondary: '#666' },
    background: { paper: '#ffffff', default: '#f9fafc' },
    border: { color: 'rgba(0, 0, 0, 0.12)' }
  };
  
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
      
      console.log('Calculating plant care recommendations with:', {
        soilMoisture,
        lightLevel,
        plantTemp,
        plantType
      });
      
      const requestData = {
        soil_moisture: soilMoisture,
        light_level: lightLevel,
        temperature: plantTemp,
        plant_type: plantType
      };
      
      // Use the special fuzzy logic request method that tries multiple endpoint variants
      const response = await apiService.fuzzyLogicRequest('/fuzzy-logic/plant-care', requestData);
      
      console.log('Plant care calculation successful:', response.data);
      setPlantCareResult(response.data);
    } catch (error) {
      console.error('Error calculating plant care recommendations:', error);
      setError('Could not connect to the backend service. Please try again later. Check the browser console for more details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
        Plant Care Assistant - Get personalized care recommendations for your plants
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: '12px', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: colors.text.primary }}>
              Input Current Plant Conditions
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <OpacityIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                <Typography id="soil-moisture-slider" gutterBottom sx={{ color: colors.text.primary }}>
                  Soil Moisture: {soilMoisture}%
                </Typography>
                <Tooltip title="How moist the soil feels. 0% is completely dry, 100% is saturated.">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
                sx={{ color: colors.primary.main }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Dry</Typography>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Moist</Typography>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Wet</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WbSunnyIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                <Typography id="light-level-slider" gutterBottom sx={{ color: colors.text.primary }}>
                  Light Level: {lightLevel}%
                </Typography>
                <Tooltip title="Amount of light the plant receives. 0% is complete darkness, 100% is direct bright sunlight.">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
                sx={{ color: colors.primary.main }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Dark</Typography>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Medium</Typography>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Bright</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThermostatIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                <Typography id="plant-temp-slider" gutterBottom sx={{ color: colors.text.primary }}>
                  Temperature: {plantTemp}°C
                </Typography>
                <Tooltip title="The ambient temperature around your plant.">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
                sx={{ color: colors.primary.main }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Cold</Typography>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Moderate</Typography>
                <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Hot</Typography>
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
                  backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#ffebee',
                  border: `1px solid ${isDarkMode ? 'rgba(244, 67, 54, 0.3)' : '#ffcdd2'}`
                }}
              >
                <Typography color="error">
                  {error}
                </Typography>
              </Paper>
            )}
            
            <Button 
              variant="contained" 
              onClick={calculatePlantCare}
              disabled={loading}
              fullWidth
              sx={{ 
                py: 1.5,
                backgroundColor: colors.primary.main,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.8)' : '#1565c0',
                } 
              }}
            >
              {loading ? 'Processing...' : 'Generate Plant Care Recommendations'}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          {plantCareResult && !plantCareResult.error ? (
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: '12px',
                backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.05)' : '#f6fafd',
                border: `1px solid ${isDarkMode ? 'rgba(100, 181, 246, 0.3)' : '#e3f2fd'}`,
                height: '100%'
              }}
            >
              <Typography variant="h6" sx={{ color: colors.primary.main, mb: 2, pb: 1, borderBottom: `1px solid ${colors.border.color}` }}>
                Plant Care Recommendations
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                  Watering Schedule
                </Typography>
                <Card sx={{ backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : '#e3f2fd', mb: 2 }}>
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>
                      {plantCareResult.recommendations.watering}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, display: 'flex', alignItems: 'center' }}>
                  <LightModeIcon fontSize="small" sx={{ mr: 1 }} />
                  Light Recommendation
                </Typography>
                <Card sx={{ backgroundColor: isDarkMode ? 'rgba(255, 193, 7, 0.1)' : '#fff8e1', mb: 2 }}>
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>
                      {plantCareResult.recommendations.light}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, display: 'flex', alignItems: 'center' }}>
                  <DeviceThermostatIcon fontSize="small" sx={{ mr: 1 }} />
                  Temperature Recommendation
                </Typography>
                <Card sx={{ backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#ffebee', mb: 2 }}>
                  <CardContent sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ color: colors.text.primary }}>
                      {plantCareResult.recommendations.temperature}
                    </Typography>
                  </CardContent>
                </Card>
                
                {plantCareResult.plant_specific_advice && (
                  <>
                    <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1, display: 'flex', alignItems: 'center' }}>
                      Plant-Specific Advice
                    </Typography>
                    <Card sx={{ backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : '#e8f5e9', mb: 2 }}>
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ color: colors.text.primary }}>
                          {plantCareResult.plant_specific_advice}
                        </Typography>
                      </CardContent>
                    </Card>
                  </>
                )}
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: colors.text.primary, mb: 1 }}>
                  Current Conditions:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WaterDropIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Soil: ${plantCareResult.current_conditions.soil_moisture.status} (${plantCareResult.current_conditions.soil_moisture.value}%)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WbSunnyIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Light: ${plantCareResult.current_conditions.light_level.status} (${plantCareResult.current_conditions.light_level.value}%)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ThermostatIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Temperature: ${plantCareResult.current_conditions.temperature.status} (${plantCareResult.current_conditions.temperature.value}°C)`}
                    />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          ) : plantCareResult && plantCareResult.error ? (
            <Paper sx={{ p: 3, borderRadius: '12px', backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.05)' : '#ffebee' }}>
              <Typography color="error" variant="subtitle1">
                {plantCareResult.error}
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ 
              p: 3, 
              borderRadius: '12px', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.1)' : '#f5f5f5'
            }}>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 2 }}>
                Enter your plant's conditions and click "Generate" to get personalized care recommendations.
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Our fuzzy logic system will analyze multiple factors to provide optimal care advice.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlantCareScenario; 