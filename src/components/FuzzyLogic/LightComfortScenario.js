import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';

const LightComfortScenario = ({ isDarkMode, themeColors }) => {
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState(500);
  const [colorTemp, setColorTemp] = useState(4000);
  const [lightComfortResult, setLightComfortResult] = useState('');
  
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
      const response = await axios.post('http://localhost:5000/api/fuzzy-logic/light-comfort', {
        intensity,
        color_temp: colorTemp
      });
      setLightComfortResult(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error('Error calculating light comfort result:', error);
      setLightComfortResult('Error calculating result');
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