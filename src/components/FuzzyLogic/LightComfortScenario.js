import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
} from '@mui/material';
import apiService from '../../services/apiService';

const LightComfortScenario = ({ isDarkMode, themeColors }) => {
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState(500);
  const [colorTemp, setColorTemp] = useState(4000);
  const [lightComfortResult, setLightComfortResult] = useState('');
  const [error, setError] = useState(null);
  
  // Default theme colors if props not provided
  const colors = themeColors || {
    primary: { main: '#1976d2', light: 'rgba(25, 118, 210, 0.1)' },
    text: { primary: '#1a1a1a', secondary: '#666' },
    background: { paper: '#ffffff', default: '#f9fafc' },
    border: { color: 'rgba(0, 0, 0, 0.12)' }
  };
  
  const handleIntensityChange = (event, newValue) => {
    setIntensity(newValue);
  };

  const handleColorTempChange = (event, newValue) => {
    setColorTemp(newValue);
  };

  const calculateLightComfort = async () => {
    try {
      setLoading(true);
      setError(null);
      setLightComfortResult('');
      
      console.log('Calculating light comfort with intensity:', intensity, 'and color temperature:', colorTemp);
      
      // Use the special fuzzy logic request method that tries multiple endpoint variants
      const response = await apiService.fuzzyLogicRequest('/fuzzy-logic/light-comfort', {
        intensity,
        color_temp: colorTemp
      });
      
      console.log('Light comfort calculation successful:', response.data);
      setLightComfortResult(response.data.result);
    } catch (error) {
      console.error('Error calculating light comfort result:', error);
      setError('Could not connect to the backend service. Please try again later. Check the browser console for more details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: colors.text.primary }}>
        Adjust the light intensity and color temperature to determine lighting comfort
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography id="intensity-slider" gutterBottom sx={{ color: colors.text.primary }}>
          Light Intensity: {intensity} lux
        </Typography>
        <Slider
          value={intensity}
          onChange={handleIntensityChange}
          aria-labelledby="intensity-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={0}
          max={1000}
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Dim</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Moderate</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Bright</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography id="color-temp-slider" gutterBottom sx={{ color: colors.text.primary }}>
          Color Temperature: {colorTemp} K
        </Typography>
        <Slider
          value={colorTemp}
          onChange={handleColorTempChange}
          aria-labelledby="color-temp-slider"
          valueLabelDisplay="auto"
          step={100}
          marks
          min={2000}
          max={6500}
          sx={{ color: colors.primary.main }}
        />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'left', color: colors.text.secondary }}>Warm</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '34%', textAlign: 'center', color: colors.text.secondary }}>Neutral</Typography>
          <Typography variant="body2" sx={{ display: 'inline-block', width: '33%', textAlign: 'right', color: colors.text.secondary }}>Cool</Typography>
        </Box>
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
        onClick={calculateLightComfort}
        disabled={loading}
        sx={{ 
          mb: 3,
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.8)' : '#1565c0',
          } 
        }}
      >
        {loading ? 'Processing...' : 'Calculate Lighting Comfort'}
      </Button>

      {lightComfortResult && (
        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: '8px', 
            backgroundColor: isDarkMode ? 'rgba(100, 181, 246, 0.1)' : '#f0f7ff',
            border: `1px solid ${isDarkMode ? 'rgba(100, 181, 246, 0.3)' : '#bbdefb'}`
          }}
        >
          <Typography variant="h6" sx={{ color: colors.primary.main, mb: 1 }}>
            Fuzzy Logic Result:
          </Typography>
          <Typography variant="body1" sx={{ color: colors.text.primary }}>
            {lightComfortResult}
          </Typography>
          
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 2 }}>
            The lighting comfort level is calculated by applying fuzzy rules that combine light intensity and color temperature.
            Warmer light (2700-3000K) is generally better for relaxation, while cooler light (5000K+) is better for focus and productivity.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default LightComfortScenario; 